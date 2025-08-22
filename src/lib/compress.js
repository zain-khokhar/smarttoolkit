import JSZip from "jszip";

export async function handleDownloadAllSeparate(images, outputFormat) {
    const selected = images.filter((img) => img.compressedBlob && img.checked);
    if (!selected.length) return;

    selected.forEach((img, i) => {
        const url = URL.createObjectURL(img.compressedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
            img.file.name.replace(/\.[^.]+$/, "") + `.${outputFormat || "jpg"}`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 1000 * (i + 1)); // stagger cleanup
    });
}

export async function handleDownloadAll(images, outputFormat) {
    const toZip = images.filter((img) => img.compressedBlob && img.checked);
    if (!toZip.length) return;

    const zip = new JSZip();

    // Add files into zip
    toZip.forEach(({ file, compressedBlob }) => {
        const ext = outputFormat || "jpg";
        const filename = file.name.replace(/\.[^.]+$/, "") + `.${ext}`;
        zip.file(filename, compressedBlob);
    });

    // Generate valid zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Trigger download
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

export function formatSize(bytes) {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
