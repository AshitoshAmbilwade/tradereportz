import { authSeo } from "@/lib/seo";

export default function Head() {
  return (
    <>
      <title>{authSeo.login.title}</title>
      <meta name="description" content={authSeo.login.description} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={authSeo.login.url} />
    </>
  );
}
