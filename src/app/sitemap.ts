import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://tradereportz.in/",
      lastModified: new Date(),
    },
    {
      url: "https://tradereportz.in/pricing",
      lastModified: new Date(),
    },
  ];
}
