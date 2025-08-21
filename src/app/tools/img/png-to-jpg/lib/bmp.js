"use client"
const loadBMP = () => import("bmp-js");

export const encodeBMP = async (frame, w, h) => {
    const BMP = await loadBMP();
    const encoded = BMP.default.encode({
        data: Buffer.from(frame.imageData.data),
        width: w,
        height: h,
    });
    return new Blob([encoded.data], { type: "image/bmp" });
};