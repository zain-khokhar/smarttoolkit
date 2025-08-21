"use client"

import { blobToDataURL, composeFrameOnCanvas, encodeNative } from "./composeFrame";

const loadCanvg = () => import("canvg");

export const drawSVGToImageData = async (svgText) => {
  const { Canvg } = await loadCanvg();
  const svg = new Blob([svgText], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svg);
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });
  const w = img.naturalWidth || 1024;
  const h = img.naturalHeight || 1024;
  URL.revokeObjectURL(url);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const renderer = Canvg.fromString(ctx, svgText);
  await renderer.render();
  const imageData = ctx.getImageData(0, 0, w, h);
  return { frames: [{ imageData }], width: w, height: h, animated: false, vectorSourceSVG: svgText };
};
export const encodeSVGWrapper = async (frame, w, h) => {
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