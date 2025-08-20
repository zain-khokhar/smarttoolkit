// src/lib/tiffDecoder.js
"use client";

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
