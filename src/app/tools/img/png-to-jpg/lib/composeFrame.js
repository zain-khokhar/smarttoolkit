"use client"

import { FORMAT_CONFIG } from "./Constant";

export const composeFrameOnCanvas = (frame, w, h, applyBg,backgroundColor = '#ffffff') => {
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
export const encodeNative = (canvas, mime, quality) =>
    new Promise((resolve, reject) => {
        canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
            mime,
            quality
        );
    });

export const blobToDataURL = (blob) =>
    new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(blob);
    });

export const guessFormatKey = (str) => {
    if (!str) return null;
    const lower = str.toLowerCase();
    for (const key in FORMAT_CONFIG) {
        if (lower.endsWith(`.${key}`) || lower.includes(FORMAT_CONFIG[key].mime?.split("/")[1])) {
            return key;
        }
    }
    return null;
};


export const imageBitmapToImageData = async (bmp) => {
    const canvas = document.createElement("canvas");
    canvas.width = bmp.width;
    canvas.height = bmp.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bmp, 0, 0);
    return ctx.getImageData(0, 0, bmp.width, bmp.height);
};


export const tryNative = async () => {
    try {
        const bmp = await createImageBitmap(file);
        return bmp;
    } catch {
        // fallback below
        return null;
    }
};