"use client";

// -------------------- Helpers --------------------

// Draws frame.imageData on a canvas
const loadICO = () => import("ico-endec");

function composeFrameOnCanvas(frame, w, h, applyBg = false) {
  console.log("🖼️ composeFrameOnCanvas called", { frame, w, h, applyBg });
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  if (applyBg) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    console.log("✅ Background applied");
  }

  try {
    const tmp = new OffscreenCanvas(w, h);
    const tctx = tmp.getContext("2d");
    const id = tctx.createImageData(w, h);
    id.data.set(frame.imageData.data);
    tctx.putImageData(id, 0, 0);

    ctx.drawImage(tmp, 0, 0);
  } catch (err) {
    console.error("❌ composeFrameOnCanvas error:", err);
  }

  return canvas;
}

// Convert canvas → ArrayBuffer (PNG)
// Convert canvas → ArrayBuffer (PNG)
function canvasToPngArrayBuffer(canvas, size) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error(`❌ toBlob failed for ${size}x${size}`);
            return resolve(undefined);
          }
          console.log(`✅ Blob created (${size}x${size}):`, blob.type, blob.size);

          const reader = new FileReader();
          reader.onload = () => {
            console.log(`📦 ArrayBuffer ready (${size}x${size})`);
            resolve(reader.result);
          };
          reader.onerror = (err) => {
            console.error(`❌ FileReader error (${size}x${size})`, err);
            reject(err);
          };
          reader.readAsArrayBuffer(blob);
        },
        "image/png"
      );
    } catch (err) {
      console.error(`❌ canvasToPngArrayBuffer failed (${size}x${size})`, err);
      reject(err);
    }
  });
}

// -------------------- ICO Encoder --------------------
import { IconIco } from "@shockpkg/icon-encoder";

export async function encodeICO(frame) {
  console.log("🚀 encodeICO called", { frame });

  if (typeof window === "undefined" || !document) {
    throw new Error("encodeICO must run in the browser (no DOM on server)");
  }

  if (!frame?.imageData?.data) {
    console.error("❌ encodeICO: invalid frame.imageData", frame);
    throw new Error("encodeICO: invalid frame.imageData");
  }

  const sizes = [16, 32, 48, 64, 128];
  const ico = new IconIco();
  let added = 0;

  for (const s of sizes) {
    console.log(`🔄 Processing size ${s}x${s}`);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = s;
      canvas.height = s;
      const ctx = canvas.getContext("2d");

      const src = composeFrameOnCanvas(
        frame,
        frame.imageData.width,
        frame.imageData.height
      );
      ctx.drawImage(src, 0, 0, s, s);

      const arrBuf = await canvasToPngArrayBuffer(canvas, s);
      console.log(`📦 ArrayBuffer for ${s}x${s}:`, arrBuf);

      if (!arrBuf) {
        console.warn(`⚠️ No buffer for size ${s}`);
        continue;
      }
      const buf = Buffer.from(new Uint8Array(arrBuf));
      await ico.addFromPng(buf);
      console.log(`✅ Added ${s}x${s} to ICO`);
      added++;
    } catch (err) {
      console.warn(`⚠️ Skipping ${s}x${s} due to error:`, err);
    }
  }

  if (added === 0) {
    console.error("❌ No images were added to ICO", frame);
    throw new Error("No images were added to ICO — frame.imageData may be invalid");
  }

  const encoded = ico.encode();
  console.log("🎉 ICO encoded successfully:", encoded);
  return new Blob([encoded], { type: "image/x-icon" });
}

// -------------------- ICO Decoder --------------------
export async function decodeICO(file) {
  console.log("🚀 decodeICO called", { file });
  const ICO = (await import("icojs")).default;

  const arr = await file.arrayBuffer();
  console.log("📦 ICO ArrayBuffer length:", arr.byteLength);

  const images = await ICO.parseICO(arr, "image/png");
  console.log("🔍 Parsed ICO images:", images);

  if (!images.length) {
    console.error("❌ No ICO images found");
    throw new Error("No ICO images found");
  }

  // Pick largest size
  const largest = images.sort(
    (a, b) => b.width * b.height - a.width * a.height
  )[0];
  console.log("🏆 Largest ICO frame:", largest);

  // Convert dataURL → ImageBitmap
  // const res = await fetch(largest.dataURL);
  // const blob = await res.blob();
 
  const blob = new Blob([largest.buffer], { type: "image/png" });
  const url = URL.createObjectURL(blob);
   const bmp = await createImageBitmap(blob);
  console.log("🖼️ Created ImageBitmap:", bmp);
  // Draw onto canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  ctx.drawImage(bmp, 0, 0);

  const imageData = ctx.getImageData(0, 0, bmp.width, bmp.height);
  console.log("📊 Extracted ImageData:", imageData);

  const result = {
    frames: [
      {
        imageData: new ImageData(
          new Uint8ClampedArray(imageData.data),
          imageData.width,
          imageData.height
        ),
      },
    ],
    width: bmp.width,
    height: bmp.height,
    animated: false,
  };

  console.log("✅ Final decodeICO result:", result);
  return result;
}
