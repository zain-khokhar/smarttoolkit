import "./globals.css";
import { NavBar } from "../../NavBar";




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
    // "potentialAction": {
    //   "@type": "SearchAction",
    //   "target": "https://smarttoolkit.online/search?q={search_term_string}",
    //   "query-input": "required name=search_term_string"
    // }
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
