
// app/api/compress/route.js
import sharp from "sharp";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");
  const buffer = Buffer.from(await file.arrayBuffer());

  const compressed = await sharp(buffer)
    .resize(800)       // resize
    .webp({ quality: 70 }) // compress
    .toBuffer();

  return new Response(compressed, {
    headers: { "Content-Type": "image/webp" }
  });
}
