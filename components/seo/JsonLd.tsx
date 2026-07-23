import React from 'react';

export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandamarket.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    name: 'PandaMarket',
    alternateName: 'باندا ماركت',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/hero-banner.jpg`,
    description: 'Fresh groceries, high-quality Egyptian household staples, pantry essentials, and daily items delivered to your doorstep.',
    telephone: '+201000000000',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '90th Street, Fifth Settlement',
      addressLocality: 'Cairo',
      addressRegion: 'Cairo Governorate',
      postalCode: '11835',
      addressCountry: 'EG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.0276,
      longitude: 31.4913,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '23:59',
      },
    ],
    sameAs: [
      'https://facebook.com/pandamarket',
      'https://instagram.com/pandamarket',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandamarket.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PandaMarket',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/categories?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string[];
  price: number;
  currency?: string;
  sku?: string;
  brand?: string;
  inStock?: boolean;
  ratingValue?: number;
  reviewCount?: number;
  url: string;
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = 'EGP',
  sku,
  brand,
  inStock = true,
  ratingValue = 4.8,
  reviewCount = 120,
  url,
}: ProductJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku: sku || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    brand: {
      '@type': 'Brand',
      name: brand || 'PandaMarket',
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'PandaMarket',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
