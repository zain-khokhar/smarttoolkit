"use client"

import { decodeAVIF } from "./avif";
import { guessFormatKey, imageBitmapToImageData, tryNative } from "./composeFrame";
import { decodeGIF } from "./gif";
import { decodeICO } from "./ico";
import { drawSVGToImageData } from "./svg";
import { decodeTIFF } from "./tiff";

export const decodeFile = async (file, srcFmt) => {
    const fmt = srcFmt || guessFormatKey(file.type) || guessFormatKey(file.name);
    if (fmt === "svg") {
        const text = await file.text();
        return drawSVGToImageData(text);
    }

    // GIF animated decode
    if (fmt === "gif") {
        return await decodeGIF(file);
    }

    if (fmt === "tiff" || fmt === "tif") {
        return await decodeTIFF(file);
    }

    if (fmt === "ico") {
        return await decodeICO(file);
    }


    // if (fmt === "heic" || fmt === "heif") {
    //   const heic2any = (await loadHeic2Any()).default;
    //   const pngBlob = await heic2any({ blob: file, toType: "image/png" });
    //   const bmp = await createImageBitmap(pngBlob);
    //   const imageData = await imageBitmapToImageData(bmp);
    //   return { frames: [{ imageData }], width: bmp.width, height: bmp.height, animated: false };
    // }

    // AVIF: try native first; otherwise fall back to canvas via <img> if supported data URL
    if (fmt === "avif") {
        const decodedBlob = await decodeAVIF(file);

        // Convert blob → ImageData
        const bmp = await createImageBitmap(decodedBlob);
        const imageData = await imageBitmapToImageData(bmp);

        return {
            frames: [{ imageData }],
            width: bmp.width,
            height: bmp.height,
            animated: false,
        };
    }
    const tryNative = async () => {
        try {
            const bmp = await createImageBitmap(file);
            return bmp;
        } catch {
            // fallback below
            return null;
        }
    };
    // Default: attempt native for PNG/JPEG/WebP and others that browser can decode
    const native = await tryNative();
    if (native) {
        const imageData = await imageBitmapToImageData(native);
        return { frames: [{ imageData }], width: native.width, height: native.height, animated: false };
    }

    throw new Error(`Unsupported or failed to decode: ${file.name}`);
};
