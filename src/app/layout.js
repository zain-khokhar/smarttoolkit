import "./globals.css";
import { NavBar } from "../../NavBar";
import Script from "next/script";

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

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-FYJZQ0RSVB"
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FYJZQ0RSVB');
        `,
        }}
      />
      <body className="antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
