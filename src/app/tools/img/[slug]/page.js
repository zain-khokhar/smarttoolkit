import { notFound } from "next/navigation";
import ImageConverter from "../png-to-jpg/ImageConverter";
// import ImageConverter from "../../png-to-jpg/ImageConverter";
export const dynamic = "force-static";  // force static generation
export const revalidate = false;
const formats = [
    "png", "jpg", "avif", "jpeg", "webp",
    "ico", "bmp", "tiff", "tif", "gif", "svg",
];

export async function generateStaticParams() {
    const params = [];
    for (let from of formats) {
        for (let to of formats) {
            if (from !== to) {
                params.push({ slug: `${from}-to-${to}` });
            }
        }
    }
    return params;
}

// ✅ Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const [from, to] = slug.split("-to-");

    if (!formats.includes(from) || !formats.includes(to)) {
        return {};
    }

    const title = `${from.toUpperCase()} to ${to.toUpperCase()} Image Converter - Free, Fast, Bulk, Private, No ads`;
    const description = `Easily convert ${from.toUpperCase()} images into ${to.toUpperCase()} format using our free online image converter. Free, Fast, secure, Bulk, no ads and no quality loss.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `/${slug}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function page({ params }) {
    const { slug } = await params;
    const [from, to] = slug.split("-to-");

    if (!formats.includes(from) || !formats.includes(to)) {
        notFound();
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": `Convert ${from.toUpperCase()} to ${to.toUpperCase()}`,
                        "operatingSystem": "All",
                        "applicationCategory": "UtilitiesApplication",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": 4.6,
                            "ratingCount": 8864
                        },
                        "description": `Free online tool to convert ${from.toUpperCase()} images into ${to.toUpperCase()} format. Fast, reliable, and private.`,
                        "url": `https://smarttoolkit.online/${slug}`,
                        "inLanguage": "en-US",
                        "keywords": `image converter, convert ${from} to ${to}, free online tool, fast conversion`,
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
                            "name": `Convert ${from.toUpperCase()} to ${to.toUpperCase()}`,
                            "target": `https://smarttoolkit.online/${slug}`
                        }
                    }).replace(/</g, '\\u003c')
                }}
            />

            <ImageConverter defaultFrom={from} defaultTo={to} />
        </>
    );
}
