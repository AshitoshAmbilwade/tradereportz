import { authSeo } from "@/lib/seo";

export default function Head() {
  return (
    <>
      <title>{authSeo.signup.title}</title>
      <meta name="description" content={authSeo.signup.description} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={authSeo.signup.url} />
    </>
  );
}
