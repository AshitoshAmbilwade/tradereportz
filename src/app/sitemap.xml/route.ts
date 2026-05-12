export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <url>\n` +
      `    <loc>https://tradereportz.in/</loc>\n` +
      `    <lastmod>${new Date().toISOString()}</lastmod>\n` +
      `  </url>\n` +
      `  <url>\n` +
      `    <loc>https://tradereportz.in/pricing</loc>\n` +
      `    <lastmod>${new Date().toISOString()}</lastmod>\n` +
      `  </url>\n` +
      `</urlset>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    }
  );
}
