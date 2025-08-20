// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // Supported format mappings
// const FORMAT_CONFIG = {
//   jpg: {
//     mime: "image/jpeg",
//     extension: "jpg",
//     label: "JPG",
//     supportsQuality: true,
//     supportsTransparency: false,
//   },
//   png: {
//     mime: "image/png",
//     extension: "png",
//     label: "PNG",
//     supportsQuality: false,
//     supportsTransparency: true,
//   },
//   webp: {
//     mime: "image/webp",
//     extension: "webp",
//     label: "WebP",
//     supportsQuality: true,
//     supportsTransparency: true,
//   },
//   gif: {
//     mime: "image/gif",
//     extension: "gif",
//     label: "GIF",
//     supportsQuality: false,
//     supportsTransparency: true,
//   },
//   bmp: {
//     mime: "image/bmp",
//     extension: "bmp",
//     label: "BMP",
//     supportsQuality: false,
//     supportsTransparency: false,
//   },
// };

// export default function ImageConverter() {
//   const [files, setFiles] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [quality, setQuality] = useState(0.8);
//   const [fillBackground, setFillBackground] = useState(true);
//   const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
//   const [loading, setLoading] = useState(false);
//   const [converted, setConverted] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const [sourceFormat, setSourceFormat] = useState("png");
//   const [targetFormat, setTargetFormat] = useState("jpg");

//   // Handle file input or drag drop
//   const handleFiles = (incoming) => {
//     const selectedFiles = Array.from(incoming)
//       .filter((file) => {
//         const extension = file.name.split('.').pop().toLowerCase();
//         return Object.keys(FORMAT_CONFIG).includes(extension);
//       })
//       .map((file) => ({
//         file,
//         id: crypto.randomUUID(),
//       }));

//     setFiles((prev) => [...prev, ...selectedFiles]);
//     setSelected((prev) => [...prev, ...selectedFiles.map((f) => f.id)]);
//     setConverted([]);
//     setProgress(0);
//   };

//   // Handle URL upload
//   const handleUrlUpload = async () => {
//     const url = prompt(`Enter Image URL (${sourceFormat.toUpperCase()} only):`);
//     if (!url) return;

//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();

//       // Check if the format matches the selected source format
//       const blobType = blob.type.split('/')[1];
//       if (blobType !== sourceFormat && !FORMAT_CONFIG[blobType]) {
//         alert(`Only ${sourceFormat.toUpperCase()} images allowed!`);
//         return;
//       }

//       const file = new File([blob], `image-from-url.${sourceFormat}`, { type: blob.type });
//       handleFiles([file]);
//     } catch {
//       alert("Failed to fetch image. Try another URL.");
//     }
//   };

//   // Toggle selection for bulk convert
//   const toggleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
//     );
//   };

//   // Select all/none
//   const toggleSelectAll = () => {
//     if (selected.length === files.length) {
//       setSelected([]);
//     } else {
//       setSelected(files.map(f => f.id));
//     }
//   };

//   // Convert selected images
//   const convert = async () => {
//     if (!selected.length) return;
//     setLoading(true);
//     setConverted([]);
//     const results = [];
//     const selectedFiles = files.filter((f) => selected.includes(f.id));
//     const targetConfig = FORMAT_CONFIG[targetFormat];

//     for (let i = 0; i < selectedFiles.length; i++) {
//       const { file } = selectedFiles[i];
//       const img = await loadImage(URL.createObjectURL(file));
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");

//       // Fill background if needed
//       if (fillBackground && !targetConfig.supportsTransparency) {
//         ctx.fillStyle = backgroundColor;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//       }

//       ctx.drawImage(img, 0, 0);

//       // Convert to target format
//       const blob = await new Promise((resolve) => {
//         if (targetConfig.supportsQuality) {
//           canvas.toBlob(resolve, targetConfig.mime, quality);
//         } else {
//           canvas.toBlob(resolve, targetConfig.mime);
//         }
//       });

//       const url = URL.createObjectURL(blob);
//       const originalName = file.name;
//       const baseName = originalName.substring(0, originalName.lastIndexOf('.'));

//       results.push({
//         id: selectedFiles[i].id,
//         name: `${baseName}.${targetConfig.extension}`,
//         url,
//         size: (blob.size / 1024).toFixed(1) + " KB",
//       });

//       setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
//     }

//     setConverted(results);
//     setLoading(false);
//   };

//   // Reset everything
//   const reset = () => {
//     setFiles([]);
//     setSelected([]);
//     setConverted([]);
//     setProgress(0);
//     setLoading(false);
//   };

//   // Load image utility
//   const loadImage = (src) =>
//     new Promise((resolve, reject) => {
//       const img = new Image();
//       img.onload = () => resolve(img);
//       img.onerror = reject;
//       img.src = src;
//     });

//   return (
//     <main className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center py-10 px-4">
//       <Card className="w-full max-w-4xl shadow-2xl rounded-2xl">
//         <CardContent className="p-6 space-y-6">
//           <h1 className="text-3xl font-bold text-center">
//             Universal Image Converter
//           </h1>
//           <p className="text-center text-gray-500 text-sm">
//             Upload, preview, select images and convert them between formats with custom quality.
//           </p>

//           {/* Format Selection */}
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
//             <div className="flex items-center gap-2">
//               <span className="text-sm">From:</span>
//               <Select value={sourceFormat} onValueChange={setSourceFormat}>
//                 <SelectTrigger className="w-28">
//                   <SelectValue placeholder="Source" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.entries(FORMAT_CONFIG).map(([key, config]) => (
//                     <SelectItem key={key} value={key}>
//                       {config.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="text-xl">→</div>

//             <div className="flex items-center gap-2">
//               <span className="text-sm">To:</span>
//               <Select value={targetFormat} onValueChange={setTargetFormat}>
//                 <SelectTrigger className="w-28">
//                   <SelectValue placeholder="Target" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.entries(FORMAT_CONFIG).map(([key, config]) => (
//                     <SelectItem key={key} value={key}>
//                       {config.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Upload Section */}
//           <div
//             onDrop={(e) => {
//               e.preventDefault();
//               handleFiles(e.dataTransfer.files);
//             }}
//             onDragOver={(e) => e.preventDefault()}
//             className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition"
//           >
//             <input
//               type="file"
//               accept={Object.keys(FORMAT_CONFIG).map(f => `image/${f}`).join(',')}
//               multiple
//               onChange={(e) => handleFiles(e.target.files)}
//               className="hidden"
//               id="fileInput"
//             />
//             <label
//               htmlFor="fileInput"
//               className="text-blue-600 font-semibold cursor-pointer"
//             >
//               Click to Browse Images
//             </label>
//             <p className="text-sm text-gray-500">or drag & drop files here</p>
//             <p className="text-xs text-gray-400 mt-1">
//               Supported formats: {Object.values(FORMAT_CONFIG).map(c => c.label).join(', ')}
//             </p>
//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={handleUrlUpload}
//               className="mt-3"
//             >
//               Upload from URL
//             </Button>
//           </div>

//           {/* Options */}
//           <div className="space-y-4">
//             {FORMAT_CONFIG[targetFormat].supportsQuality && (
//               <div>
//                 <p className="text-sm font-medium">
//                   Quality ({Math.round(quality * 100)}%)
//                 </p>
//                 <Slider
//                   min={0.2}
//                   max={1}
//                   step={0.1}
//                   value={[quality]}
//                   onValueChange={(val) => setQuality(val[0])}
//                 />
//               </div>
//             )}

//             {!FORMAT_CONFIG[targetFormat].supportsTransparency && (
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Switch checked={fillBackground} onCheckedChange={setFillBackground} />
//                   <span className="text-sm">Fill transparent areas with background color</span>
//                 </div>

//                 {fillBackground && (
//                   <div className="flex items-center gap-2 ml-7">
//                     <span className="text-sm">Color:</span>
//                     <input 
//                       type="color" 
//                       value={backgroundColor} 
//                       onChange={(e) => setBackgroundColor(e.target.value)}
//                       className="w-8 h-8 rounded cursor-pointer"
//                     />
//                     <span className="text-xs text-gray-500">{backgroundColor}</span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Uploaded Images with selection - Horizontal Scroll */}
//           {files.length > 0 && (
//             <div className="mt-6">
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="font-medium">Uploaded Images ({files.length})</h3>
//                 <Button variant="outline" size="sm" onClick={toggleSelectAll}>
//                   {selected.length === files.length ? "Deselect All" : "Select All"}
//                 </Button>
//               </div>

//               <div className="overflow-x-auto pb-4">
//                 <div className="flex space-x-4 min-h-max">
//                   {files.map((f) => (
//                     <div
//                       key={f.id}
//                       className={`border rounded-lg p-3 flex flex-col items-center min-w-[200px] ${
//                         selected.includes(f.id)
//                           ? "ring-2 ring-blue-500"
//                           : "ring-0"
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         className="mb-2"
//                         checked={selected.includes(f.id)}
//                         onChange={() => toggleSelect(f.id)}
//                       />
//                       <p className="text-sm truncate mb-1 max-w-[180px]">{f.file.name}</p>
//                       <img
//                         src={URL.createObjectURL(f.file)}
//                         alt={f.file.name}
//                         className="h-32 object-contain mb-1"
//                       />
//                       <p className="text-xs text-gray-500">
//                         {(f.file.size / 1024).toFixed(1)} KB
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Convert & Reset Buttons below uploaded images */}
//           <div className="flex justify-center gap-4 mt-6 flex-wrap">
//             <Button
//               onClick={convert}
//               disabled={loading || selected.length === 0}
//             >
//               {loading ? "Converting..." : `Convert to ${FORMAT_CONFIG[targetFormat].label}`}
//             </Button>
//             <Button variant="outline" onClick={reset}>
//               Reset
//             </Button>
//           </div>

//           {/* Conversion Progress */}
//           {loading && (
//             <div className="space-y-2 mt-4">
//               <Progress value={progress} className="w-full" />
//               <p className="text-center text-sm text-gray-500">
//                 Processing {progress}%
//               </p>
//             </div>
//           )}

//           {/* Converted Results */}
//           {converted.length > 0 && (
//             <div className="mt-6">
//               <h3 className="font-medium mb-2">Converted Images ({converted.length})</h3>

//               <div className="overflow-x-auto pb-4">
//                 <div className="flex space-x-4 min-h-max">
//                   {converted.map((f) => (
//                     <div
//                       key={f.id}
//                       className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 flex flex-col items-center min-w-[200px]"
//                     >
//                       <h3 className="text-sm font-medium mb-2 text-center">
//                         Converted {sourceFormat.toUpperCase()} → {targetFormat.toUpperCase()}
//                       </h3>
//                       <img
//                         src={f.url}
//                         alt={f.name}
//                         className="h-32 object-contain mb-1"
//                       />
//                       <p className="text-xs text-gray-500 mb-2">{f.size}</p>
//                       <Button
//                         variant="secondary"
//                         size="sm"
//                         onClick={() => {
//                           const a = document.createElement("a");
//                           a.href = f.url;
//                           a.download = f.name;
//                           a.click();
//                         }}
//                       >
//                         Download
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Download All */}
//           {converted.length > 1 && (
//             <div className="flex justify-center mt-6">
//               <Button
//                 onClick={() =>
//                   converted.forEach((f) => {
//                     const a = document.createElement("a");
//                     a.href = f.url;
//                     a.download = f.name;
//                     a.click();
//                   })
//                 }
//               >
//                 Download All ({converted.length})
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </main>
//   );
// }


// ...imports and config from the previous block remain above
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { decodeICO, encodeICO } from "./lib/ico";
import { decodeGIF, encodeGIF } from "./lib/gif";
import { drawSVGToImageData } from "./lib/svg";
import { decodeTIFF } from "./lib/tiff";
import { decodeAVIF, encodeAVIF } from "./lib/avif";

// Lazy loader helpers (you can replace with your actual imports)
const loadCanvg = () => import("canvg");
const loadGifDecode = () => import("gifuct-js");
// const loadGifEncode = () => import("gif.js.optimized");
const loadUTIF = () => import("utif");
const loadBMP = () => import("bmp-js");
const loadHeic2Any = () => import("heic2any");
// const loadSquoosh = () => import("@squoosh/lib");
const loadJsPDF = () => import("jspdf");
const loadJSZip = () => import("jszip");
const loadFileSaver = () => import("file-saver");

// Example FORMAT_CONFIG (replace with your actual config)
const FORMAT_CONFIG = {
  png: { label: "PNG", extension: "png", mime: "image/png", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: true },
  jpg: { label: "JPEG", extension: "jpg", mime: "image/jpeg", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: true },
  jpeg: { label: "JPEG", extension: "jpeg", mime: "image/jpeg", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: true },
  webp: { label: "WebP", extension: "webp", mime: "image/webp", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: true },
  avif: { label: "AVIF", extension: "avif", mime: "image/avif", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: true },
  gif: { label: "GIF", extension: "gif", mime: "image/gif", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: false },
  bmp: { label: "BMP", extension: "bmp", mime: "image/bmp", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: false },
  tiff: { label: "TIFF", extension: "tiff", mime: "image/tiff", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: false },
  tif: { label: "TIFF", extension: "tif", mime: "image/tiff", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: false },
  ico: { label: "ICO", extension: "ico", mime: "image/x-icon", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: false },
  svg: { label: "SVG", extension: "svg", mime: "image/svg+xml", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: false },
  pdf: { label: "PDF", extension: "pdf", mime: "application/pdf", canDecode: false, canEncode: true, supportsTransparency: true, supportsQuality: false },
};

// Simple format guessing helper
const guessFormatKey = (str) => {
  if (!str) return null;
  const lower = str.toLowerCase();
  for (const key in FORMAT_CONFIG) {
    if (lower.endsWith(`.${key}`) || lower.includes(FORMAT_CONFIG[key].mime?.split("/")[1])) {
      return key;
    }
  }
  return null;
};

// ...imports and config from the previous block remain above

export default function ImageConverter() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [quality, setQuality] = useState(0.8);
  const [fillBackground, setFillBackground] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState([]);
  const [progress, setProgress] = useState(0);
  const [sourceFormat, setSourceFormat] = useState("png");
  const [targetFormat, setTargetFormat] = useState("jpg");
  const [error, setError] = useState(null);

  const targetCfg = FORMAT_CONFIG[targetFormat];

  // Drag/drop and input
  const handleFiles = (incoming) => {
    const arr = Array.from(incoming).map((x) => x.file ? x.file : x);
    const accepted = arr.map((file) => {
      const fmt = guessFormatKey(file.name) || guessFormatKey(file.type);
      return { file, id: crypto.randomUUID(), srcFmt: fmt };
    });
    setFiles(prev => [...prev, ...accepted]);
    setSelected(prev => [...prev, ...accepted.map(f => f.id)]);
    setConverted([]);
    setProgress(0);
    setError(null);
  };

  const handleUrlUpload = async () => {
    const url = prompt("Enter Image URL:");
    if (!url) return;
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Fetch failed");
      const blob = await response.blob();
      const fmt = guessFormatKey(blob.type) || guessFormatKey(url) || sourceFormat;
      if (!fmt) throw new Error("Unknown or unsupported format");
      const file = new File([blob], `image-from-url.${FORMAT_CONFIG[fmt].extension}`, { type: blob.type || FORMAT_CONFIG[fmt].mime });
      handleFiles([file]);
    } catch (e) {
      alert("Failed to fetch image. Try another URL.");
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selected.length === files.length) setSelected([]);
    else setSelected(files.map(f => f.id));
  };

  // Decode helpers
  const imageBitmapToImageData = async (bmp) => {
    const canvas = document.createElement("canvas");
    canvas.width = bmp.width;
    canvas.height = bmp.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bmp, 0, 0);
    return ctx.getImageData(0, 0, bmp.width, bmp.height);
  };

  const decodeFile = async (file, srcFmt) => {
    const fmt = srcFmt || guessFormatKey(file.type) || guessFormatKey(file.name);
    if (fmt === "svg") {
      const text = await file.text();
      return drawSVGToImageData(text);
    }

    // Attempt native decode where possible
    const tryNative = async () => {
      try {
        const bmp = await createImageBitmap(file);
        return bmp;
      } catch {
        // fallback below
        return null;
      }
    };

    // GIF animated decode
    if (fmt === "gif") {
      const result = await decodeGIF(file);
      return result;
    }

    if (fmt === "tiff" || fmt === "tif") {
      return await decodeTIFF(file);
    }

    // ICO
    if (fmt === "ico") {
      return await decodeICO(file);
    }


    if (fmt === "heic" || fmt === "heif") {
      const heic2any = (await loadHeic2Any()).default;
      const pngBlob = await heic2any({ blob: file, toType: "image/png" });
      const bmp = await createImageBitmap(pngBlob);
      const imageData = await imageBitmapToImageData(bmp);
      return { frames: [{ imageData }], width: bmp.width, height: bmp.height, animated: false };
    }

    // AVIF: try native first; otherwise fall back to canvas via <img> if supported data URL
    if (fmt === "avif") {
      return await decodeAVIF(file);

    }

    // Default: attempt native for PNG/JPEG/WebP and others that browser can decode
    const native = await tryNative();
    if (native) {
      const imageData = await imageBitmapToImageData(native);
      return { frames: [{ imageData }], width: native.width, height: native.height, animated: false };
    }

    throw new Error(`Unsupported or failed to decode: ${file.name}`);
  };

  // Render ImageData with background if needed
  const composeFrameOnCanvas = (frame, w, h, applyBg) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (applyBg) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }
    const tmp = new OffscreenCanvas(w, h);
    const tctx = tmp.getContext("2d");
    const id = tctx.createImageData(w, h);
    id.data.set(frame.imageData.data);
    tctx.putImageData(id, 0, 0);
    ctx.drawImage(tmp, 0, 0);
    return canvas;
  };

  // Encoders
  const encodeNative = (canvas, mime, quality) =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        mime,
        quality
      );
    });
  const encodeBMP = async (frame, w, h) => {
    const BMP = await loadBMP();
    const encoded = BMP.default.encode({
      data: Buffer.from(frame.imageData.data),
      width: w,
      height: h,
    });
    return new Blob([encoded.data], { type: "image/bmp" });
  };

  const encodeTIFF = async (frames, w, h) => {
    const UTIF = await loadUTIF();
    // Encode first frame (simple, reliable). You can extend to multi-page by building multiple IFDs.
    const rgba = frames[0].imageData.data;
    const tiff = UTIF.encodeImage(rgba, w, h);
    return new Blob([new Uint8Array(tiff)], { type: "image/tiff" });
  };

  const encodeSVGWrapper = async (frame, w, h) => {
    // Wrap a PNG data URL in an SVG <image> tag at native dimensions
    const canvas = composeFrameOnCanvas(frame, w, h, false);
    const pngBlob = await encodeNative(canvas, "image/png");
    const dataUrl = await blobToDataURL(pngBlob);
    const svg =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<image href="${dataUrl}" x="0" y="0" width="${w}" height="${h}" />` +
      `</svg>`;
    return new Blob([svg], { type: "image/svg+xml" });
  };

  const encodePDF = async (frames, w, h, bgApplied) => {
    const { jsPDF } = await loadJsPDF();
    // PDF units in points by default; map image pixel size to points (72 dpi) or scale to page
    const pdf = new jsPDF({ orientation: w >= h ? "l" : "p", unit: "pt", format: [w, h] });

    for (let i = 0; i < frames.length; i++) {
      if (i > 0) pdf.addPage([w, h], w >= h ? "l" : "p");
      const canvas = composeFrameOnCanvas(frames[i], w, h, bgApplied || true); // PDF has no alpha
      const png = await encodeNative(canvas, "image/png");
      const dataUrl = await blobToDataURL(png);
      pdf.addImage(dataUrl, "PNG", 0, 0, w, h);
    }

    const out = pdf.output("blob");
    return out;
  };

  const blobToDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });

  // Convert selected images
  const convert = async () => {
    if (!selected.length) return;
    setLoading(true);
    setConverted([]);
    setError(null);
    const results = [];

    const selectedFiles = files.filter(f => selected.includes(f.id));
    for (let i = 0; i < selectedFiles.length; i++) {
      const entry = selectedFiles[i];
      try {
        const decoded = await decodeFile(entry.file, entry.srcFmt);
        const { width, height } = decoded;
        const buffer = await entry.file.arrayBuffer();
        // const url = await encodeAVIF(Buffer.from(buffer), file.name, 80);
        // Prepare frames considering background rules for target
        const needsBg = fillBackground && !FORMAT_CONFIG[targetFormat].supportsTransparency;

        let outBlob;

        if (targetFormat === "png") {
          const canvas = composeFrameOnCanvas(decoded.frames[0], width, height, needsBg);
          outBlob = await encodeNative(canvas, "image/png");
        } else if (targetFormat === "jpg" || targetFormat === "jpeg") {
          const canvas = composeFrameOnCanvas(decoded.frames[0], width, height, true); // JPEG no alpha
          outBlob = await encodeNative(canvas, "image/jpeg", quality);
        } else if (targetFormat === "webp") {
          const canvas = composeFrameOnCanvas(decoded.frames[0], width, height, needsBg);
          outBlob = await encodeNative(canvas, "image/webp", quality);
        } else if (targetFormat === "avif") {
          outBlob = await encodeAVIF(Buffer.from(buffer), entry.file.name, 80);
        } else if (targetFormat === "gif") {
          // If source was animated, keep all frames, else one frame
          outBlob = await encodeGIF(decoded.frames, width, height);
        } else if (targetFormat === "bmp") {
          const frame = decoded.frames[0];
          // BMP has no alpha — background applied via compose if requested
          const canvas = composeFrameOnCanvas(frame, width, height, needsBg || true);
          const ctx = canvas.getContext("2d");
          const flat = ctx.getImageData(0, 0, width, height);
          outBlob = await encodeBMP({ imageData: flat }, width, height);
        } else if (targetFormat === "tiff" || targetFormat === "tif") {
          outBlob = await encodeTIFF(decoded.frames, width, height);
        } else if (targetFormat === "ico") {
          outBlob = await encodeICO(decoded.frames[0]);
        } else if (targetFormat === "svg") {
          outBlob = await encodeSVGWrapper(decoded.frames[0], width, height);
        } else if (targetFormat === "pdf") {
          outBlob = await encodePDF(decoded.frames, width, height, needsBg);
        } else {
          throw new Error(`Target format not supported: ${targetFormat}`);
        }

        const url = URL.createObjectURL(outBlob);
        const base = entry.file.name.includes(".")
          ? entry.file.name.slice(0, entry.file.name.lastIndexOf("."))
          : entry.file.name;
        const name = `${base}.${FORMAT_CONFIG[targetFormat].extension}`;
        results.push({
          id: entry.id,
          name,
          url,
          sizeLabel: `${(outBlob.size / 1024).toFixed(1)} KB`,
        });
      } catch (e) {
        console.error(e);
        setError(`Failed to convert ${entry.file.name}: ${e.message || e}`);
      } finally {
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
    }

    setConverted(results);
    setLoading(false);
  };

  const reset = () => {
    setFiles([]);
    setSelected([]);
    setConverted([]);
    setProgress(0);
    setLoading(false);
    setError(null);
  };

  const downloadAll = async () => {
    if (!converted.length) return;
    const [JSZipMod, FileSaver] = await Promise.all([loadJSZip(), loadFileSaver()]);
    const zip = new JSZipMod.default();
    for (const c of converted) {
      const resp = await fetch(c.url);
      zip.file(c.name, await resp.arrayBuffer());
    }
    const blob = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(blob, `converted_${Date.now()}.zip`);
  };

  const formatOptions = useMemo(() => {
    // Show all formats in dropdowns; prevent choosing source pdf (no decode)
    const all = Object.entries(FORMAT_CONFIG);
    const sourceOpts = all.filter(([k, v]) => v.canDecode);
    const targetOpts = all.filter(([k, v]) => v.canEncode);
    return { sourceOpts, targetOpts };
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 pt-4">
          <div className="flex gap-3 flex-wrap">
            <div className="w-48">
              <label className="text-sm block mb-1">Source format</label>
              <Select value={sourceFormat} onValueChange={(v) => setSourceFormat(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {formatOptions.sourceOpts.map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <label className="text-sm block mb-1">Target format</label>
              <Select value={targetFormat} onValueChange={(v) => setTargetFormat(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {formatOptions.targetOpts.map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={fillBackground && !targetCfg.supportsTransparency}
                onCheckedChange={(val) => setFillBackground(val)}
                disabled={targetCfg.supportsTransparency}
              />
              <span className="text-sm">Fill background</span>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                disabled={targetCfg.supportsTransparency}
                className="ml-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-64">
                <label className="text-sm block mb-1">
                  Quality {FORMAT_CONFIG[targetFormat].supportsQuality ? `(${Math.round(quality * 100)}%)` : "(n/a)"}
                </label>
                <Slider
                  value={[quality]}
                  onValueChange={(v) => setQuality(v[0])}
                  min={0.05}
                  max={1}
                  step={0.01}
                  disabled={!FORMAT_CONFIG[targetFormat].supportsQuality}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              accept={Object.values(FORMAT_CONFIG)
                .filter(f => f.canDecode)
                .map(f => f.mime)
                .concat([
                  ".jpg,.jpeg,.png,.webp,.gif,.bmp,.tif,.tiff,.ico,.avif,.heic,.heif,.svg"
                ])
                .join(",")}
            />
            <Button variant="secondary" onClick={handleUrlUpload}>Upload from URL</Button>
            <Button onClick={toggleSelectAll}>
              {selected.length === files.length ? "Deselect all" : "Select all"}
            </Button>
            <Button onClick={convert} disabled={!selected.length || loading}>
              {loading ? "Converting..." : "Convert selected"}
            </Button>
            <Button variant="destructive" onClick={reset}>Reset</Button>
          </div>

          {loading && (
            <div className="flex items-center gap-3">
              <Progress value={progress} className="w-64" />
              <span className="text-sm">{progress}%</span>
            </div>
          )}

          {error && <div className="text-red-600 text-sm">{error}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-2">Queued files</h3>
          <div className="grid gap-2">
            {files.map((f) => (
              <div key={f.id} className="flex items-center justify-between border rounded p-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(f.id)}
                    onChange={() => toggleSelect(f.id)}
                  />
                  <div className="text-sm">
                    <div className="font-medium">{f.file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(f.file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <div className="text-xs">
                  {f.srcFmt ? FORMAT_CONFIG[f.srcFmt].label : "Unknown"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Converted</h3>
            <Button variant="secondary" onClick={downloadAll} disabled={!converted.length}>Download all as ZIP</Button>
          </div>
          <div className="grid gap-2">
            {converted.map((c) => (
              <div key={c.id} className="flex items-center justify-between border rounded p-2">
                <div className="text-sm">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.sizeLabel}</div>
                </div>
                <a href={c.url} download={c.name}>
                  <Button size="sm">Download</Button>
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}