import { siteName } from "@/lib/seo";

export default function Head() {
  return (
    <>
      <meta name="application-name" content={siteName} />
      <meta name="theme-color" content="#0f172a" />
      <meta name="mobile-web-app-capable" content="yes" />
    </>
  );
}
