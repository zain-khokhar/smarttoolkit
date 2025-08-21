// "use client"
// // pages/word-counter.js
// import React, { useState, useEffect, useRef } from 'react';
// import { ThemeProvider, useTheme } from 'next-themes'; // For dark/light mode
// import syllable from 'syllable'; // For Flesch score syllable count
// import stringSimilarity from 'string-similarity'; // For internal plagiarism similarity
// import jsPDF from 'jspdf'; // For PDF export
// import { Packer } from 'docx'; // For DOCX export
// import { Document, Paragraph, TextRun } from 'docx';
// import { saveAs } from 'file-saver'; // For file downloads

// // Main functional component for the Word Counter page
// const WordCounter = () => {
//   // State for text input
//   const [text, setText] = useState('');
//   // History for undo/redo
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   // Stats state (updated in real-time)
//   const [stats, setStats] = useState({
//     wordCount: 0,
//     charCount: 0,
//     charCountNoSpaces: 0,
//     sentenceCount: 0,
//     paragraphCount: 0,
//     readingTime: 0,
//     speakingTime: 0,
//     fleschScore: 0,
//     wordFrequency: {},
//     keywordDensity: {},
//   });
//   // For find & replace
//   const [findText, setFindText] = useState('');
//   const [replaceText, setReplaceText] = useState('');
//   // For custom limits
//   const [wordLimit, setWordLimit] = useState(0);
//   const [charLimit, setCharLimit] = useState(0);
//   // For plagiarism results
//   const [plagiarismResult, setPlagiarismResult] = useState(null);
//   // For synonym/grammar suggestions
//   const [selectedWord, setSelectedWord] = useState('');
//   const [synonyms, setSynonyms] = useState([]);
//   const [grammarSuggestions, setGrammarSuggestions] = useState([]);
//   // Dark mode (using next-themes)
//   const { theme, setTheme } = useTheme();
//   // Ref for textarea
//   const textAreaRef = useRef(null);

//   // Function to calculate all stats
//   const calculateStats = (inputText) => {
//     if (!inputText) return { /* default stats */ };
//     const words = inputText.match(/\b\w+\b/g) || [];
//     const sentences = inputText.match(/[^\.!\?]+[\.!\?]+/g) || [];
//     const paragraphs = inputText.split(/\n\s*\n/).filter(p => p.trim());
//     const charCount = inputText.length;
//     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
//     const wordCount = words.length;
//     const sentenceCount = sentences.length;
//     const paragraphCount = paragraphs.length;
//     // Reading time: ~200 wpm
//     const readingTime = Math.ceil(wordCount / 200);
//     // Speaking time: ~150 wpm
//     const speakingTime = Math.ceil(wordCount / 150);
//     // Flesch score calculation
//     const totalSyllables = words.reduce((acc, word) => acc + syllable(word), 0);
//     const avgSentenceLength = wordCount / sentenceCount || 0;
//     const avgSyllablesPerWord = totalSyllables / wordCount || 0;
//     const fleschScore = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
//     // Word frequency
//     const frequency = words.reduce((acc, word) => {
//       const lower = word.toLowerCase();
//       acc[lower] = (acc[lower] || 0) + 1;
//       return acc;
//     }, {});
//     // Keyword density (percentage for each word)
//     const density = Object.fromEntries(
//       Object.entries(frequency).map(([word, count]) => [word, ((count / wordCount) * 100).toFixed(2)])
//     );

//     return {
//       wordCount,
//       charCount,
//       charCountNoSpaces,
//       sentenceCount,
//       paragraphCount,
//       readingTime,
//       speakingTime,
//       fleschScore: fleschScore.toFixed(2),
//       wordFrequency: frequency,
//       keywordDensity: density,
//     };
//   };

//   // Real-time stats update and auto-save
//   useEffect(() => {
//     const newStats = calculateStats(text);
//     setStats(newStats);
//     // Auto-save to localStorage
//     localStorage.setItem('draft', text);
//     // Check limits
//     if (wordLimit > 0 && newStats.wordCount > wordLimit) alert('Word limit exceeded!');
//     if (charLimit > 0 && newStats.charCount > charLimit) alert('Character limit exceeded!');
//   }, [text, wordLimit, charLimit]);

//   // Load draft on mount for auto-save
//   useEffect(() => {
//     const savedDraft = localStorage.getItem('draft');
//     if (savedDraft) setText(savedDraft);
//   }, []);

//   // Function for undo
//   const undo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex(historyIndex - 1);
//       setText(history[historyIndex - 1]);
//     }
//   };

//   // Function for redo
//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex(historyIndex + 1);
//       setText(history[historyIndex + 1]);
//     }
//   };

//   // Update history on text change
//   const handleTextChange = (e) => {
//     const newText = e.target.value;
//     setText(newText);
//     const newHistory = [...history.slice(0, historyIndex + 1), newText];
//     setHistory(newHistory);
//     setHistoryIndex(newHistory.length - 1);
//   };

//   // Clear text
//   const clearText = () => setText('');

//   // Copy text
//   const copyText = () => navigator.clipboard.writeText(text);

//   // Cut text
//   const cutText = () => {
//     navigator.clipboard.writeText(text);
//     setText('');
//   };

//   // Paste (handled by browser, but can add custom if needed)

//   // Text formatting functions
//   const toUpperCase = () => setText(text.toUpperCase());
//   const toLowerCase = () => setText(text.toLowerCase());
//   const toTitleCase = () => setText(text.replace(/\b\w/g, (char) => char.toUpperCase()));
//   const toSentenceCase = () => setText(text.replace(/^\s*([a-z])|[.!?]\s*([a-z])/g, (char) => char.toUpperCase()));
//   const capitalize = toTitleCase; // Alias
//   const removeExtraSpaces = () => setText(text.replace(/\s+/g, ' ').trim());
//   const trimText = () => setText(text.trim());

//   // Find and replace
//   const findReplace = () => setText(text.replace(new RegExp(findText, 'g'), replaceText));

//   // Word highlight (simple CSS highlight for frequency >1)
//   const highlightWords = () => {
//     // For demo, console.log high frequency words; in UI, use spans
//     console.log('Highlighted words:', Object.keys(stats.wordFrequency).filter(word => stats.wordFrequency[word] > 1));
//   };

//   // Plagiarism check (internal + external)
//   const checkPlagiarism = async () => {
//     // Internal: compare with saved drafts (assume array in localStorage)
//     const savedTexts = JSON.parse(localStorage.getItem('savedTexts') || '[]');
//     const internalSimilarities = savedTexts.map(saved => stringSimilarity.compareTwoStrings(text, saved));
//     const maxInternal = Math.max(...internalSimilarities) * 100;
//     // External: Winston AI API (placeholder, replace with real call)
//     try {
//       const response = await fetch('https://api.gowinston.ai/v1/plagiarism', { // Endpoint from docs
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${process.env.WINSTON_API_KEY}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text }),
//       });
//       const data = await response.json();
//       const externalScore = data.score; // Assume score from API
//       setPlagiarismResult({ internal: maxInternal.toFixed(2), external: externalScore });
//     } catch (error) {
//       console.error('Plagiarism API error:', error);
//     }
//   };

//   // Synonym suggestions (on word select)
//   const getSynonyms = async (word) => {
//     try {
//       const response = await fetch(`http://words.bighugelabs.com/api/2/${process.env.BIG_HUGE_KEY}/${word}/json`);
//       const data = await response.json();
//       setSynonyms(data.noun?.syn || []);
//     } catch (error) {
//       console.error('Synonym API error:', error);
//     }
//   };

//   // Grammar suggestions
//   const getGrammarSuggestions = async () => {
//     try {
//       const response = await fetch('https://api.grammarbot.io/v2/check', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text, language: 'en-US' }),
//       });
//       const data = await response.json();
//       setGrammarSuggestions(data.matches);
//     } catch (error) {
//       console.error('Grammar API error:', error);
//     }
//   };

//   // Export functions
//   const exportTXT = () => {
//     const blob = new Blob([text], { type: 'text/plain' });
//     saveAs(blob, 'document.txt');
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text(text, 10, 10);
//     doc.save('document.pdf');
//   };

//   const exportDOCX = async () => {
//     const doc = new Document({
//       sections: [{ properties: {}, children: [new Paragraph({ children: [new TextRun(text)] })] }],
//     });
//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, 'document.docx');
//   };

//   // Share link (simple copy, or backend for real share)
//   const shareLink = () => {
//     // For demo, copy text; real: generate URL
//     copyText();
//     alert('Text copied! Share manually.');
//   };

//   // UI rendering
//   return (
//     <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
//       {/* Toolbar */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {/* Formatting buttons with transitions */}
//         <button className="btn" onClick={toUpperCase}>Uppercase</button>
//         <button className="btn" onClick={toLowerCase}>Lowercase</button>
//         {/* ... other formatting buttons */}
//         <input type="text" placeholder="Find" onChange={(e) => setFindText(e.target.value)} className="input" />
//         <input type="text" placeholder="Replace" onChange={(e) => setReplaceText(e.target.value)} className="input" />
//         <button className="btn" onClick={findReplace}>Replace</button>
//         {/* Editing */}
//         <button className="btn" onClick={undo}>Undo</button>
//         <button className="btn" onClick={redo}>Redo</button>
//         <button className="btn" onClick={clearText}>Clear</button>
//         <button className="btn" onClick={copyText}>Copy</button>
//         <button className="btn" onClick={cutText}>Cut</button>
//         {/* Advanced */}
//         <button className="btn" onClick={checkPlagiarism}>Check Plagiarism</button>
//         <button className="btn" onClick={getGrammarSuggestions}>Grammar Check</button>
//         <button className="btn" onClick={() => getSynonyms(selectedWord)}>Synonyms for {selectedWord}</button>
//         <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Mode</button>
//         {/* Exports */}
//         <button className="btn" onClick={exportTXT}>TXT</button>
//         <button className="btn" onClick={exportPDF}>PDF</button>
//         <button className="btn" onClick={exportDOCX}>DOCX</button>
//         <button className="btn" onClick={shareLink}>Share</button>
//         {/* Limits */}
//         <input type="number" placeholder="Word Limit" onChange={(e) => setWordLimit(Number(e.target.value))} className="input" />
//         <input type="number" placeholder="Char Limit" onChange={(e) => setCharLimit(Number(e.target.value))} className="input" />
//       </div>
//       {/* Text Input */}
//       <textarea
//         ref={textAreaRef}
//         value={text}
//         onChange={handleTextChange}
//         onSelect={(e) => setSelectedWord(e.target.value.slice(e.target.selectionStart, e.target.selectionEnd))}
//         className="w-full h-64 p-2 border rounded mb-4 transition-all duration-300"
//         placeholder="Enter your text here..."
//       />
//       {/* Stats Panel */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div>Words: {stats.wordCount}</div>
//         <div>Chars (with spaces): {stats.charCount}</div>
//         <div>Chars (no spaces): {stats.charCountNoSpaces}</div>
//         <div>Sentences: {stats.sentenceCount}</div>
//         <div>Paragraphs: {stats.paragraphCount}</div>
//         <div>Reading Time: {stats.readingTime} min</div>
//         <div>Speaking Time: {stats.speakingTime} min</div>
//         <div>Flesch Score: {stats.fleschScore}</div>
//         {/* Plagiarism */}
//         {plagiarismResult && (
//           <div>Plagiarism: Internal {plagiarismResult.internal}%, External {plagiarismResult.external}%</div>
//         )}
//         {/* Grammar Suggestions */}
//         {grammarSuggestions.length > 0 && (
//           <ul>
//             {grammarSuggestions.map((sug, i) => <li key={i}>{sug.message}</li>)}
//           </ul>
//         )}
//         {/* Synonyms */}
//         {synonyms.length > 0 && (
//           <ul>
//             {synonyms.map((syn, i) => <li key={i}>{syn}</li>)}
//           </ul>
//         )}
//         {/* Word Frequency Table */}
//         <table className="table-auto">
//           <thead><tr><th>Word</th><th>Frequency</th><th>Density</th></tr></thead>
//           <tbody>
//             {Object.entries(stats.wordFrequency).map(([word, freq]) => (
//               <tr key={word}><td>{word}</td><td>{freq}</td><td>{stats.keywordDensity[word]}%</td></tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // Wrap with ThemeProvider
// export default function Page() {
//   return (
//     <ThemeProvider attribute="class">
//       <WordCounter />
//     </ThemeProvider>
//   );
// }

// // CSS classes (add to global.css or inline)
// const styles = `
// .btn { padding: 0.5rem 1rem; background: blue; color: white; border-radius: 0.25rem; transition: background 0.3s; }
// .btn:hover { background: darkblue; }
// .input { padding: 0.5rem; border: 1px solid gray; border-radius: 0.25rem; }
// `;


"use client"
import React, { useEffect, useRef, useState } from "react";

/*
  Premium Word Counter - Next.js Page (single-file starter)
  ---------------------------------------------------------
  - This is a modular, commented Next.js-compatible React component that
    demonstrates a premium word-counter/editor UI and many advanced features.
  - It's intentionally a single-file starter for clarity. In production,
    split into smaller components and add a proper backend for plagiarism,
    synonyms, grammar, and exporting.

  Notes / Integration hints:
  - Plagiarism (external): implement a secure server-side API route that
    calls Turnitin/Quetext/Copyscape or your own indexed search engine.
  - Plagiarism (internal): create a pre-indexed n-gram database (hash map)
    and host it behind an API; this example includes a local mock checker.
  - Grammar/synonyms: call LanguageTool / Datamuse / Thesaurus APIs server-side.
  - Export to PDF/DOCX: use jsPDF / docx libraries (install via npm).
  - Rich text editing: for heavy formatting replace textarea with Lexical/Tiptap.
*/

export default function PremiumWordCounterPage() {
  // Editor state
  const [text, setText] = useState(LOCAL_LOAD("premium_wordcounter_draft") || "");
  const [isDark, setIsDark] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // Undo/Redo stacks
  const historyRef = useRef({ stack: [text], idx: 0, locked: false });

  // UI helpers
  const [highlightWord, setHighlightWord] = useState("");
  const [freqMap, setFreqMap] = useState({});
  const [plagiarismReport, setPlagiarismReport] = useState(null);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);
  const [customWordLimit, setCustomWordLimit] = useState(0);
  const [alerts, setAlerts] = useState([]);

  // Refs
  const textareaRef = useRef(null);
                   // word count useeffect
                   useEffect(() => {
  const words = text.trim().split(/\s+/).length;
  setWordCount(words);
}, [text]);



  // Effect: update frequency map & push to history & autosave
  useEffect(() => {
    // compute frequency map
    setFreqMap(computeFrequency(text));

    // push to history (debounced)
    if (!historyRef.current.locked) {
      historyRef.current.locked = true;
      setTimeout(() => {
        pushHistory(text);
        historyRef.current.locked = false;
      }, 350); // debounce
    }

    if (autoSave) {
      LOCAL_SAVE("premium_wordcounter_draft", text);
    }

    // custom limits alert
    if (customWordLimit > 0) {
      const w = computeStats(text).words;
      if (w > customWordLimit) {
        pushAlert(`Word limit exceeded: ${w} / ${customWordLimit}`);
      }
    }
  }, [text]);

  // Helper: localStorage load
  function LOCAL_LOAD(key) {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(key) || null;
    } catch (e) {
      return null;
    }
  }

  // Helper: localStorage save
  function LOCAL_SAVE(key, value) {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(key, value);
    } catch (e) {
      // ignore
    }
  }

  // --- History (undo/redo) ---
  function pushHistory(newText) {
    const { stack, idx } = historyRef.current;
    const head = stack.slice(0, idx + 1);
    head.push(newText);
    // limit history size for memory
    if (head.length > 50) head.shift();
    historyRef.current.stack = head;
    historyRef.current.idx = head.length - 1;
  }

  function undo() {
    const h = historyRef.current;
    if (h.idx > 0) {
      h.idx -= 1;
      setText(h.stack[h.idx]);
    }
  }

  function redo() {
    const h = historyRef.current;
    if (h.idx < h.stack.length - 1) {
      h.idx += 1;
      setText(h.stack[h.idx]);
    }
  }

  // --- Basic formatting helpers ---
  function applyFormat(mode) {
    let t = text;
    switch (mode) {
      case "upper":
        t = t.toUpperCase();
        break;
      case "lower":
        t = t.toLowerCase();
        break;
      case "title":
        t = t
          .toLowerCase()
          .split(/\s+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        break;
      case "sentence":
        t = t
          .toLowerCase()
          .replace(/([^.!?]\s*)([a-z])/g, (m) => m.toUpperCase());
        break;
      case "trim":
        t = t.trim();
        break;
      case "remove-spaces":
        t = t.replace(/\s+/g, " ").trim();
        break;
      default:
        break;
    }
    setText(t);
  }

  function findAndReplace(findStr, replaceStr, flags = "g") {
    if (!findStr) return;
    try {
      const re = new RegExp(escapeRegex(findStr), flags);
      setText(text.replace(re, replaceStr));
    } catch (e) {
      pushAlert("Invalid regex in Find & Replace");
    }
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
  }

  // --- Stats computation ---
  function computeStats(t) {
    const sanitized = t.replace(/[\u200B-\u200D\uFEFF]/g, "");
    const chars = sanitized.length;
    const charsNoSpaces = sanitized.replace(/\s/g, "").length;
    // words: split by whitespace, filter empties
    const words = sanitized.split(/\s+/).filter(Boolean).length;
    // sentences: rough split on punctuation followed by space OR line breaks
    const sentences = sanitized.split(/[.!?]+\s|\n+/).filter(Boolean).length;
    const paragraphs = sanitized.split(/\n{2,}/).filter((p) => p.trim().length > 0).length || (sanitized.trim() ? 1 : 0);
    const readingTimeMins = words / 200; // avg 200 wpm
    const speakingTimeMins = words / 130; // avg 130 wpm
    const fleschScore = computeFleschReadingEase(sanitized);

    return {
      chars,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTimeMins,
      speakingTimeMins,
      fleschScore,
    };
  }

  // Rough syllable estimator for Flesch score (English heuristic)
  function estimateSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    const vowels = word.match(/[aeiouy]{1,2}/g);
    let syll = vowels ? vowels.length : 0;
    // subtract silent e
    if (word.endsWith("e")) syll -= 1;
    if (syll === 0) syll = 1;
    return syll;
  }

  function computeFleschReadingEase(t) {
    const wordsArr = t.match(/\b[\w']+\b/g) || [];
    const words = wordsArr.length || 1;
    const sentences = Math.max(1, t.split(/[.!?]+\s|\n+/).filter(Boolean).length);
    const syllables = wordsArr.reduce((acc, w) => acc + estimateSyllables(w), 0);
    // Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Number(score.toFixed(2));
  }

  // --- Frequency map & highlight ---
  function computeFrequency(t) {
    const words = (t || "").toLowerCase().match(/\b[\w']+\b/g) || [];
    const map = {};
    words.forEach((w) => (map[w] = (map[w] || 0) + 1));
    return map;
  }

  function renderHighlightedHTML(t, highlight) {
    if (!highlight) return escapeHtml(t).replace(/\n/g, "<br />");
    const escaped = escapeHtml(t);
    const re = new RegExp(`(\\b${escapeRegex(highlight)}\\b)`, "ig");
    return escaped.replace(re, "<mark>$1</mark>").replace(/\n/g, "<br />");
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- Alerts helper ---
  function pushAlert(msg) {
    setAlerts((a) => [...a.slice(-4), `${new Date().toLocaleTimeString()}: ${msg}`]);
  }

  // --- Export helpers (TXT/PDF/DOCX placeholders) ---
  function downloadTxt(filename = "text.txt") {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadPdf(filename = "text.pdf") {
    // dynamic import to avoid heavy libs unless used
    try {
      const { jsPDF } = await import("jspdf"); // npm i jspdf
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, 10);
      doc.save(filename);
    } catch (e) {
      pushAlert("Install 'jspdf' for PDF export or implement a server-side render.");
    }
  }

  async function downloadDocx(filename = "text.docx") {
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx"); // npm i docx
      const doc = new Document({ sections: [{ properties: {}, children: [new Paragraph({ children: [new TextRun(text)] })] }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      pushAlert("Install 'docx' library for DOCX export.");
    }
  }

  // --- Plagiarism checks (local & external placeholders) ---
  function localPreIndexedCheck(t) {
    // Fast n-gram hashing method
    // This is a MOCK example. In production, create a server-side index
    // of n-grams (3-5) hashed to source lists and query it.

    const n = 4; // n-gram size
    const tokens = (t || "").toLowerCase().match(/\b[\w']+\b/g) || [];
    const grams = [];
    for (let i = 0; i <= tokens.length - n; i++) grams.push(tokens.slice(i, i + n).join(" "));

    // mock 'database' entries
    const mockIndex = {
      "the quick brown fox": ["example.com/article1"],
      "lorem ipsum dolor sit": ["lorem.com/ipsum"],
    };

    const matches = [];
    grams.forEach((g) => {
      if (mockIndex[g]) {
        matches.push({ ngram: g, sources: mockIndex[g] });
      }
    });

    const percentage = grams.length ? Math.round((matches.length / grams.length) * 100) : 0;
    return { matches, percentage };
  }

  async function externalPlagiarismCheck(t) {
    // In production: POST text to your server API which calls a paid plagiarism API
    // (Turnitin/Scribbr/Copyscape) or your custom search cluster.
    setIsCheckingPlagiarism(true);
    try {
      // Example placeholder call
      // const res = await fetch('/api/plagiarism', { method: 'POST', body: JSON.stringify({ text: t }) });
      // const data = await res.json();

      // Simulate a slow, accurate external check
      await new Promise((r) => setTimeout(r, 1200));
      // MOCK result: pretend we've matched an online source
      const data = { percentage: 7, topMatches: [{ source: "https://example.com/article", excerpt: "lorem ipsum dolor" }] };
      setPlagiarismReport(data);
      setIsCheckingPlagiarism(false);
      return data;
    } catch (e) {
      setIsCheckingPlagiarism(false);
      pushAlert("External plagiarism check failed. Implement server-side API.");
      return null;
    }
  }

  // --- Synonyms / Grammar suggestions (placeholders) ---
  async function fetchSynonyms(word) {
    // In production call Datamuse or Thesaurus API server-side
    // Example: GET https://api.datamuse.com/words?rel_syn=${word}
    return [word + "_syn1", word + "_syn2"];
  }

  async function grammarSuggestions(t) {
    // Suggest hooking into LanguageTool or Grammarly API server-side.
    return [{ index: 10, length: 5, suggestion: "change this" }];
  }

  // --- UI actions ---
  function clearText() {
    setText("");
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(text).then(() => pushAlert("Copied to clipboard"));
  }

  // --- Small helpers for UI display ---
  const stats = computeStats(text);

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Premium WordCounter</h1>
            <div className="flex gap-3 items-center">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} /> Auto-save
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={offlineMode} onChange={(e) => setOfflineMode(e.target.checked)} /> Offline
              </label>
              <button
                className="px-3 py-1 rounded border hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => setIsDark((d) => !d)}
                aria-label="Toggle dark">
                {isDark ? "Light" : "Dark"}
              </button>
            </div>
          </header>

          {/* Main grid: Editor + Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Editor area */}
            <section className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 items-center mb-3">
                <button className="btn" onClick={() => applyFormat("upper")}>UPPER</button>
                <button className="btn" onClick={() => applyFormat("lower")}>lower</button>
                <button className="btn" onClick={() => applyFormat("title")}>Title Case</button>
                <button className="btn" onClick={() => applyFormat("sentence")}>Sentence case</button>
                <button className="btn" onClick={() => applyFormat("remove-spaces")}>Remove Extra Spaces</button>
                <button className="btn" onClick={() => applyFormat("trim")}>Trim</button>

                <div className="ml-auto flex gap-2">
                  <button className="btn" onClick={undo}>Undo</button>
                  <button className="btn" onClick={redo}>Redo</button>
                  <button className="btn" onClick={clearText}>Clear</button>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full min-h-[320px] p-4 rounded bg-gray-50 dark:bg-gray-900 dark:text-gray-100 resize-vertical focus:ring"
              />

              {/* Find & Replace */}
              <div className="mt-3 flex gap-2 items-center">
                <input id="find" placeholder="Find" className="input" />
                <input id="replace" placeholder="Replace" className="input" />
                <button className="btn" onClick={() => findAndReplace(document.getElementById("find").value, document.getElementById("replace").value)}>Replace</button>
              </div>

              {/* Export & quick actions */}
              <div className="mt-4 flex gap-2">
                <button className="btn-primary" onClick={() => downloadTxt()}>Download TXT</button>
                <button className="btn-primary" onClick={() => downloadPdf()}>Download PDF</button>
                <button className="btn-primary" onClick={() => downloadDocx()}>Download DOCX</button>
                <button className="btn" onClick={copyToClipboard}>Copy</button>
                <button className="btn" onClick={() => { setIsCheckingPlagiarism(true); const local = localPreIndexedCheck(text); setPlagiarismReport(local); setIsCheckingPlagiarism(false); }}>Local Plagiarism</button>
                <button className="btn" onClick={() => externalPlagiarismCheck(text)}>External Plagiarism</button>
              </div>

              {/* Alerts */}
              <div className="mt-4">
                {alerts.map((a, i) => (
                  <div key={i} className="text-sm text-red-500">{a}</div>
                ))}
              </div>

              {/* Highlight preview */}
              <div className="mt-6">
                <label className="text-sm">Highlight word (preview):</label>
                <input className="input mt-1" value={highlightWord} onChange={(e) => setHighlightWord(e.target.value)} placeholder="word to highlight" />
                <div className="mt-3 p-3 rounded bg-white/50 dark:bg-gray-700/50 border" dangerouslySetInnerHTML={{ __html: renderHighlightedHTML(text, highlightWord) }} />
              </div>
            </section>

            {/* Right panel: Stats, Frequency, Plagiarism report & extras */}
            <aside className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <h2 className="font-semibold mb-2">Live Stats</h2>
              <ul className="text-sm space-y-1">
                <li>Words: <strong>{wordCount}</strong></li>
                <li>Chars (with spaces): <strong>{stats.chars}</strong></li>
                <li>Chars (no spaces): <strong>{stats.charsNoSpaces}</strong></li>
                <li>Sentences: <strong>{stats.sentences}</strong></li>
                <li>Paragraphs: <strong>{stats.paragraphs}</strong></li>
                <li>Reading time (min): <strong>{Number(stats.readingTimeMins.toFixed(2))}</strong></li>
                <li>Speaking time (min): <strong>{Number(stats.speakingTimeMins.toFixed(2))}</strong></li>
                <li>Flesch reading ease: <strong>{stats.fleschScore}</strong></li>
              </ul>

              <hr className="my-3" />

              <div>
                <h3 className="font-medium">Top words</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(freqMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([w, c]) => (
                      <button key={w} className="px-2 py-1 rounded border text-sm" onClick={() => setHighlightWord(w)}>{w} ({c})</button>
                    ))}
                </div>
              </div>

              <hr className="my-3" />

              <div>
                <h3 className="font-medium">Plagiarism</h3>
                {isCheckingPlagiarism ? (
                  <div className="text-sm">Checking...</div>
                ) : plagiarismReport ? (
                  <div className="text-sm space-y-1">
                    <div>Match Percentage: <strong>{plagiarismReport.percentage}%</strong></div>
                    {plagiarismReport.matches ? (
                      <div>
                        <div className="text-xs text-muted">Local matches (n-grams):</div>
                        {plagiarismReport.matches.slice(0, 5).map((m, i) => (
                          <div key={i} className="text-xs">{m.ngram} → {m.sources.join(", ")}</div>
                        ))}
                      </div>
                    ) : null}
                    {plagiarismReport.topMatches ? (
                      <div>
                        <div className="text-xs text-muted mt-1">Top external matches:</div>
                        {plagiarismReport.topMatches.map((m, i) => (
                          <div key={i} className="text-xs"><a href={m.source} target="_blank" rel="noreferrer" className="underline">{m.source}</a> — {m.excerpt}</div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-xs text-muted">No plagiarism check run yet.</div>
                )}
              </div>

              <hr className="my-3" />

              <div>
                <h3 className="font-medium">Extras</h3>
                <div className="mt-2 text-sm">
                  <label className="block">Custom word limit</label>
                  <input type="number" className="input mt-1" value={customWordLimit || ""} onChange={(e) => setCustomWordLimit(Number(e.target.value))} placeholder="e.g. 500" />
                </div>

                <div className="mt-3">
                  <button className="btn" onClick={() => fetchSynonyms(promptForWord())}>Get Synonyms (for word)</button>
                </div>
              </div>

              <hr className="my-3" />

              <div>
                <h3 className="font-medium">Session</h3>
                <div className="text-xs">Auto-save: {autoSave ? "On" : "Off"}</div>
                <div className="text-xs">Offline Mode: {offlineMode ? "On" : "Off"}</div>
                <div className="text-xs mt-2">Draft saved: <em>{LOCAL_LOAD("premium_wordcounter_draft") ? "Yes" : "No"}</em></div>
              </div>
            </aside>
          </div>

          {/* Footer notes */}
          <footer className="mt-6 text-sm text-muted">
            <p>
              This starter implements many UI/UX and algorithmic ideas. For enterprise-level
              plagiarism accuracy, integrate a server-side index + paid plagiarism API (Turnitin,
              Scribbr, Copyscape) and perform heavy matching on the backend.
            </p>
          </footer>
        </div>
      </div>

      {/* Minimal styles used here to avoid external CSS requirement. In production
          prefer Tailwind config and separate CSS files. */}
      <style jsx>{`
        .btn { padding: 6px 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: transparent; }
        .btn:hover { background: rgba(0,0,0,0.03); }
        .btn-primary { padding: 8px 12px; border-radius: 8px; background: #2563eb; color: white; }
        .input { padding: 8px 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: white; }
        .text-muted { color: rgba(255,255,255,0.7); }
      `}</style>
    </div>
  );

  // small helper for prompt-based synonyms demo
  function promptForWord() {
    const w = prompt("Enter a word to fetch synonyms for:");
    return w || "";
  }
}
