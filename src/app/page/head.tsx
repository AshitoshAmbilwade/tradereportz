import { buildHomePageSeoMetadata } from "@/lib/aiSeo";

const seo = buildHomePageSeoMetadata();

export default function Head() {
  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(", ")} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:site_name" content="TradeReportz" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@TradeReportz" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <link rel="canonical" href={seo.url} />
    </>
  );
}
