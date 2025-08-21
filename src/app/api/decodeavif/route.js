import sharp from "sharp";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const format = formData.get("format") || "png";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Invalid file type received" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // console.log("Uploaded file type:", file.type);
    // console.log("Buffer length:", buffer.length);

    if (!file.type.includes("avif")) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only AVIF allowed.` },
        { status: 400 }
      );
    }

    // Force Sharp to validate input
    try {
      await sharp(buffer).metadata();
    } catch (err) {
      return NextResponse.json(
        { error: "Not a valid AVIF file", details: err.message },
        { status: 400 }
      );
    }

    let outputBuffer, contentType;
    if (format === "jpeg" || format === "jpg") {
      outputBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
      contentType = "image/jpeg";
    } else {
      outputBuffer = await sharp(buffer).png().toBuffer();
      contentType = "image/png";
    }

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="decoded.${format}"`,
      },
    });
  } catch (error) {
    console.error("AVIF decoding error:", error);
    return NextResponse.json(
      { error: "Failed to decode AVIF", details: error.message },
      { status: 500 }
    );
  }
}
