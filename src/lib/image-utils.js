"use client";

// Lazy imports for heavy libs
// const loadSquoosh = () => import("@squoosh/lib"); // AVIF encoding
const loadGifDecode = () => import("gifuct-js");   // GIF decoding
const loadGifEncode = async () => {
  const mod = await import("gif.js");
  // Point worker to CDN for simplicity (or self-host under /public)
  mod.default.prototype.workerScript =
    "https://cdn.jsdelivr.net/npm/gif.js.optimized/dist/gif.worker.js";
  return mod;
};
const loadBMP = () => import("bmp-js");
const loadUTIF = () => import("utif");
const loadICO = () => import("icojs");
const loadCanvg = () => import("canvg");
const loadJsPDF = () => import("jspdf");
const loadHeic2Any = () => import("heic2any");
const loadJSZip = () => import("jszip");
const loadFileSaver = () => import("file-saver");

// Unified format configuration
const FORMAT_CONFIG = {
  jpg:   { mime: "image/jpeg", extension: "jpg",  label: "JPG",  supportsQuality: true,  supportsTransparency: false, canEncode: true,  canDecode: true  },
  jpeg:  { mime: "image/jpeg", extension: "jpeg", label: "JPEG", supportsQuality: true,  supportsTransparency: false, canEncode: true,  canDecode: true  },
  png:   { mime: "image/png",  extension: "png",  label: "PNG",  supportsQuality: false, supportsTransparency: true,  canEncode: true,  canDecode: true  },
  webp:  { mime: "image/webp", extension: "webp", label: "WebP", supportsQuality: true,  supportsTransparency: true,  canEncode: true,  canDecode: true  },

  gif:   { mime: "image/gif",  extension: "gif",  label: "GIF",  supportsQuality: false, supportsTransparency: true,  canEncode: true,  canDecode: true,  supportsAnimation: true },

  bmp:   { mime: "image/bmp",  extension: "bmp",  label: "BMP",  supportsQuality: false, supportsTransparency: false, canEncode: true,  canDecode: true  },

  tiff:  { mime: "image/tiff", extension: "tiff", label: "TIFF", supportsQuality: false, supportsTransparency: true,  canEncode: true,  canDecode: true  },
  tif:   { mime: "image/tiff", extension: "tif",  label: "TIF",  supportsQuality: false, supportsTransparency: true,  canEncode: true,  canDecode: true  },

  ico:   { mime: "image/x-icon", extension: "ico", label: "ICO", supportsQuality: false, supportsTransparency: true,  canEncode: true,  canDecode: true  },

  avif:  { mime: "image/avif", extension: "avif", label: "AVIF", supportsQuality: true,  supportsTransparency: true,  canEncode: true,  canDecode: true  },

  heif:  { mime: "image/heif", extension: "heif", label: "HEIF", supportsQuality: false, supportsTransparency: true, canEncode: false, canDecode: true },
  heic:  { mime: "image/heic", extension: "heic", label: "HEIC", supportsQuality: false, supportsTransparency: true, canEncode: false, canDecode: true },

  svg:   { mime: "image/svg+xml", extension: "svg", label: "SVG", supportsQuality: false, supportsTransparency: true, canEncode: true, canDecode: true, vector: true },

  pdf:   { mime: "application/pdf", extension: "pdf", label: "PDF", supportsQuality: false, supportsTransparency: false, canEncode: true, canDecode: false, targetOnly: true },
};

// Utility: get canonical key from extension or MIME
const guessFormatKey = (nameOrMime) => {
  const lower = nameOrMime.toLowerCase();
  const byExt = lower.split(".").pop();
  if (byExt && FORMAT_CONFIG[byExt]) return byExt;
  if (lower.includes("jpeg")) return "jpeg";
  if (lower.includes("jpg")) return "jpg";
  if (lower.includes("png")) return "png";
  if (lower.includes("webp")) return "webp";
  if (lower.includes("gif")) return "gif";
  if (lower.includes("bmp")) return "bmp";
  if (lower.includes("tiff")) return "tiff";
  if (lower.includes("ico")) return "ico";
  if (lower.includes("avif")) return "avif";
  if (lower.includes("heic")) return "heic";
  if (lower.includes("heif")) return "heif";
  if (lower.includes("svg")) return "svg";
  if (lower.includes("pdf")) return "pdf";
  return undefined;
};

// No TypeScript interfaces here — frames/decoded objects are plain JS objects
