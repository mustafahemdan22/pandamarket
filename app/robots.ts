import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandamarket.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/checkout',
          '/cart',
          '/login',
          '/signup',
          '/orders/*',
          '/*?*sort=',
          '/*?*filter=',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/admin/', '/api/', '/checkout'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
