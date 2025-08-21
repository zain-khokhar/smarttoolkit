import { NextResponse } from "next/server";
import { processTextPipeline } from "../../../lib/humnizerService";

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, tone = "neutral", language = "auto" } = body || {};

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const result = await processTextPipeline(text, { tone, language, req });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Humnizer API error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

