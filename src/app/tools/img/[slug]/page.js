import { notFound } from "next/navigation";
import ImageConverter from "../png-to-jpg/ImageConverter";

const formats = ["png", "jpg", "avif", "jpeg", "webp", "ico", "bmp", "tiff","tif", "gif", "svg"];

export default async function ConversionPage({ params }) {
    const { slug } = await params; // "png-to-jpg"
    const [from, to] = slug.split("-to-");
    if (!formats.includes(from) || !formats.includes(to)) {
        notFound();
    }

    return <ImageConverter defaultFrom={from} defaultTo={to} />;
}

// Prebuild all combinations
export async function generateStaticParams() {
    const params = [];
    for (let from of formats) {
        for (let to of formats) {
            if (from !== to) params.push({ from, to });
        }
    }
    return params;
}
