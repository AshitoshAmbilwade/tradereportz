import {
  homepageSeo,
  seoDefaults,
  getSoftwareApplicationSchema,
} from "@/lib/seo";

export default function Head() {
  return (
    <>
      <title>{homepageSeo.title}</title>
      <meta name="description" content={homepageSeo.description} />
      <meta name="keywords" content={homepageSeo.keywords.join(", ")} />

      <meta property="og:title" content={homepageSeo.title} />
      <meta property="og:description" content={homepageSeo.description} />
      <meta property="og:url" content={homepageSeo.url} />
      <meta property="og:site_name" content={seoDefaults.siteName} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={seoDefaults.twitterHandle} />
      <meta name="twitter:title" content={homepageSeo.title} />
      <meta name="twitter:description" content={homepageSeo.description} />

      <link rel="canonical" href={homepageSeo.url} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSoftwareApplicationSchema()),
        }}
      />
    </>
  );
}
