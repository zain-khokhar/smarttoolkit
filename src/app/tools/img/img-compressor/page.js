"use client";
import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatSize, handleDownloadAll, handleDownloadAllSeparate } from "@/lib/compress";


export default function ImgCompressor() {
  // Each image: { id, file, url, checked, compressedBlob, compressedUrl, progress, error }
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(80);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [outputFormat, setOutputFormat] = useState("webp");
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef();

  async function compressSelected() {
    setIsCompressing(true);
    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      if (!img.checked) continue;

      updatedImages[i] = { ...img, progress: 1, error: null };
      setImages([...updatedImages]);

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: `image/${outputFormat}`,
          initialQuality: quality / 100,
        };

        // Always client-side compression
        let compressedFileOrBlob = await imageCompression(img.file, options);

        if (removeMetadata) {
          compressedFileOrBlob = new File([compressedFileOrBlob], img.file.name, {
            type: compressedFileOrBlob.type,
          });
        }

        const compressedUrl = URL.createObjectURL(compressedFileOrBlob);

        updatedImages[i] = {
          ...img,
          compressedBlob: compressedFileOrBlob,
          compressedUrl,
          progress: 0,
          error: null,
        };

        setImages([...updatedImages]);
      } catch (err) {
        updatedImages[i] = {
          ...img,
          progress: 0,
          error: err?.message || "Compression failed",
        };
        setImages([...updatedImages]);
      }
    }

    setIsCompressing(false);
  }


  // Handle file(s) selection or drop
  function handleFiles(files) {
    const newImages = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const id = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
      newImages.push({
        id,
        file,
        url: URL.createObjectURL(file),
        checked: true,
        compressedBlob: null,
        compressedUrl: null,
        progress: 0,
        error: null,
      });
    }
    setImages((prev) => [...prev, ...newImages]);
  }

  // File input change
  function handleFileChange(e) {
    handleFiles(e.target.files);
    e.target.value = ""; // reset input
  }

  // Drag & drop
  function handleDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  // Checkbox toggle
  function toggleChecked(id) {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, checked: !img.checked } : img
      )
    );
  }

  // Delete image
  function deleteImage(id) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  // Compress selected images


  // Summary bar
  const selectedImages = images.filter((img) => img.checked);
  const totalOriginal = selectedImages.reduce(
    (sum, img) => sum + (img.file?.size || 0),
    0
  );
  const totalCompressed = selectedImages.reduce(
    (sum, img) => sum + (img.compressedBlob?.size || 0),
    0
  );
  const spaceSaved =
    totalOriginal && totalCompressed
      ? totalOriginal - totalCompressed
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-700 text-white border-0 rounded-none">
          <CardHeader className="pb-4">

            <CardTitle className="text-xl md:text-2xl">
              Image Compressor
            </CardTitle>
            <CardDescription className="text-gray-200 mt-2">
              Reduce image size without losing quality. Supports multiple images.

            </CardDescription>
          </CardHeader>
        </Card>


        <div className="p-6 md:p-8">
          {/* File Upload Section */}
          <div className="mb-8">
            <Label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</Label>
            <div
              className="flex items-center justify-center w-full"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop multiple images</p>
                  <p className="text-xs text-gray-500">JPG, PNG, WEBP</p>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isCompressing}
                />
              </label>
            </div>
          </div>
          {/* Images Grid */}
          {images.length > 0 && (
            <div className="mb-8 flex overflow-x-auto overflow-y-hidden gap-6 pb-2">
              {images.map((img) => (
                <Card
                  key={img.id}
                  className="relative overflow-hidden flex-shrink-0 w-48"
                >
                  <CardContent className="p-2 flex flex-col items-center">
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500"
                      onClick={() => deleteImage(img.id)}
                      disabled={isCompressing}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>

                    {/* Checkbox */}
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={img.checked}
                        onCheckedChange={() => toggleChecked(img.id)}
                        disabled={isCompressing}
                      />
                    </div>

                    {/* Thumbnail */}
                    <img
                      src={img.url}
                      alt={img.file.name}
                      className="rounded-lg object-contain border mb-3"
                    />

                    {/* File Info */}
                    <div className="text-xs text-gray-700 mb-1 text-center truncate w-40" title={img.file.name}>
                      {img.file.name}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {formatSize(img.file.size)}
                    </div>

                    {/* Progress or Result */}
                    {img.progress ? (
                      <div className="flex flex-col items-center w-full">
                        <Progress value={img.progress * 100} className="w-full mb-2" />
                        <span className="text-xs text-gray-500">Compressing...</span>
                      </div>
                    ) : img.error ? (
                      <div className="text-xs text-red-500">{img.error}</div>
                    ) : img.compressedBlob ? (
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-green-700 mb-1">
                          {formatSize(img.compressedBlob.size)}{" "}
                          <span className="text-gray-400">
                            ({((img.compressedBlob.size / img.file.size) * 100).toFixed(0)}
                            %)
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-teal-500 text-white"
                          asChild
                        >
                          <a
                            href={img.compressedUrl}
                            download={
                              img.file.name.replace(/\.[^.]+$/, "") + `.${outputFormat}`
                            }
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              ></path>
                            </svg>
                            Download
                          </a>
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Compress Button */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                onClick={compressSelected}
                disabled={isCompressing || !images.some((img) => img.checked)}
              >
                {isCompressing ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Compressing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Compress Selected Images
                  </>
                )}
              </Button>
              <Button
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white"
                onClick={() => handleDownloadAll(images, outputFormat)}
                disabled={
                  !images.some((img) => img.compressedBlob && img.checked)
                }
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download All as ZIP
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                onClick={() => handleDownloadAllSeparate(images, outputFormat)}
                disabled={!images.some((img) => img.compressedBlob && img.checked)}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download All
              </Button>

            </div>
          )}

          {/* Settings Panel */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Compression Settings
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Adjust quality, format, and metadata preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Quality Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="quality-slider">Quality: {quality}%</Label>
                  <Badge variant="secondary">
                    {quality >= 80 ? "High" : quality >= 50 ? "Medium" : "Low"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">Low</span>
                  <Slider
                    id="quality-slider"
                    min={10}
                    max={100}
                    step={10}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                    disabled={isCompressing}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">High</span>
                </div>
              </div>

              {/* Output Format Selector */}
              <div className="space-y-2">
                <Label htmlFor="output-format">Output Format</Label>
                <Select
                  value={outputFormat}
                  onValueChange={setOutputFormat}
                  disabled={isCompressing}
                >
                  <SelectTrigger id="output-format">
                    <SelectValue placeholder="Choose format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Metadata Switch */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-metadata"
                  checked={removeMetadata}
                  onCheckedChange={setRemoveMetadata}
                  disabled={isCompressing}
                />
                <Label htmlFor="remove-metadata">Remove Metadata (EXIF)</Label>
              </div>

            </CardContent>
          </Card>




          {/* Summary Bar */}
          {images.length > 0 && (
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg py-3 px-4 z-50">
              <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  <strong>{selectedImages.length}</strong> image
                  {selectedImages.length !== 1 && "s"} selected
                </span>
                <span>
                  Total Original: <strong>{formatSize(totalOriginal)}</strong>
                </span>
                <span>
                  Compressed:{" "}
                  <strong>
                    {totalCompressed ? formatSize(totalCompressed) : "--"}
                  </strong>
                </span>
                <span>
                  Space Saved:{" "}
                  <strong>
                    {spaceSaved > 0
                      ? formatSize(spaceSaved)
                      : "--"}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
            <p>
              This compressor uses advanced algorithms to reduce file size while maintaining quality.
              <br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}