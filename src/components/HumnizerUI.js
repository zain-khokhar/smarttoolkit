"use client";
import { useState } from "react";

export default function HumnizerUI() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("neutral");
  const [language, setLanguage] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Safe access helper
  const getFeature = (path) => {
    try {
      return result?.features?.[path] || "—";
    } catch (e) {
      return "—";
    }
  };

  async function handleSubmit(e) {
    e?.preventDefault();
    setError("");
    setResult(null);
    
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/humnizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone, language }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || `Server error: ${res.status}`);
      }

      const json = await res.json();
      
      // Validate response structure
      if (!json?.features) {
        throw new Error("Invalid response format from server");
      }

      setResult(json);
    } catch (err) {
      console.error("Humnizer error:", err);
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-3">Humnizer</h2>
        <p className="text-sm text-gray-500 mb-4">Paste text below to humanize and refine it.</p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full mt-2 p-3 border rounded-md text-sm"
            placeholder="Paste your text here..."
            disabled={loading}
          />

          <div className="mt-3 flex gap-3 items-center">
            <label className="text-sm">Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="border rounded px-2 py-1" disabled={loading}>
              <option value="neutral">Neutral</option>
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
              <option value="friendly">Friendly</option>
            </select>

            <label className="text-sm">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border rounded px-2 py-1" disabled={loading}>
              <option value="auto">Auto-detect</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>

            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Processing..." : "Humanize"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-medium">Result</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => result?.finalText && navigator.clipboard.writeText(result.finalText)}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  Copy
                </button>
                <button 
                  onClick={() => {
                    if (!result?.finalText) return;
                    const blob = new Blob([result.finalText], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "humnized.txt";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  Download
                </button>
              </div>
            </div>

            <div className="mt-3 p-4 bg-gray-50 border rounded text-sm">
              {result.processedHtml ? (
                <div dangerouslySetInnerHTML={{ __html: result.processedHtml }} />
              ) : (
                <p>{result.finalText || "No output text"}</p>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 border rounded">
                <strong>Summary</strong>
                <p className="mt-2 text-gray-700">{getFeature('summary')}</p>
              </div>
              <div className="bg-white p-3 border rounded">
                <strong>Sentiment</strong>
                <p className="mt-2 text-gray-700">{getFeature('sentiment')}</p>
                <strong className="mt-2 block">Readability</strong>
                <p className="mt-1 text-gray-700">{getFeature('readability')}</p>
              </div>
              <div className="bg-white p-3 border rounded col-span-2">
                <strong>Keywords</strong>
                <div className="mt-2">
                  {result.features?.keywords?.length ? (
                    result.features.keywords.map((k) => (
                      <span key={k} className="inline-block bg-yellow-100 px-2 py-1 mr-2 mb-1 rounded text-xs">
                        {k}
                      </span>
                    ))
                  ) : "—"}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              <div>Plagiarism Score: {getFeature('plagiarismScore')}</div>
              <div>Detected Language: {getFeature('language')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

