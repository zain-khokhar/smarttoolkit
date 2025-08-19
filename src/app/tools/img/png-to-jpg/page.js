"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function PngToJpgPage() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [quality, setQuality] = useState(0.8);
  const [fillWhite, setFillWhite] = useState(true);
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState([]);
  const [progress, setProgress] = useState(0);

  // Handle file input or drag drop
  const handleFiles = (incoming) => {
    const selectedFiles = Array.from(incoming).map((file) => ({
      file,
      id: crypto.randomUUID(),
    }));
    setFiles((prev) => [...prev, ...selectedFiles]);
    setSelected((prev) => [...prev, ...selectedFiles.map((f) => f.id)]);
    setConverted([]);
    setProgress(0);
  };

  // Handle URL upload
  const handleUrlUpload = async () => {
    const url = prompt("Enter Image URL (PNG only):");
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      if (blob.type !== "image/png") {
        alert("Only PNG images allowed!");
        return;
      }
      const file = new File([blob], "image-from-url.png", { type: "image/png" });
      handleFiles([file]);
    } catch {
      alert("Failed to fetch image. Try another URL.");
    }
  };

  // Toggle selection for bulk convert
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Convert selected images
  const convert = async () => {
    if (!selected.length) return;
    setLoading(true);
    setConverted([]);
    const results = [];
    const selectedFiles = files.filter((f) => selected.includes(f.id));

    for (let i = 0; i < selectedFiles.length; i++) {
      const { file } = selectedFiles[i];
      const img = await loadImage(URL.createObjectURL(file));
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (fillWhite) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );

      const url = URL.createObjectURL(blob);
      results.push({
        id: selectedFiles[i].id,
        name: file.name.replace(/\.png$/i, ".jpg"),
        url,
        size: (blob.size / 1024).toFixed(1) + " KB",
      });

      setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
    }

    setConverted(results);
    setLoading(false);
  };

  // Reset everything
  const reset = () => {
    setFiles([]);
    setSelected([]);
    setConverted([]);
    setProgress(0);
    setLoading(false);
  };

  // Load image utility
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center py-10 px-4">
      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center">
            PNG → JPG Converter
          </h1>
          <p className="text-center text-gray-500 text-sm">
            Upload, preview, select images and convert them to JPG with custom
            quality.
          </p>

          {/* Upload Section */}
          <div
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition"
          >
            <input
              type="file"
              accept="image/png"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="text-blue-600 font-semibold cursor-pointer"
            >
              Click to Browse PNGs
            </label>
            <p className="text-sm text-gray-500">or drag & drop files here</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUrlUpload}
              className="mt-3"
            >
              Upload from URL
            </Button>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">
                Quality ({Math.round(quality * 100)}%)
              </p>
              <Slider
                min={0.2}
                max={1}
                step={0.1}
                value={[quality]}
                onValueChange={(val) => setQuality(val[0])}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={fillWhite} onCheckedChange={setFillWhite} />
              <span className="text-sm">Fill transparent areas with white</span>
            </div>
          </div>

          {/* Uploaded Images with selection */}
          {files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {files.map((f) => (
                <div
                  key={f.id}
                  className={`border rounded-lg p-3 flex flex-col items-center ${
                    selected.includes(f.id)
                      ? "ring-2 ring-blue-500"
                      : "ring-0"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mb-2"
                    checked={selected.includes(f.id)}
                    onChange={() => toggleSelect(f.id)}
                  />
                  <p className="text-sm truncate mb-1">{f.file.name}</p>
                  <img
                    src={URL.createObjectURL(f.file)}
                    alt={f.file.name}
                    className="max-h-48 object-contain mb-1"
                  />
                  <p className="text-xs text-gray-500">
                    {(f.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Convert & Reset Buttons below uploaded images */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <Button
              onClick={convert}
              disabled={loading || selected.length === 0}
            >
              {loading ? "Converting..." : "Convert Selected"}
            </Button>
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>

          {/* Conversion Progress */}
          {loading && (
            <div className="space-y-2 mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-gray-500">
                Processing {progress}%
              </p>
            </div>
          )}

          {/* Converted Results */}
          {converted.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {converted.map((f) => (
                <div
                  key={f.id}
                  className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 flex flex-col items-center"
                >
                  <h3 className="text-sm font-medium mb-2 text-center">
                    After
                  </h3>
                  <img
                    src={f.url}
                    alt={f.name}
                    className="max-h-48 object-contain mb-1"
                  />
                  <p className="text-xs text-gray-500 mb-2">{f.size}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = f.url;
                      a.download = f.name;
                      a.click();
                    }}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Download All */}
          {converted.length > 1 && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() =>
                  converted.forEach((f) => {
                    const a = document.createElement("a");
                    a.href = f.url;
                    a.download = f.name;
                    a.click();
                  })
                }
              >
                Download All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
