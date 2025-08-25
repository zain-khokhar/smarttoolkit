import { notFound } from "next/navigation";
import ImageConverter from "../png-to-jpg/ImageConverter";
import { convertData } from "@/components/constant";
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
    const data = convertData[`${from}Converter`];
    if (!data) notFound();
    const formatUpper = from.toUpperCase();


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

              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

                {/* Intro Section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-8 shadow-lg">
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{formatUpper} Image Converter Online</h1>
                    <p className="text-lg sm:text-xl">{data.intro}</p>
                </div>

                {/* How to Use Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">How to Convert Your {formatUpper} Images</h2>
                    <ol className="space-y-4 list-decimal list-inside">
                        {data.steps.map((step, i) => (
                            <li
                                key={i}
                                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                {step}
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Benefits Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Why Optimize {formatUpper} Images?</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {data.benefits.map((b, i) => (
                            <li
                                key={i}
                                className="flex items-start bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 border border-gray-100"
                            >
                                <div className="flex-shrink-0 mr-4">
                                    <span className="inline-block bg-blue-100 text-blue-600 rounded-full p-2">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                </div>
                                <p className="text-gray-800 font-medium">{b}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* FAQ Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {data.faq.map((item, i) => (
                            <details
                                key={i}
                                className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <summary className="cursor-pointer text-gray-900 font-semibold text-lg">
                                    {item.question}
                                </summary>
                                <p className="mt-2 text-gray-700">{item.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>

            </div>

                        {/* FAQ Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: data.faq.map(f => ({
                            "@type": "Question",
                            name: f.question,
                            acceptedAnswer: { "@type": "Answer", text: f.answer }
                        }))
                    })
                }}
            />
        </>
    );
}
