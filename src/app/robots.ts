export default function Robots() {
  const content = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /trades
Disallow: /reports
Disallow: /settings
Disallow: /analytics
Disallow: /login
Disallow: /signup
Sitemap: https://tradereportz.in/sitemap.xml
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
