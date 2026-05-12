import { buildAuthPageSeoMetadata } from "@/lib/aiSeo";

const seo = buildAuthPageSeoMetadata("signup");

export default function Head() {
  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={seo.url} />
    </>
  );
}
