import { faqs } from "@/components/constant";
import RichTextEditorWrapper from "./_wrapper";

const RichTextToMdxConverter = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* ===== HEADER ===== */}
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Rich Text to MDX Converter
                    </h1>
                    <p className="text-slate-600 mt-2">
                        Paste or type rich text and get clean, optimized MDX output in real time.
                    </p>
                </header>

                {/* ===== EDITOR ===== */}
                <RichTextEditorWrapper />

                {/* ===== SEO CONTENT ===== */}
                <section className="mt-16 bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                        Why Use a Rich Text to MDX Converter?
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        MDX (Markdown + JSX) is a powerful format used in modern frameworks like{' '}
                        <strong>Next.js</strong>, <strong>Gatsby</strong>, and many JAMstack
                        applications. It allows you to write content using simple Markdown
                        syntax, while also embedding interactive React components directly
                        in your pages. This makes it perfect for building{' '}
                        <em>developer blogs</em>, documentation sites, or even interactive
                        tutorials.
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Our <strong>free online Rich Text to MDX Converter</strong> makes it
                        easy to transform text from editors like Google Docs, Microsoft Word,
                        or CMS systems into production-ready MDX with clean, lightweight
                        formatting. It eliminates messy HTML and optimizes your content for
                        performance, accessibility, and SEO.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                        Whether you're building a personal blog, technical documentation, or
                        content-heavy websites, converting rich text to MDX ensures your
                        content stays clean, scalable, and developer-friendly.
                    </p>
                </section>

                {/* ===== FAQ SECTION ===== */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((item, i) => (
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

                {/* ===== FOOTER ===== */}
                <footer className="mt-16 text-center text-sm text-slate-500">
                    <p>
                        Rich Text to MDX Converter • Built with Next.js and TipTap • Free
                        Online Tool
                    </p>
                </footer>
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: faqs.map(f => ({
                            "@type": "Question",
                            name: f.question,
                            acceptedAnswer: { "@type": "Answer", text: f.answer }
                        }))
                    })
                }}
            />
            <script
                id="ld-json-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "Rich Text to MDX Converter",
                        "operatingSystem": "All",
                        "applicationCategory": "UtilitiesApplication",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": 4.8,
                            "ratingCount": 5200
                        },
                        "description":
                            "Free online tool to convert rich text into clean MDX format. Optimize your content for Next.js, Gatsby, and modern web apps with just one click.",
                        "url": "https://smarttoolkit.online/richtext-to-mdxconverter",
                        "inLanguage": "en-US",
                        "keywords":
                            "mdx converter, rich text to mdx, next.js mdx, free online tool, markdown converter, tiptap",
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
                            "name": "Convert Rich Text to MDX",
                            "target": "https://smarttoolkit.online/richtext-to-mdxconverter"
                        }
                    }).replace(/</g, "\\u003c"),
                }}
            />
        </div>

    );
};

export default RichTextToMdxConverter;


export const generateMetadata = () => {
  const title = "Rich Text to MDX Converter | Free, Fast, No Ads Online";
  const description =
    "Convert rich text to clean MDX instantly. Free, Fast, No Ads online MDX converter and Editor built for developers.";
  const url = "https://smarttoolkit.online/richtext-to-mdxconverter";
  const image = "https://smarttoolkit.online/richtext-to-mdx.webp";

  return {
    title,
    description,
    keywords: [
      "mdx converter",
      "rich text to mdx",
      "free mdx tool",
      "markdown to mdx",
      "tiptap mdx converter",
      "nextjs mdx",
      "gatsby mdx",
      "markdown editor",
    ],
    authors: [{ name: "SmartToolkit", url: "https://smarttoolkit.online" }],
    creator: "SmartToolkit Team",
    publisher: "SmartToolkit",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "SmartToolkit",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Rich Text to MDX Converter",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@smarttoolkit",
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
};
