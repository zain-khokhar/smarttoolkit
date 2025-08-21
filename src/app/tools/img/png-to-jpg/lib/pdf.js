"use client"

import { blobToDataURL, composeFrameOnCanvas, encodeNative } from "./composeFrame";

const loadJsPDF = () => import("jspdf");

export const encodePDF = async (frames, w, h, bgApplied) => {
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