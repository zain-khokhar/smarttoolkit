"use client";
import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";

// Helper for formatting bytes
function formatSize(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// Helper to zip files in browser
async function createZip(files) {
  // Use JSZip if available, else fallback to a simple Blob zip
  // For demo, fallback to a multi-file Blob
  if (typeof window.JSZip === "function") {
    const zip = new window.JSZip();
    files.forEach(({ file, compressedBlob }) => {
      zip.file(
        file.name.replace(/\.[^.]+$/, "") + ".webp",
        compressedBlob
      );
    });
    const blob = await zip.generateAsync({ type: "blob" });
    return blob;
  } else {
    // fallback: create a multi-part blob (not a real zip)
    return new Blob(
      files.map(({ file, compressedBlob }) => compressedBlob),
      { type: "application/zip" }
    );
  }
}

export default function ImgCompressor() {
  // Each image: { id, file, url, checked, compressedBlob, compressedUrl, progress, error }
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(80);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef();

  // Device performance check
  function isStrongDevice() {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 2;
    return cores >= 4 && memory >= 4;
  }

                  // user media files filter

async function openFilteredPicker(maxSizeMB = 10) {
  // Prefer File System Access API if available (filters by extensions only)
  if (window.showOpenFilePicker) {
    try {
      while (true) {
        const handles = await window.showOpenFilePicker({
          multiple: true,
          types: [
            {
              description: "Images",
              accept: {
                "image/*": [".jpg", ".jpeg", ".png", ".webp"]
              }
            }
          ]
        });

        const files = await Promise.all(handles.map((h) => h.getFile()));

        // filter invalid by type/size
        const invalid = files.filter(
          (f) => !f.type?.startsWith("image/") || f.size > maxSizeMB * 1024 * 1024
        );

        if (invalid.length === 0) {
          handleFiles(files); // use your existing handler
          break;
        }

        // show invalid list and ask user to re-open picker or keep valid ones
        const msg =
          `These files are not allowed (max ${maxSizeMB}MB):\n\n` +
          invalid.map((f) => `${f.name} - ${(f.size / 1024 / 1024).toFixed(2)} MB`).join("\n");

        const retry = confirm(`${msg}\n\nClick OK to re-open picker and choose again.\nClick Cancel to accept only valid files (if any).`);
        if (!retry) {
          const valid = files.filter((f) => f.type?.startsWith("image/") && f.size <= maxSizeMB * 1024 * 1024);
          if (valid.length) handleFiles(valid);
          break;
        }
        // else loop to re-open picker
      }
    } catch (err) {
      // user cancelled or error — do nothing
    }
  } else {
    // fallback: trigger hidden input (your existing input has accept="image/*")
    fileInputRef.current?.click();
  }
}



  // Handle file(s) selection or drop
  function handleFiles(files) {
    const maxSizeMB = 10;
    const newImages = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(
          `File "${file.name}" is too large! Max allowed size is ${maxSizeMB} MB.`
        );
        continue;
      }
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
          fileType: "image/webp",
          initialQuality: quality / 100,
        };
        let compressedFileOrBlob;
        if (isStrongDevice()) {
          compressedFileOrBlob = await imageCompression(img.file, options);
          if (removeMetadata) {
            compressedFileOrBlob = new File(
              [compressedFileOrBlob],
              img.file.name,
              { type: compressedFileOrBlob.type }
            );
          }
        } else {
          // Backend compression
          const formData = new FormData();
          formData.append("file", img.file);
          const res = await fetch("/api/img-compressor", {
            method: "POST",
            body: formData,
          });
          compressedFileOrBlob = await res.blob();
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

  // Download all as ZIP
  async function handleDownloadAll() {
    const toZip = images.filter((img) => img.compressedBlob && img.checked);
    if (!toZip.length) return;
    // Use JSZip if available, else fallback
    let zipBlob;
    if (typeof window.JSZip === "function") {
      zipBlob = await createZip(toZip);
    } else {
      // fallback: create a multi-part blob (not a real zip)
      zipBlob = new Blob(
        toZip.map((img) => img.compressedBlob),
        { type: "application/zip" }
      );
    }
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compressed_images.zip";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }

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
        <div className="bg-gradient-to-r from-black to-white text-white p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor" >
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v7h-2.726l-2.9-3.098a1 1 0 00-1.474 0L8.726 10H6.253l-1.54-1.665a1 1 0 00-1.426 0L4 9.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Premium Image Compressor</h1>
          </div>
          <p className="text-indigo-100">Reduce image size without losing quality. Supports multiple images.</p>
        </div>

        <div className="p-6 md:p-8">
          {/* File Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
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
                  <p className="text-xs text-gray-500">JPG, PNG, WEBP (MAX. 10MB each)</p>
                </div>
                <input
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

          {/* Settings Panel */}
          <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Compression Settings</h2>
            {/* Quality Slider */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Quality: {quality}%</label>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  {quality >= 80 ? "High" : quality >= 50 ? "Medium" : "Low"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Low</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                  disabled={isCompressing}
                />
                <span className="text-sm text-gray-500">High</span>
              </div>
            </div>
            {/* Metadata Option */}
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeMetadata}
                  onChange={(e) => setRemoveMetadata(e.target.checked)}
                  className="sr-only peer"
                  disabled={isCompressing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-gray-900">Remove Metadata (EXIF)</span>
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((img) => (
                <div key={img.id} className="relative bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col items-center shadow-sm">
                  {/* Delete Icon */}
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={() => deleteImage(img.id)}
                    title="Delete"
                    disabled={isCompressing}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {/* Checkbox */}
                  <label className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={img.checked}
                      onChange={() => toggleChecked(img.id)}
                      disabled={isCompressing}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </label>
                  {/* Thumbnail */}
                  <img
                    src={img.url}
                    alt={img.file.name}
                    className="rounded-lg max-h-32 object-contain border mb-3"
                  />
                  {/* File Info */}
                  <div className="text-xs text-gray-700 mb-1 text-center break-all">
                    {img.file.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {formatSize(img.file.size)}
                  </div>
                  {/* Progress or Result */}
                  {img.progress ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mb-1"></div>
                      <span className="text-xs text-gray-500">Compressing...</span>
                    </div>
                  ) : img.error ? (
                    <div className="text-xs text-red-500">{img.error}</div>
                  ) : img.compressedBlob ? (
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-green-700 mb-1">
                        {formatSize(img.compressedBlob.size)}{" "}
                        <span className="text-gray-400">({((img.compressedBlob.size / img.file.size) * 100).toFixed(0)}%)</span>
                      </div>
                      <a
                        href={img.compressedUrl}
                        download={img.file.name.replace(/\.[^.]+$/, "") + ".webp"}
                        className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-medium rounded hover:opacity-90 transition-opacity duration-200 shadow"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Download
                      </a>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {/* Compress Button */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md"
                onClick={compressSelected}
                disabled={isCompressing || !images.some((img) => img.checked)}
              >
                {isCompressing ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Compressing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Compress Selected Images
                  </span>
                )}
              </button>
              <button
                className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md"
                onClick={handleDownloadAll}
                disabled={
                  !images.some((img) => img.compressedBlob && img.checked)
                }
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download All as ZIP
              </button>
            </div>
          )}

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
              <span className="text-xs text-gray-400">
                (For ZIP download, JSZip library is recommended for best results.)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}