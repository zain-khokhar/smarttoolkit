import { notFound } from "next/navigation";
import ImageCompressor from "../../../components/img-compressor/ImageCompressor";

const validFormats = ["jpg", "jpeg", "png", "webp"];
export const dynamic = "force-static";  // force static generation
export const revalidate = false;

// ✅ Generate Metadata dynamically
export async function generateMetadata({ params }) {
    const { format } = await params;

    if (!validFormats.includes(format)) return notFound();

    const upper = format.toUpperCase();
    const title = `${upper} Image Compressor - Free, Fast, Secure, Bulk, No Ads Online Tool`;
    const description = `Compress and optimize your ${upper} images online without losing quality. Supports multiple uploads, metadata removal, and downloads in ${upper} format.`;
    const url = `https://smarttoolkit.online/tools/${format}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: [
                {
                    url: `https://smarttoolkit.online/logo.webp`,
                    width: 1200,
                    height: 630,
                    alt: `${upper} Image Compressor`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export async function generateStaticParams() {
    return validFormats.map((format) => ({ format }));
}

export default async function Page({ params }) {
    const { format } = await params;
    if (!validFormats.includes(format)) return notFound();

    const schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": `${format.toUpperCase()} Image Compressor`,
        "operatingSystem": "All",
        "applicationCategory": "UtilitiesApplication",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": 4.7,
            "ratingCount": 9240
        },
        "description": `Free online tool to compress and optimize ${format.toUpperCase()} images without losing quality. Fast, reliable, and private.`,
        "url": `https://smarttoolkit.online/tools/${format}`,
        "inLanguage": "en-US",
        "keywords": `image compressor, compress ${format} images, free online tool, fast compression`,
        "publisher": {
            "@type": "Organization",
            "name": "SmartToolkit",
            "logo": {
                "@type": "ImageObject",
                "url": "https://smarttoolkit.online/logo.webp",
                "width": 200,
                "height": 60
            }
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "potentialAction": {
            "@type": "Action",
            "name": `Compress ${format.toUpperCase()} Images`,
            "target": `https://smarttoolkit.online/tools/${format}`
        }
    };

    return (
        <>
            {/* ✅ Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
                }}
            />
            <ImageCompressor routeFormat={format} />
        </>
    );
}
