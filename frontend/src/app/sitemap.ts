import type { MetadataRoute } from 'next';
import { siteConfig } from '@/shared/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/order`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/register`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/login`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];
}
