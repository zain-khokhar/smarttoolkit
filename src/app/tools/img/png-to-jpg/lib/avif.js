"use server";

import sharp from "sharp";
import path from "path";

export async function encodeAVIF(frame, w, h, quality = 80) {
  // frame.imageData = ImageData
  // Convert ImageData to raw RGBA buffer
  const buffer = Buffer.from(frame.imageData.data);

  // Sharp expects raw input like { raw: { width, height, channels } }
  const outputName = `converted-${Date.now()}.avif`;
  const outputPath = path.join(process.cwd(), "public", outputName);

  await sharp(buffer, {
    raw: { width: w, height: h, channels: 4 } // RGBA
  })
    .avif({ quality })
    .toFile(outputPath);

  return `/` + outputName; // return public URL
}
export const decodeAVIF = async (file) => {
    const bmp = await createImageBitmap(file); // file = Blob or File
    const canvas = new OffscreenCanvas(bmp.width, bmp.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bmp, 0, 0);
    const imageData = ctx.getImageData(0, 0, bmp.width, bmp.height);
    return { frames: [{ imageData }], width: bmp.width, height: bmp.height, animated: false };
};
