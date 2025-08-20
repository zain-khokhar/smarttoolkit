"use client"
import GIF from "../../../../../../public/gif.js.optimized";
import { parseGIF, decompressFrames } from "gifuct-js"; // or loadGifDecode()


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

export const encodeGIF = async (frames, width, height) => {
  const gif = new GIF({
    workers: 2,
    workerScript: "/workers/gif.worker.js", // ✅ served locally (no CORS)
    width,
    height,
    quality: 10,
    transparent: null,
  });

  for (const fr of frames) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(fr.imageData, 0, 0);

    gif.addFrame(ctx, { copy: true, delay: fr.delayMs || 100 });
  }

  const blob = await new Promise((resolve) => {
    gif.on("finished", (b) => resolve(b));
    gif.render();
  });

  return blob;
};

export async function decodeGIF(file) {
  const buf = await file.arrayBuffer();
  const gif = parseGIF(new Uint8Array(buf));
  const framesRaw = decompressFrames(gif, true);

  const frames = framesRaw.map((f) => {
    const { width, height } = f.dims;
    return {
      imageData: new ImageData(new Uint8ClampedArray(f.patch), width, height),
      delayMs: Math.max(20, (f.delay || 10) * 10), // normalize
    };
  });

  const w = framesRaw[0]?.dims.width || 0;
  const h = framesRaw[0]?.dims.height || 0;

  return { frames, width: w, height: h, animated: frames.length > 1 };
}