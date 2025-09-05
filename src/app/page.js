// src/app/page.js
import ClientHero from '@/components/ClientHero';
import ClientFeatures from '@/components/ClientFeatures';
import Link from 'next/link';
import Script from 'next/script';
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://smarttoolkit.online/#website",
      url: "https://smarttoolkit.online",
      name: "SmartToolkit",
      description:
        "SmartToolkit.online offers free, fast, and reliable online software utilities with zero ads and full privacy. Convert files, compress images, optimize documents, and boost productivity with secure results.",
      publisher: {
        "@id": "https://smarttoolkit.online/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://smarttoolkit.online/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://smarttoolkit.online/#organization",
      name: "SmartToolkit",
      url: "https://smarttoolkit.online",
      logo: {
        "@type": "ImageObject",
        url: "https://smarttoolkit.online/logo.png",
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/SmartToolkit",
        "https://facebook.com/SmartToolkit",
        "https://linkedin.com/company/smarttoolkit",
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://smarttoolkit.online/#webpage",
      url: "https://smarttoolkit.online",
      name: "SmartToolkit - Fast, Reliable & Privacy-Focused Online Utilities",
      description:
        "SmartToolkit.online provides free, ad-free, and privacy-first tools to convert files, compress images, and optimize documents securely and quickly.",
      isPartOf: {
        "@id": "https://smarttoolkit.online/#website",
      },
      inLanguage: "en-US",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://smarttoolkit.online/og-image.png",
        width: 1200,
        height: 630,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is SmartToolkit really free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, SmartToolkit is 100% free to use with no hidden costs, subscriptions, or advertisements. All tools are accessible instantly.",
          },
        },
        {
          "@type": "Question",
          name: "Does SmartToolkit store my files or data?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, your files and data are never stored on our servers. Processing happens securely and files are automatically deleted after conversion.",
          },
        },
        {
          "@type": "Question",
          name: "What types of files can I convert?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SmartToolkit supports images, PDFs, documents, and various file formats. New tools and formats are added regularly.",
          },
        },
      ],
    },
  ],
};

// src/app/page.js
export const metadata = {
  title: "SmartToolkit - Fast, Reliable & Privacy-Focused Online Utilities",
  description:
    "SmartToolkit.online offers free, fast, and reliable online software utilities with zero ads and full privacy. Convert files, compress images, optimize documents, and boost productivity with secure results.",
  authors: [{ name: "SmartToolkit Team", url: "https://smarttoolkit.online" }],
  creator: "SmartToolkit",
  publisher: "SmartToolkit.online",
  metadataBase: new URL("https://smarttoolkit.online"),
  alternates: {
    canonical: "https://smarttoolkit.online",
  },
  openGraph: {
    type: "website",
    url: "https://smarttoolkit.online",
    title: "SmartToolkit - Fast, Reliable & Privacy-Focused Online Utilities",
    description:
      "Use SmartToolkit.online for free, fast, and reliable online utilities. 100% ad-free, secure, and privacy-first file conversions, optimizations, and productivity tools.",
    siteName: "SmartToolkit",
    locale: "en_US",
    images: [
      {
        url: "https://smarttoolkit.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartToolkit - Free Online Utilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartToolkit - Fast, Reliable & Privacy-Focused Online Utilities",
    description:
      "SmartToolkit.online provides ad-free, privacy-first software utilities. Convert, compress, and optimize files online with speed and reliability.",
    creator: "@SmartToolkit",
    images: ["https://smarttoolkit.online/og-image.png"],
  },
  category: "utilities",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Script
        id="json-ld-landing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientHero />
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <ClientFeatures />
      </section>
      {/* <main className="min-h-screen bg-background text-foreground">
        <div className="py-20 px-6 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">SmartToolkit — Live Tool Previews</h1>
          <p className="text-lg mb-8">Try interactive before/after previews for image & video tools.</p>
        </div>
        <ToolsDemo />
      </main>  */}
      <div>
        {/* <Preview /> */}
      </div>
      <footer className="border-t border-gray-200 bg-white py-10 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Converters */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Converters</h3>
            <ul className="space-y-2 pl-2 text-gray-600">
              <li><Link href="/png-to-png">PNG Converter</Link></li>
              <li><Link href="/webp-to-webp">WebP Converter</Link></li>
              <li><Link href="/jpeg-to-jpeg">JPEG Converter</Link></li>
              <li><Link href="/tif-to-png">JPG Converter</Link></li>
              <li><Link href="/gif-to-png">GIF Converter</Link></li>
              <li><Link href="/avif-to-png">AVIF Converter</Link></li>
              <li><Link href="/ico-to-png">ICO Converter</Link></li>
              <li><Link href="/svg-to-png">SVG Converter</Link></li>
              <li><Link href="/tiff-to-png">TIFF/TIF Converter</Link></li>
              <li><Link href="/bmp-to-png">BMP Converter</Link></li>
            </ul>
          </div>

          {/* Compressors */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Compressors</h3>
            <ul className="space-y-2 pl-2 text-gray-600">
              <li><Link href="/tools/jpeg">JPEG Compressor</Link></li>
              <li><Link href="/tools/jpg">JPG Compressor</Link></li>
              <li><Link href="/tools/webp">WebP Compressor</Link></li>
              <li><Link href="/tools/png">PNG Compressor</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SmartToolkit. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
/**
 <className="min-h-screen bg-background text-foreground">
      <div className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">SmartToolkit — Live Tool Previews</h1>
        <p className="text-lg mb-8">Try interactive before/after previews for image & video tools.</p>
      </div>
      <ToolsDemo />
   

 */