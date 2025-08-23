"use client";

import React, { useState, useRef, useEffect } from "react";

/**
 * SKT — Live Image Compressor & Converter (UI improved)
 * - Premium dark gradient theme (Tailwind)
 * - Responsive layout, subtle animations
 * - Drag & drop area with focus/ring animation
 * - Loading spinner while processing
 * - Savings progress bar + percentage
 * - Accessible labels and improved buttons
 *
 * Functionality preserved from original; only UI/UX improved.
 */

export default function ImageTool() {
  const [file, setFile] = useState(null); // original File
  const [origSrc, setOrigSrc] = useState("");
  const [origInfo, setOrigInfo] = useState(null);

  const [mode, setMode] = useState("compress"); // compress | convert

  // compressor state
  const [quality, setQuality] = useState(0.8);
  const [resizePct, setResizePct] = useState(100);

  // converter state
  const [format, setFormat] = useState("image/webp");

  const [resultBlob, setResultBlob] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [resultInfo, setResultInfo] = useState(null);

  const [processing, setProcessing] = useState(false);

  const dropRef = useRef();
  const canvasRef = useRef(null);

  // Initialize canvas ref on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      canvasRef.current = document.createElement("canvas");
    }
  }, []);

  const SAMPLE_PATH = '/vercel.svg'; // Using vercel.svg which exists in public folder
  const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
      <rect width='100%' height='100%' fill='%23121212'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23777' font-size='20'>
        a(1).png not found — drop an image or choose file
      </text>
    </svg>
  `)}`;

  useEffect(() => {
    const loadSampleImage = async () => {
      try {
        // Pre-load the image to verify it exists
        const img = new Image();
        img.src = SAMPLE_PATH;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('Sample image not found'));
        });
        setOrigSrc(SAMPLE_PATH);
      } catch (error) {
        console.warn('Failed to load sample image:', error);
        setOrigSrc(PLACEHOLDER);
      }
    };
    loadSampleImage();
  }, []);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setOrigSrc(url);
    setOrigInfo({ name: f.name, size: f.size, type: f.type });
    setResultBlob(null);
    setResultUrl("");
    setResultInfo(null);
  };

  // Drag/drop handlers with smoother UX
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDragOver = (e) => {
      e.preventDefault();
      el.classList.add("ring-4", "ring-offset-2", "ring-sky-500", "scale-[1.01]");
    };
    const onLeave = (e) => {
      e.preventDefault();
      el.classList.remove("ring-4", "ring-offset-2", "ring-sky-500", "scale-[1.01]");
    };
    const onDrop = (e) => {
      e.preventDefault();
      el.classList.remove("ring-4", "ring-offset-2", "ring-sky-500", "scale-[1.01]");
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files[0]) {
        handleFile(dt.files[0]);
      }
    };
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, []);

  // Create result whenever inputs change
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setProcessing(true);
      try {
        const src = origSrc || PLACEHOLDER;
        const img = await loadImageElement(src, file);
        if (cancelled) return;

        if (!file && origSrc) {
          setOrigInfo((prev) => prev || { name: "sample.jpg (public)", size: null, type: img.src.split(";")[0] || "image/*" });
        }

        if (mode === "compress") {
          const outMime = guessMimeForCompression(file?.type || img.src) || "image/jpeg";
          const blob = await compressImageWithCanvas(img, { quality, resizePct, mimeType: outMime });
          if (cancelled) return;
          setResultBlob(blob);
          const u = URL.createObjectURL(blob);
          setResultUrl(u);
          setResultInfo({ size: blob.size, type: blob.type, width: Math.max(1, Math.round(img.width * (resizePct / 100))), height: Math.max(1, Math.round(img.height * (resizePct / 100))) });
        } else {
          const outMime = format;
          const blob = await compressImageWithCanvas(img, { quality, resizePct, mimeType: outMime });
          if (cancelled) return;
          setResultBlob(blob);
          const u = URL.createObjectURL(blob);
          setResultUrl(u);
          setResultInfo({ size: blob.size, type: blob.type, width: Math.max(1, Math.round(img.width * (resizePct / 100))), height: Math.max(1, Math.round(img.height * (resizePct / 100))) });
        }
      } catch (err) {
        console.error("Image load failed:", err);
        setOrigSrc(PLACEHOLDER);
      } finally {
        if (!cancelled) setProcessing(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [origSrc, file, mode, quality, resizePct, format]);

  // helpers
  function humanFileSize(bytes) {
    if (!bytes && bytes !== 0) return "—";
    const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${["B", "KB", "MB", "GB"][i]}`;
  }

  const savedPercent = (() => {
    if (!origInfo?.size || !resultInfo?.size) return 0;
    const diff = Math.max(0, origInfo.size - resultInfo.size);
    return Math.round((diff / (origInfo.size || 1)) * 100);
  })();

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-black via-neutral-900 to-slate-900 text-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg transform-gpu">
                  {/* SKT logo (simple) */}
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="1" y="1" width="22" height="22" rx="5" fill="white" opacity="0.06"></rect>
                    <text x="50%" y="58%" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">SKT</text>
                  </svg>
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">SKT — Image Compressor & Converter</h1>
                  <p className="text-sm text-gray-400 mt-0.5">Reduce image size without losing quality — client-side, fast & private.</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-600">Beta</span>
              <button
                className="text-sm px-3 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 transition-transform rounded shadow"
                onClick={() => alert("Pro features coming soon ✨")}
              >
                Upgrade (coming)
              </button>
            </div>
          </div>
        </header>

        {/* Main card */}
        <main className="bg-gradient-to-b from-neutral-900/60 to-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 shadow-2xl">
          {/* Controls row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${mode === "compress" ? "bg-sky-600 text-white shadow-md" : "bg-neutral-800 text-gray-300 hover:bg-neutral-800/60"}`}
                onClick={() => setMode("compress")}
                aria-pressed={mode === "compress"}
              >
                Compressor
              </button>
              <button
                className={`px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${mode === "convert" ? "bg-sky-600 text-white shadow-md" : "bg-neutral-800 text-gray-300 hover:bg-neutral-800/60"}`}
                onClick={() => setMode("convert")}
                aria-pressed={mode === "convert"}
              >
                Converter
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400">Mode</div>
              <div className="hidden sm:block text-xs text-gray-400">Quality & resize applied live — try lower quality for big savings.</div>
            </div>
          </div>

          {/* Content grid */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: drop + info */}
            <div className="lg:col-span-5">
              <div
                ref={dropRef}
                className="relative border border-neutral-800/60 rounded-xl p-4 flex flex-col gap-4 transition-transform transform-gpu hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-sky-500"
                aria-label="Drop area"
              >
                <div className="flex items-center gap-4">
                  <div className="w-28 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center border border-neutral-700">
                    <img
                      src={origSrc || PLACEHOLDER}
                      alt="original preview"
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">Drag & drop an image or choose a file</p>
                    <p className="text-xs text-gray-400 mt-1">Client-side only — your images never leave the browser.</p>

                    <div className="mt-3 flex gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.01] transition-transform">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Choose file
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                        />
                      </label>

                      <button
                        className="px-3 py-2 rounded-md bg-neutral-800 text-gray-200 hover:bg-neutral-800/70 transition"
                        onClick={async () => {
                          setFile(null);
                          setOrigInfo(null);
                          try {
                            // Pre-load the image to verify it exists
                            const img = new Image();
                            img.src = SAMPLE_PATH;
                            await new Promise((resolve, reject) => {
                              img.onload = resolve;
                              img.onerror = () => reject(new Error('Sample image not found'));
                            });
                            setOrigSrc(SAMPLE_PATH);
                          } catch (error) {
                            console.warn('Failed to load sample image:', error);
                            setOrigSrc(PLACEHOLDER);
                          }
                        }}
                      >
                        Use sample
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-1">
                  <div>
                    <div className="text-[13px] text-gray-200">Original</div>
                    <div className="mt-1 text-sm text-gray-200">{origInfo?.name || "sample.jpg"}</div>
                    <div className="text-xs text-gray-400">{origInfo?.type || "—"}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[13px] text-gray-200">Size</div>
                    <div className="mt-1 text-sm text-gray-200">{humanFileSize(origInfo?.size)}</div>
                    <div className="text-xs text-gray-400">{origInfo?.width ? `${origInfo.width}×${origInfo.height}` : ""}</div>
                  </div>
                </div>

                {/* subtle footer */}
                <div className="absolute right-3 bottom-3 text-xs text-gray-500">{processing ? <span className="inline-flex items-center gap-2"><Spinner /> Processing</span> : <span>Ready</span>}</div>
              </div>

              {/* Settings compact for narrow screens */}
              <div className="mt-4 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
                <div className="text-sm font-medium text-gray-200 mb-2">Settings</div>

                <div className="mb-3">
                  <label className="block text-xs text-gray-400">Quality <span className="text-sm text-gray-200 ml-1">({Math.round(quality * 100)}%)</span></label>
                  <input aria-label="quality" type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full mt-2" />
                </div>

                <div className="mb-3">
                  <label className="block text-xs text-gray-400">Resize % <span className="text-sm text-gray-200 ml-1">({resizePct}%)</span></label>
                  <input aria-label="resize" type="range" min="25" max="100" step="5" value={resizePct} onChange={(e) => setResizePct(parseInt(e.target.value))} className="w-full mt-2" />
                </div>

                {mode === "convert" && (
                  <div className="mb-2">
                    <label className="block text-xs text-gray-400">Output format</label>
                    <select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-1 bg-neutral-800 text-gray-200 text-sm rounded-md p-2 w-full">
                      <option value="image/webp">WebP (recommended)</option>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG (lossless)</option>
                    </select>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <a
                    className={`flex-1 text-center px-3 py-2 rounded-md font-medium transition ${resultBlob ? "bg-emerald-500 text-black" : "bg-neutral-800 text-gray-400 cursor-not-allowed"}`}
                    href={resultUrl || "#"}
                    download={file ? `skt-result${guessExt(resultBlob?.type || format)}` : `skt-result${guessExt(format)}`}
                    onClick={(e) => {
                      if (!resultBlob) e.preventDefault();
                    }}
                  >
                    {resultBlob ? "Download result" : "Result not ready"}
                  </a>

                  <button
                    className="px-3 py-2 rounded-md bg-neutral-800 text-gray-200 hover:bg-neutral-800/70 transition"
                    onClick={() => {
                      setFile(null);
                      setOrigSrc(SAMPLE_PATH);
                      setOrigInfo(null);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Right: preview + stats */}
            <div className="lg:col-span-7">
              <div className="p-4 rounded-xl bg-gradient-to-b from-neutral-900/30 to-neutral-900/10 border border-neutral-800/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    <p className="text-xs text-gray-400 mt-1">Before vs After — changes applied live as you tweak settings.</p>
                  </div>

                  <div className="text-sm text-gray-400">
                    <div>Type: <span className="text-gray-200">{resultInfo?.type || "—"}</span></div>
                    <div className="mt-1">Dimensions: <span className="text-gray-200">{resultInfo?.width ? `${Math.round(resultInfo.width)}×${Math.round(resultInfo.height)}` : "—"}</span></div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Before</div>
                    <div className="w-full h-56 bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden flex items-center justify-center">
                      <img src={origSrc || PLACEHOLDER} alt="before" onError={(e) => (e.currentTarget.src = PLACEHOLDER)} className="object-contain max-h-full" />
                    </div>
                    <div className="mt-2 text-sm text-gray-200">Size: {humanFileSize(origInfo?.size)}</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400 mb-1">After</div>
                      <div className="text-xs text-gray-400">{processing ? <span className="inline-flex items-center gap-2"><Spinner /> processing</span> : <span>{resultInfo?.size ? humanFileSize(resultInfo.size) : "—"}</span>}</div>
                    </div>

                    <div className="w-full h-56 bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden flex items-center justify-center">
                      {resultUrl ? (
                        <img src={resultUrl} alt="result" className="object-contain max-h-full" />
                      ) : (
                        <div className="text-sm text-gray-500">Result will appear here</div>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <div>Saved</div>
                        <div>{savedPercent}%</div>
                      </div>

                      {/* Savings progress bar */}
                      <div className="w-full h-2 bg-neutral-800 rounded overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, savedPercent)}%` }}
                          aria-hidden
                        />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Tip: lowering quality or resize % increases savings. PNG - WebP gives large savings often.</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">Note: All processing is done locally in your browser using a canvas. For very large images, it may take a few seconds.</div>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-6 text-center text-xs text-gray-500">
          Made with ❤️ by SKT — images stay on your device.
        </footer>
      </div>
    </div>
  );
}

// ---------- small spinner component ----------
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.12" strokeWidth="4" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Utility functions (unchanged logic) ----------

async function loadImageElement(src, file) {
  if (typeof window === 'undefined') {
    throw new Error('Cannot load image during server-side rendering');
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image'));
    
    try {
      if (file) {
        img.src = URL.createObjectURL(file);
      } else {
        img.src = src;
      }
    } catch (error) {
      reject(new Error('Failed to set image source'));
    }
  });
}

function guessExt(mime) {
  if (!mime) return ".jpg";
  if (mime.includes("jpeg")) return ".jpg";
  if (mime.includes("webp")) return ".webp";
  if (mime.includes("png")) return ".png";
  return ".jpg";
}

function guessMimeForCompression(srcTypeOrUrl) {
  if (!srcTypeOrUrl) return "image/jpeg";
  if (srcTypeOrUrl.includes("png")) return "image/png";
  if (srcTypeOrUrl.includes("webp")) return "image/webp";
  if (srcTypeOrUrl.includes("jpeg") || srcTypeOrUrl.includes("jpg")) return "image/jpeg";
  return "image/jpeg";
}

async function compressImageWithCanvas(img, { quality = 0.8, resizePct = 100, mimeType = "image/jpeg" } = {}) {
  if (typeof window === 'undefined') {
    throw new Error('Cannot compress image during server-side rendering');
  }

  const canvas = document.createElement("canvas");
  if (!canvas) {
    throw new Error('Canvas creation failed');
  }
  const ctx = canvas.getContext("2d");

  const targetW = Math.max(1, Math.round(img.width * (resizePct / 100)));
  const targetH = Math.max(1, Math.round(img.height * (resizePct / 100)));
  canvas.width = targetW;
  canvas.height = targetH;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return await new Promise((res) => {
    canvas.toBlob(
      (b) => {
        res(b);
      },
      mimeType,
      quality
    );
  });
}
