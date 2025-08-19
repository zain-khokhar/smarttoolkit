// "use client";

// import React, { useCallback, useMemo, useRef, useState } from "react";
// import Image from "next/image";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import { Switch } from "@/components/ui/switch";
// import { Upload, ImageIcon, Trash2, Download, Sparkles } from "lucide-react";

// /**
//  * Drop this file at: app/tools/img/png-to-jpg/page.tsx
//  * Requires shadcn/ui installed and Tailwind set up.
//  */
// export default function PngToJpgPage() {
//   const [files, setFiles] = useState<File[]>([]);
//   const [previews, setPreviews] = useState<string[]>([]);
//   const [quality, setQuality] = useState<number>(0.9);
//   const [bgWhite, setBgWhite] = useState<boolean>(true);
//   const [converting, setConverting] = useState<boolean>(false);
//   const [progress, setProgress] = useState<number>(0);
//   const [outputs, setOutputs] = useState<{ url: string; name: string; size: number }[]>([]);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const onPick = () => inputRef.current?.click();

//   const onFiles = useCallback((list: FileList | null) => {
//     if (!list || list.length === 0) return;
//     const arr = Array.from(list).filter((f) => /image\/png/i.test(f.type));
//     setFiles(arr);
//     // Create previews
//     const urls = arr.map((f) => URL.createObjectURL(f));
//     setPreviews((prev) => {
//       prev.forEach((u) => URL.revokeObjectURL(u));
//       return urls;
//     });
//     // Clear previous outputs
//     outputs.forEach((o) => URL.revokeObjectURL(o.url));
//     setOutputs([]);
//   }, [outputs]);

//   const onDrop = useCallback(
//     (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       e.stopPropagation();
//       onFiles(e.dataTransfer.files);
//     },
//     [onFiles]
//   );

//   const dropEvents = {
//     onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       e.dataTransfer.dropEffect = "copy";
//     },
//     onDrop,
//   };

//   const resetAll = () => {
//     previews.forEach((p) => URL.revokeObjectURL(p));
//     outputs.forEach((o) => URL.revokeObjectURL(o.url));
//     setFiles([]);
//     setPreviews([]);
//     setOutputs([]);
//     setProgress(0);
//     setConverting(false);
//   };

//   const convertAll = async () => {
//     if (!files.length || converting) return;
//     setConverting(true);
//     setProgress(0);

//     const results: { url: string; name: string; size: number }[] = [];

//     // Process sequentially for predictable progress
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const out = await convertPngToJpeg(file, quality, bgWhite);
//       results.push(out);
//       setProgress(Math.round(((i + 1) / files.length) * 100));
//     }

//     setOutputs(results);
//     setConverting(false);
//   };

//   const totalOutputSize = useMemo(() => outputs.reduce((acc, o) => acc + o.size, 0), [outputs]);

//   const downloadAll = async () => {
//     // Simple: trigger individual downloads (avoids bundling/zip dependency)
//     outputs.forEach((o) => {
//       const a = document.createElement("a");
//       a.href = o.url;
//       a.download = o.name;
//       a.click();
//     });
//   };

//   return (
//     <div className="mx-auto max-w-5xl p-4 sm:p-6 md:p-8">
//       <header className="mb-6 flex items-center justify-between gap-3">
//         <div className="space-y-1">
//           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">PNG → JPG Converter</h1>
//           <p className="text-sm text-muted-foreground">Private, fast, and 100% in-browser. Drop PNGs, tweak quality, and download crisp JPGs.</p>
//         </div>
//         <Button variant="outline" size="sm" onClick={resetAll} className="rounded-2xl">
//           <Trash2 className="size-4 mr-2" /> Reset
//         </Button>
//       </header>

//       <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
//         {/* Left: Uploader & Preview */}
//         <Card className="rounded-2xl">
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center gap-2"><Upload className="size-5"/> Upload PNGs</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div
//               {...dropEvents}
//               className="group relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-6 sm:p-8 text-center transition hover:bg-muted/40"
//             >
//               <ImageIcon className="size-8 sm:size-10 opacity-60" />
//               <div className="text-sm">
//                 <span className="font-medium">Drag & drop PNG files</span>
//                 <span className="text-muted-foreground"> or </span>
//                 <Button variant="link" onClick={onPick} className="px-1">browse</Button>
//               </div>
//               <p className="text-xs text-muted-foreground">We never upload your images. Everything happens locally.</p>
//               <Input
//                 ref={inputRef}
//                 type="file"
//                 accept="image/png"
//                 multiple
//                 onChange={(e) => onFiles(e.target.files)}
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//                 aria-label="Upload PNG files"
//               />
//             </div>

//             {files.length > 0 && (
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">{files.length} file{files.length > 1 ? "s" : ""} selected</span>
//                   <Button size="sm" variant="secondary" onClick={convertAll} disabled={converting} className="rounded-2xl">
//                     <Sparkles className="size-4 mr-2"/> Convert
//                   </Button>
//                 </div>
//                 {converting && (
//                   <div className="space-y-2">
//                     <Progress value={progress} />
//                     <p className="text-xs text-muted-foreground">Converting… {progress}%</p>
//                   </div>
//                 )}

//                 <Separator />

//                 {/* Preview grid */}
//                 <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
//                   {previews.map((src, idx) => (
//                     <li key={idx} className="overflow-hidden rounded-xl border bg-card">
//                       <div className="relative aspect-square">
//                         {/* Next/Image for perf; uses object URL */}
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img src={src} alt={`preview-${idx}`} className="h-full w-full object-cover"/>
//                       </div>
//                       <div className="p-2 text-xs truncate text-muted-foreground">{files[idx]?.name}</div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Right: Controls & Output */}
//         <Card className="rounded-2xl">
//           <CardHeader className="pb-3">
//             <CardTitle>Settings & Output</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="quality">JPEG Quality ({Math.round(quality * 100)}%)</Label>
//               <Slider
//                 id="quality"
//                 min={0.2}
//                 max={1}
//                 step={0.01}
//                 value={[quality]}
//                 onValueChange={(v) => setQuality(v[0] ?? 0.9)}
//               />
//               <p className="text-xs text-muted-foreground">Higher quality → bigger file size. Try 0.8–0.92 for a good balance.</p>
//             </div>

//             <div className="flex items-center justify-between rounded-xl border p-3">
//               <div className="space-y-0.5">
//                 <Label>Fill transparent pixels with white</Label>
//                 <p className="text-xs text-muted-foreground">JPEG doesn’t support transparency. Enable to avoid black/gray backgrounds.</p>
//               </div>
//               <Switch checked={bgWhite} onCheckedChange={setBgWhite} aria-label="Toggle white background"/>
//             </div>

//             <Separator />

//             {/* Outputs */}
//             {outputs.length > 0 ? (
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-muted-foreground">
//                     {outputs.length} JPG file{outputs.length > 1 ? "s" : ""} ready · {(totalOutputSize / 1024).toFixed(1)} KB total
//                   </div>
//                   <Button size="sm" onClick={downloadAll} className="rounded-2xl">
//                     <Download className="size-4 mr-2"/> Download all
//                   </Button>
//                 </div>
//                 <ul className="space-y-2 max-h-[340px] overflow-auto pr-1">
//                   {outputs.map((o, i) => (
//                     <li key={i} className="flex items-center justify-between gap-3 rounded-xl border p-2">
//                       <div className="flex items-center gap-3 min-w-0">
//                         <div className="size-10 overflow-hidden rounded-md bg-muted">
//                           {/* eslint-disable-next-line @next/next/no-img-element */}
//                           <img src={o.url} alt={o.name} className="h-full w-full object-cover"/>
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm truncate">{o.name}</p>
//                           <p className="text-xs text-muted-foreground">{(o.size / 1024).toFixed(1)} KB</p>
//                         </div>
//                       </div>
//                       <Button size="sm" variant="secondary" onClick={() => {
//                         const a = document.createElement("a");
//                         a.href = o.url;
//                         a.download = o.name;
//                         a.click();
//                       }} className="rounded-2xl">
//                         <Download className="size-4 mr-2"/> Download
//                       </Button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No output yet. Add PNGs on the left and click Convert.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <footer className="mt-8 text-center text-xs text-muted-foreground">
//         Your images never leave your device. Conversion is performed in-memory using the Canvas API.
//       </footer>
//     </div>
//   );
// }

// /** Converts a PNG file to JPEG using Canvas API. Returns an object URL and file info. */
// async function convertPngToJpeg(file: File, quality: number, bgWhite: boolean) {
//   const arrayBuffer = await file.arrayBuffer();
//   const blob = new Blob([arrayBuffer], { type: file.type });
//   const imgUrl = URL.createObjectURL(blob);
//   const img = await loadImage(imgUrl);

//   const canvas = document.createElement("canvas");
//   canvas.width = img.naturalWidth || img.width;
//   canvas.height = img.naturalHeight || img.height;
//   const ctx = canvas.getContext("2d");
//   if (!ctx) throw new Error("Canvas not supported");

//   // Clear with chosen background to handle transparency gracefully
//   if (bgWhite) {
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   } else {
//     // If not white, default to transparent black (won't be preserved in JPEG but keeps alpha areas dark)
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   }

//   ctx.drawImage(img, 0, 0);

//   const outBlob: Blob = await new Promise((resolve, reject) => {
//     canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", clamp(quality, 0.2, 1));
//   });

//   const outUrl = URL.createObjectURL(outBlob);
//   URL.revokeObjectURL(imgUrl);

//   const clean = file.name.replace(/\.png$/i, "");
//   return { url: outUrl, name: `${clean}.jpg`, size: outBlob.size };
// }

// function loadImage(src: string): Promise<HTMLImageElement> {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = () => reject(new Error("Failed to load image"));
//     img.src = src;
//   });
// }

// function clamp(n: number, min: number, max: number) {
//   return Math.min(max, Math.max(min, n));
// }
