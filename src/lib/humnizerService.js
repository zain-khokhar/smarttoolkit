import nlp from "compromise";

// Validation helper
function validateEnvVars() {
  const REQUIRED = {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  };
  
  const missing = Object.entries(REQUIRED)
    .filter(([_, val]) => !val)
    .map(([key]) => key);
    
  if (missing.length) {
    console.warn(`Missing env vars: ${missing.join(", ")}. Using fallback processing.`);
    return false;
  }
  return true;
}

// Simple text improvement fallback when APIs fail
function improveTextLocally(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/([.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
    .replace(/^[a-z]/, c => c.toUpperCase());
}

async function callDeepSeek(text) {
  if (!validateEnvVars()) {
    return improveTextLocally(text);
  }

  try {
    // Simplified direct fetch instead of SDK to avoid initialization issues
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Improve this text while keeping its meaning: ${text}`
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${await response.text()}`);
    }

    const json = await response.json();
    return json?.choices?.[0]?.message?.content || text;
  } catch (err) {
    console.error("DeepSeek processing failed:", err);
    return improveTextLocally(text);
  }
}

async function callGemini(text) {
  if (!validateEnvVars()) {
    return text;
  }

  try {
    // Direct fetch to Gemini API instead of SDK
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Refine this text while preserving meaning: ${text}`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
    }

    const json = await response.json();
    return json?.candidates?.[0]?.content?.parts?.[0]?.text || text;
  } catch (err) {
    console.error("Gemini processing failed:", err);
    return text;
  }
}

/* ===== lightweight NLP helpers ===== */

function basicGrammarFix(text) {
  // Capitalize sentences (simple)
  return text
    .replace(/([.?!]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
    .replace(/^([a-z])/i, (m) => m.toUpperCase())
    .replace(/\s{2,}/g, " ");
}

function simpleSpellFix(text) {
  const corrections = { teh: "the", recieve: "receive", adress: "address", seperately: "separately" };
  return text.replace(/\b([a-z]+)\b/gi, (m) => corrections[m.toLowerCase()] || m);
}

function toneAdjust(text, tone = "neutral") {
  if (tone === "formal") {
    return text.replace(/\b(can't|won't|don't|I'm|it's)\b/gi, (m) => {
      const map = { "can't": "cannot", "won't": "will not", "don't": "do not", "I'm": "I am", "it's": "it is" };
      return map[m] || m;
    });
  }
  if (tone === "informal") {
    return text.replace(/\b(do not|will not|I am|it is)\b/gi, (m) => {
      const map = { "do not": "don't", "will not": "won't", "I am": "I'm", "it is": "it's" };
      return map[m] || m;
    });
  }
  return text;
}

function simplePlagiarismCheck(text) {
  const sample = [
    "To be, or not to be, that is the question",
    "The quick brown fox jumps over the lazy dog",
    "In the beginning God created the heavens and the earth",
  ];
  const normalize = (s) => s.toLowerCase().replace(/[^a-z\s]/g, "");
  const t = normalize(text);
  let maxOverlap = 0;
  for (const sRaw of sample) {
    const s = normalize(sRaw);
    const sSet = new Set(s.split(/\s+/));
    const tWords = t.split(/\s+/);
    let count = 0;
    for (const w of tWords) if (sSet.has(w)) count++;
    maxOverlap = Math.max(maxOverlap, count / Math.max(1, tWords.length));
  }
  return Math.round(maxOverlap * 100);
}

function summarizeText(text, maxSentences = 2) {
  const doc = nlp(text);
  const sentences = doc.sentences().out("array");
  if (!sentences.length) return "";
  return sentences.slice(0, maxSentences).join(" ");
}

function paraphraseSimple(text) {
  const map = { "in order to": "to", "due to the fact that": "because", "for the purpose of": "for" };
  let out = text;
  for (const k of Object.keys(map)) out = out.replace(new RegExp(k, "gi"), map[k]);
  return out;
}

function sentimentAnalysis(text) {
  const pos = ["good", "great", "happy", "love", "excellent", "positive"];
  const neg = ["bad", "sad", "hate", "poor", "negative", "angry"];
  let score = 0;
  text.toLowerCase().split(/\W+/).forEach((w) => {
    if (pos.includes(w)) score++;
    if (neg.includes(w)) score--;
  });
  if (score > 1) return "Positive";
  if (score < -1) return "Negative";
  return "Neutral";
}

function estimateSyllables(word) {
  word = word.toLowerCase();
  if (!word) return 0;
  const syl = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g);
  return syl ? syl.length : 1;
}

function readabilityScore(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = Math.max(1, (clean.match(/[.?!]/g) || []).length);
  const wordsArr = clean.split(/\s+/);
  const words = Math.max(1, wordsArr.length);
  const syllables = wordsArr.reduce((s, w) => s + estimateSyllables(w), 0);
  const ASL = words / sentences;
  const ASW = syllables / words || 1;
  const flesch = 206.835 - 1.015 * ASL - 84.6 * ASW;
  return `${Math.round(flesch)} (higher = easier)`;
}

function extractKeywords(text, max = 8) {
  const doc = nlp(text);
  const freq = doc.nouns().out("frequency") || [];
  return freq.slice(0, max).map((n) => n.normal);
}

function highlightKeywords(text, keywords = []) {
  if (!keywords.length) return text;
  let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  for (const kw of keywords) {
    const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(`\\b(${esc})\\b`, "gi"), "<mark>$1</mark>");
  }
  return html;
}

function detectLanguage(text, hint = "auto") {
  if (hint && hint !== "auto") return hint;
  if (/[¿¡áéíóúñ]/i.test(text) || /\b(el|la|de|que)\b/i.test(text)) return "es";
  if (/\b(le|la|de|que)\b/i.test(text)) return "fr";
  return "en";
}

/* ===== main pipeline exported ===== */

export async function processTextPipeline(originalText, options = {}) {
  const { tone = "neutral", language = "auto" } = options;

  // Initialize processing state
  let currentText = originalText;
  let processedLanguage = language;
  
  // Stage 1: DeepSeek (with fallback)
  try {
    currentText = await callDeepSeek(currentText);
  } catch (err) {
    console.error("DeepSeek stage failed:", err);
    // Continue with current text
  }

  // Stage 2: Gemini (with fallback)
  try {
    currentText = await callGemini(currentText);
  } catch (err) {
    console.error("Gemini stage failed:", err);
    // Continue with current text
  }

  // Local NLP processing (with error handling)
  try {
    currentText = basicGrammarFix(currentText);
    currentText = simpleSpellFix(currentText);
    currentText = toneAdjust(currentText, tone);
    processedLanguage = detectLanguage(currentText, language);
  } catch (err) {
    console.error("Local NLP processing error:", err);
    // Continue with current text
  }

  // Extract features with error handling
  const features = {
    summary: "",
    sentiment: "Neutral",
    readability: "N/A",
    keywords: [],
    plagiarismScore: 0,
    language: processedLanguage
  };

  try {
    features.summary = summarizeText(currentText, 2);
    features.sentiment = sentimentAnalysis(currentText);
    features.readability = readabilityScore(currentText);
    features.keywords = extractKeywords(currentText);
    features.plagiarismScore = simplePlagiarismCheck(currentText);
  } catch (err) {
    console.error("Feature extraction error:", err);
  }

  return {
    originalText,
    finalText: currentText,
    processedHtml: highlightKeywords(currentText, features.keywords),
    features,
    meta: {
      processedAt: new Date().toISOString(),
      pipeline: ["local-nlp"],
      apiStatus: {
        deepseek: validateEnvVars() ? "configured" : "missing-key",
        gemini: validateEnvVars() ? "configured" : "missing-key"
      }
    }
  };
}

