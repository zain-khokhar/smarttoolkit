// src/lib/tiffDecoder.js
"use client";
const loadUTIF = () => import("utif");

export async function decodeTIFF(file) {
  const UTIF = (await import("utif")).default;
  const buf = new Uint8Array(await file.arrayBuffer());
  const ifds = UTIF.decode(buf);

  const frames = [];
  let w = 0, h = 0;

  for (const ifd of ifds) {
    UTIF.decodeImage(buf, ifd);
    const rgba = UTIF.toRGBA8(ifd);

    const width = ifd.width;
    const height = ifd.height;

    w = width;
    h = height;

    frames.push({
      imageData: new ImageData(new Uint8ClampedArray(rgba), width, height),
    });
  }

  return { frames, width: w, height: h, animated: frames.length > 1 };
}
export const encodeTIFF = async (frames, w, h) => {
  const UTIF = await loadUTIF();
  // Encode first frame (simple, reliable). You can extend to multi-page by building multiple IFDs.
  const rgba = frames[0].imageData.data;
  const tiff = UTIF.encodeImage(rgba, w, h);
  return new Blob([new Uint8Array(tiff)], { type: "image/tiff" });
};