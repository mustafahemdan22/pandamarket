import type { Metadata, Viewport } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';
import { OrganizationJsonLd, WebSiteJsonLd } from '../components/seo/JsonLd';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['monospace'],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandamarket.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'PandaMarket | Premium Supermarket & Daily Grocery Delivery',
    template: '%s | PandaMarket Supermarket',
  },
  description: 'Shop fresh fruits, vegetables, dairy, pantry essentials, cleaning supplies, and beverages online with fast delivery in Egypt.',
  keywords: [
    'Supermarket',
    'Online Grocery Egypt',
    'PandaMarket',
    'Fresh Produce Delivery',
    'Dairy & Eggs',
    'Egyptian Groceries',
    'سوبرماركت',
    'بقالة اونلاين',
    'باندا ماركت',
  ],
  authors: [{ name: 'PandaMarket Team', url: baseUrl }],
  creator: 'PandaMarket',
  publisher: 'PandaMarket',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: './',
    languages: {
      'en-US': `${baseUrl}`,
      'ar-EG': `${baseUrl}/ar`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
    url: baseUrl,
    siteName: 'PandaMarket',
    title: 'PandaMarket | Premium Supermarket & Online Grocery Delivery',
    description: 'Order fresh groceries, organic produce, dairy, and household essentials online.',
    images: [
      {
        url: `${baseUrl}/images/hero-banner.jpg`,
        width: 1200,
        height: 630,
        alt: 'PandaMarket Supermarket Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PandaMarket | Online Grocery Delivery',
    description: 'Fresh groceries delivered fast in Egypt.',
    images: [`${baseUrl}/images/hero-banner.jpg`],
    creator: '@pandamarket',
  },
  appleWebApp: {
    capable: true,
    title: 'PandaMarket',
    statusBarStyle: 'black-translucent',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#16a34a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors duration-300`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}