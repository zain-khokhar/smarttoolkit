export async function GET() {
  const baseUrl = "https://smarttoolkit.online";

  const formats = [
    "png", "jpg", "avif", "jpeg", "webp",
    "ico", "bmp", "tiff", "tif", "gif", "svg",
  ];
  const validFormats = ["jpg", "jpeg", "png", "webp"];

  const now = new Date().toISOString();

  // 1. Static routes
  const urls = [
    { url: `${baseUrl}/`, lastmod: now, changefreq: "weekly", priority: 1.0 },
    // { url: `${baseUrl}/about`, lastmod: now, changefreq: "yearly", priority: 0.5 },
    // { url: `${baseUrl}/contact`, lastmod: now, changefreq: "yearly", priority: 0.5 },
    // { url: `${baseUrl}/tools`, lastmod: now, changefreq: "weekly", priority: 0.7 },
  ];

  // 2. Conversion routes
  for (let from of formats) {
    for (let to of formats) {
      if (from !== to) {
        urls.push({
          url: `${baseUrl}/${from}-to-${to}`,
          lastmod: now,
          changefreq: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  // 3. Compressor routes
  for (let format of validFormats) {
    urls.push({
      url: `${baseUrl}/tools/${format}`,
      lastmod: now,
      changefreq: "weekly",
      priority: 0.7,
    });
  }

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (u) => `
      <url>
        <loc>${u.url}</loc>
        <lastmod>${u.lastmod}</lastmod>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
