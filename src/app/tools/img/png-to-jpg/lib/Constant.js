export const FORMAT_CONFIG = {
    png: { label: "PNG", extension: "png", mime: "image/png", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: true },
    jpg: { label: "JPG", extension: "jpg", mime: "image/jpg", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: true },
    jpeg: { label: "JPEG", extension: "jpeg", mime: "image/jpeg", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: true },
    webp: { label: "WebP", extension: "webp", mime: "image/webp", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: true },
    avif: { label: "AVIF", extension: "avif", mime: "image/avif", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: true },
    gif: { label: "GIF", extension: "gif", mime: "image/gif", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: false },
    bmp: { label: "BMP", extension: "bmp", mime: "image/bmp", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: false },
    tiff: { label: "TIFF", extension: "tiff", mime: "image/tiff", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: false },
    tif: { label: "TIF", extension: "tif", mime: "image/tif", canDecode: true, canEncode: true, supportsTransparency: false, supportsQuality: false },
    ico: { label: "ICO", extension: "ico", mime: "image/x-icon", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: false },
    svg: { label: "SVG", extension: "svg", mime: "image/svg+xml", canDecode: true, canEncode: true, supportsTransparency: true, supportsQuality: false },
    pdf: { label: "PDF", extension: "pdf", mime: "application/pdf", canDecode: false, canEncode: true, supportsTransparency: true, supportsQuality: false },
};