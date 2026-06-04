import type { MetadataRoute } from 'next';
import { siteConfig } from '@/shared/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep auth-gated / private areas out of the index.
      disallow: [
        '/admin/',
        '/mentor/',
        '/dashboard',
        '/profile',
        '/chat',
        '/gamification/',
        '/my-courses',
        '/waiting-verification',
        '/order/success',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
