

/**
 * Convert a canvas frame to AVIF via server-side API.
 * @param {HTMLCanvasElement} canvas - The rendered image canvas.
 * @param {number} quality - Compression quality (1-100).
 * @returns {Promise<Blob>} - The resulting AVIF blob.
 */
export async function encodeAVIF(canvas, quality = 80) {
  // First, turn canvas into a PNG blob
  const pngBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  // Convert browser Blob -> Node-like File
  const file = new File([pngBlob], "frame.png", { type: "image/png" });

  // Prepare FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("quality", quality.toString());

  // Call server-side AVIF encoder
  const response = await fetch("/api/encodeavif", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to encode AVIF");
  }

  return await response.blob();
}
// src/lib/decodeAVIF.js
// src/lib/decodeAVIF.js
export const decodeAVIF = async (file, format = "png") => {
  if (!(file instanceof File)) {
    throw new Error("decodeAVIF expects a File object (from <input> or drag-drop).");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("format", format);

  const res = await fetch("/api/decodeavif", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("DecodeAVIF API error:", err);
    throw new Error(`Decode failed: ${err}`);
  }

  return await res.blob(); // <-- returns decoded PNG/JPEG blob
};

