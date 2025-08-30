import "./globals.css";
import { NavBar } from "../../NavBar";

export const metadata = {
  title: "SmartToolkit - Fast, Reliable & Privacy-Focused Online Utilities",
  description:
    "SmartToolkit.online offers free, fast, and reliable online software utilities with zero ads and full privacy. Convert files, compress images, optimize documents, and boost productivity with secure results.",
  keywords: [
    "free online tools",
    "file converter",
    "image compressor",
    "PDF tools",
    "privacy focused utilities",
    "no ads software utilities",
    "fast online converter",
    "SmartToolkit"
  ],
  authors: [{ name: "SmartToolkit Team", url: "https://smarttoolkit.online" }],
  creator: "SmartToolkit",
  publisher: "SmartToolkit.online",
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
        url: "https://smarttoolkit.online/logo.webp",
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
    images: ["https://smarttoolkit.online/logo.webp"],
  },
  metadataBase: new URL("https://smarttoolkit.online"),
  category: "utilities",
};


// Root layout component
export default function RootLayout({ children }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SmartToolkit",
    "url": "https://smarttoolkit.online",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description":
      "SmartToolkit.online provides free online software utilities and tools for file conversions, optimizations, and productivity.",
    "creator": {
      "@type": "Organization",
      "name": "SmartToolkit",
      "url": "https://smarttoolkit.online",
      "logo": {
        "@type": "ImageObject",
        "url": "https://smarttoolkit.online/logo.webp" // replace with your real logo
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://smarttoolkit.online/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
