import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: APP_CONFIG.baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
