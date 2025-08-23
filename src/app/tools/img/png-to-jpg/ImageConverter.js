"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { FORMAT_CONFIG } from "./lib/Constant";
import { decodeFile } from "./lib/decodeFile";
import { convertFile } from "./lib/encodeFile";
import { guessFormatKey } from "./lib/composeFrame";

export default function ImageConverter({ defaultFrom = "png", defaultTo = "jpg" }) {
    const [files, setFiles] = useState([]);
    const [selected, setSelected] = useState([]);
    const [quality, setQuality] = useState(0.8);
    const [fillBackground, setFillBackground] = useState(true);
    const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
    const [loading, setLoading] = useState(false);
    const [converted, setConverted] = useState([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const [sourceFormat, setSourceFormat] = useState(defaultFrom);
    const [targetFormat, setTargetFormat] = useState(defaultTo);

    // sync props into state when route changes
    useEffect(() => {
        setSourceFormat(defaultFrom);
        setTargetFormat(defaultTo);
    }, [defaultFrom, defaultTo]);

    const targetCfg = FORMAT_CONFIG[targetFormat];

    const handleFiles = (incoming) => {
        const arr = Array.from(incoming).map((x) => (x.file ? x.file : x));
        const accepted = arr.map((file) => {
            const fmt = guessFormatKey(file.name) || guessFormatKey(file.type);
            const id = (crypto.randomUUID)
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2) + Date.now().toString(36);

            return { file, id, srcFmt: fmt };
            // return { file, id: crypto.randomUUID(), srcFmt: fmt };
        });
        setFiles((prev) => [...prev, ...accepted]);
        setSelected((prev) => [...prev, ...accepted.map((f) => f.id)]);
        setConverted([]);
        setProgress(0);
        setError(null);
    };

    const handleUrlUpload = async () => {
        const url = prompt("Enter Image URL:");
        if (!url) return;
        try {
            const res = await fetch(url, { mode: "cors" });
            if (!res.ok) throw new Error("Fetch failed");
            const blob = await res.blob();
            const fmt = guessFormatKey(blob.type) || guessFormatKey(url) || sourceFormat;
            if (!fmt) throw new Error("Unknown or unsupported format");
            const file = new File(
                [blob],
                `image-from-url.${FORMAT_CONFIG[fmt].extension}`,
                { type: blob.type || FORMAT_CONFIG[fmt].mime }
            );
            handleFiles([file]);
        } catch {
            alert("Failed to fetch image. Try another URL.");
        }
    };

    const toggleSelect = (id) =>
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );

    const toggleSelectAll = () =>
        setSelected((prev) =>
            prev.length === files.length ? [] : files.map((f) => f.id)
        );

    const fileAccept = useMemo(() => {
        const parts = [];
        for (const [, cfg] of Object.entries(FORMAT_CONFIG)) {
            if (cfg.mime) parts.push(cfg.mime);
            if (cfg.extension) parts.push("." + cfg.extension);
            if (cfg.altExtensions) cfg.altExtensions.forEach((e) => parts.push("." + e));
        }
        return Array.from(new Set(parts)).join(",");
    }, []);

    const convert = async () => {
        if (!selected.length) return;
        setLoading(true);
        setConverted([]);
        setError(null);

        const results = [];
        const selectedFiles = files.filter((f) => selected.includes(f.id));

        for (let i = 0; i < selectedFiles.length; i++) {
            const entry = selectedFiles[i];
            try {
                const decoded = await decodeFile(entry.file, entry.srcFmt);
                const needsBg = fillBackground && !FORMAT_CONFIG[targetFormat].supportsTransparency;

                const outBlob = await convertFile(
                    decoded,
                    targetFormat,
                    quality,
                    needsBg,
                    backgroundColor
                );

                const base =
                    entry.file.name.includes(".")
                        ? entry.file.name.slice(0, entry.file.name.lastIndexOf("."))
                        : entry.file.name;

                results.push({
                    id: entry.id,
                    name: `${base}.${FORMAT_CONFIG[targetFormat].extension}`,
                    url: URL.createObjectURL(outBlob),
                    sizeLabel: `${(outBlob.size / 1024).toFixed(1)} KB`,
                });
            } catch (e) {
                console.error(e);
                setError(`Failed to convert ${entry.file.name}: ${e.message || e}`);
            } finally {
                setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
            }
        }

        setConverted(results);
        setLoading(false);
    };

    const reset = () => {
        setFiles([]);
        setSelected([]);
        setConverted([]);
        setProgress(0);
        setLoading(false);
        setError(null);
    };

    const formatOptions = useMemo(() => {
        const all = Object.entries(FORMAT_CONFIG);
        const sourceOpts = all.filter(([_, v]) => v.canDecode);
        const targetOpts = all.filter(([_, v]) => v.canEncode);
        return { sourceOpts, targetOpts };
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center py-10 px-4">
            <Card className="w-full max-w-4xl shadow-2xl rounded-2xl">
                <CardContent className="p-6 space-y-6">
                    <h1 className="text-3xl font-bold text-center">
                        Convert {sourceFormat.toUpperCase()} → {targetFormat.toUpperCase()}
                    </h1>
                    <p className="text-center text-gray-500 text-sm">
                        Free online tool to convert {sourceFormat.toUpperCase()} images into{" "}
                        {targetFormat.toUpperCase()} format instantly.
                    </p>

                    {/* Format Selection */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">From:</span>
                            <Select value={sourceFormat} onValueChange={setSourceFormat}>
                                <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(FORMAT_CONFIG)
                                        .filter(([_, config]) => config.canDecode) // 👈 only decodable formats
                                        .map(([key, config]) => (
                                            <SelectItem key={key} value={key}>
                                                {config.label}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="text-xl">→</div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm">To:</span>
                            <Select value={targetFormat} onValueChange={setTargetFormat}>
                                <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Target" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(FORMAT_CONFIG).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            {config.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

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
                            id="fileInput"
                            type="file"
                            accept={fileAccept}
                            multiple
                            onChange={(e) => handleFiles(e.target.files)}
                            className="hidden"
                        />
                        <label
                            htmlFor="fileInput"
                            className="text-blue-600 font-semibold cursor-pointer"
                        >
                            Click to Browse Images
                        </label>
                        <p className="text-sm text-gray-500">or drag & drop files here</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Supported formats:{" "}
                            {Object.values(FORMAT_CONFIG)
                                .map((c) => c.label)
                                .join(", ")}
                        </p>
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
                        {FORMAT_CONFIG[targetFormat].supportsQuality && (
                            <div>
                                <p className="text-sm font-medium">
                                    Quality ({Math.round(quality * 100)}%)
                                </p>
                                <Slider
                                    min={0.2}
                                    max={1}
                                    step={0.1}
                                    value={[quality]}
                                    onValueChange={(v) => setQuality(v[0])}
                                />
                            </div>
                        )}

                        {!FORMAT_CONFIG[targetFormat].supportsTransparency && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={fillBackground}
                                        onCheckedChange={setFillBackground}
                                    />
                                    <span className="text-sm">
                                        Fill transparent areas with background color
                                    </span>
                                </div>
                                {fillBackground && (
                                    <div className="flex items-center gap-2 ml-7">
                                        <span className="text-sm">Color:</span>
                                        <input
                                            type="color"
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className="w-8 h-8 rounded cursor-pointer"
                                        />
                                        <span className="text-xs text-gray-500">
                                            {backgroundColor}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Uploaded Images */}
                    {files.length > 0 && (
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">
                                    Uploaded Images ({files.length})
                                </h3>
                                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                                    {selected.length === files.length
                                        ? "Deselect All"
                                        : "Select All"}
                                </Button>
                            </div>

                            <div className="overflow-x-auto pb-4">
                                <div className="flex space-x-4 min-h-max">
                                    {files.map((f) => (
                                        <div
                                            key={f.id}
                                            className={`border rounded-lg p-3 flex flex-col items-center min-w-[200px] ${selected.includes(f.id)
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
                                            <p className="text-sm truncate mb-1 max-w-[180px]">
                                                {f.file.name}
                                            </p>
                                            <img
                                                src={URL.createObjectURL(f.file)}
                                                alt={f.file.name}
                                                className="h-32 object-contain mb-1"
                                            />
                                            <p className="text-xs text-gray-500">
                                                {(f.file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Convert / Reset */}
                    <div className="flex justify-center gap-4 mt-6 flex-wrap">
                        <Button onClick={convert} disabled={loading || selected.length === 0}>
                            {loading
                                ? "Converting..."
                                : `Convert to ${FORMAT_CONFIG[targetFormat].label}`}
                        </Button>
                        <Button variant="outline" onClick={reset}>
                            Reset
                        </Button>
                    </div>

                    {/* Progress */}
                    {loading && (
                        <div className="space-y-2 mt-4">
                            <Progress value={progress} className="w-full" />
                            <p className="text-center text-sm text-gray-500">
                                Processing {progress}%
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {converted.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-medium mb-2">
                                Converted Images ({converted.length})
                            </h3>
                            <div className="overflow-x-auto pb-4">
                                <div className="flex space-x-4 min-h-max">
                                    {converted.map((f) => (
                                        <div
                                            key={f.id}
                                            className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 flex flex-col items-center min-w-[200px]"
                                        >
                                            <h3 className="text-sm font-medium mb-2 text-center">
                                                Converted {sourceFormat.toUpperCase()} →{" "}
                                                {targetFormat.toUpperCase()}
                                            </h3>
                                            <img
                                                src={f.url}
                                                alt={f.name}
                                                className="h-32 object-contain mb-1"
                                            />
                                            <p className="text-xs text-gray-500 mb-2">
                                                {f.sizeLabel}
                                            </p>
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
                            </div>
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
                                Download All ({converted.length})
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
