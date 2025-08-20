"use client"
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