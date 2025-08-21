import sharp from "sharp";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse incoming FormData
    const formData = await request.formData();
    // console.log(formData)
    const file = formData.get("file");
    let quality = parseFloat(formData.get("quality") || "0.8");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert to 1–100 for sharp
    quality = Math.round(Math.min(Math.max(quality * 100, 1), 100));

    // Convert File/Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to AVIF
    const avifBuffer = await sharp(buffer)
      .avif({ quality, effort: 4 })
      .toBuffer();

    // Return AVIF file
    return new NextResponse(avifBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/avif",
        "Content-Disposition": 'attachment; filename="converted.avif"',
      },
    });
  } catch (error) {
    console.error("Server AVIF encoding error:", error);
    return NextResponse.json({ error: "Failed to encode AVIF" }, { status: 500 });
  }
}
