import {
  pricingSeo,
  seoDefaults,
  getPricingFAQSchema,
} from "@/lib/seo";

export default function Head() {
  return (
    <>
      <title>{pricingSeo.title}</title>
      <meta name="description" content={pricingSeo.description} />
      <meta name="keywords" content={pricingSeo.keywords.join(", ")} />
      <meta property="og:title" content={pricingSeo.title} />
      <meta property="og:description" content={pricingSeo.description} />
      <meta property="og:url" content={pricingSeo.url} />
      <meta property="og:site_name" content={seoDefaults.siteName} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={seoDefaults.twitterHandle} />
      <meta name="twitter:title" content={pricingSeo.title} />
      <meta name="twitter:description" content={pricingSeo.description} />
      <link rel="canonical" href={pricingSeo.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPricingFAQSchema()),
        }}
      />
    </>
  );
}
