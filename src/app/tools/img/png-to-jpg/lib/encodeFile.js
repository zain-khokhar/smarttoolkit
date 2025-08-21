// ./lib/convertFile.js
import { composeFrameOnCanvas, encodeNative } from "./composeFrame";
import { encodeAVIF } from "./avif";
import { encodeGIF } from "./gif";
import { encodeBMP } from "./bmp";
import { encodeTIFF } from "./tiff";
import { encodeICO } from "./ico";
import { encodeSVGWrapper } from "./svg";
import { encodePDF } from "./pdf";

export async function convertFile(decoded, targetFormat, quality, needsBg, backgroundColor) {
  const { width, height } = decoded;

  const encoders = {
    png: async () => {
      const canvas = composeFrameOnCanvas(decoded.frames[0], width, height, needsBg, backgroundColor);
      return encodeNative(canvas, "image/png");
    },
    jpg: async () => {
      const canvas = composeFrameOnCanvas(decoded.frames[0], width, height, true); // JPEG no alpha
      return encodeNative(canvas, "image/jpeg", quality);
    },
    jpeg: async () => encoders.jpg(),
    webp: async () => {
      const canvas = composeFrameOnCanvas(decoded.frames[0], width, height, needsBg);
      return encodeNative(canvas, "image/webp", quality);
    },
    avif: async () => {
      const canvas = composeFrameOnCanvas(decoded.frames[0], width, height, needsBg);
      return encodeAVIF(canvas, quality);
    },
    gif: async () => encodeGIF(decoded.frames, width, height),
    bmp: async () => {
      const canvas = composeFrameOnCanvas(decoded.frames[0], width, height, needsBg || true);
      const ctx = canvas.getContext("2d");
      const flat = ctx.getImageData(0, 0, width, height);
      return encodeBMP({ imageData: flat }, width, height);
    },
    tiff: async () => encodeTIFF(decoded.frames, width, height),
    tif: async () => encoders.tiff(),
    ico: async () => encodeICO(decoded.frames[0]),
    svg: async () => encodeSVGWrapper(decoded.frames[0], width, height),
    pdf: async () => encodePDF(decoded.frames, width, height, needsBg),
  };

  if (!encoders[targetFormat]) {
    throw new Error(`Target format not supported: ${targetFormat}`);
  }
  return encoders[targetFormat]();
}
