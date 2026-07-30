// lib/imageConfig.ts
// Single source of truth for all image configuration in the application.
// Every component MUST consume images from this module. No hardcoded image
// URLs or paths should exist anywhere else in the codebase.

// ─── Cloudinary Configuration ───────────────────────────────────────────────

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfq1xxerr';

export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// ─── Fallback ───────────────────────────────────────────────────────────────

export const FALLBACK_IMAGE_PATH = '/images/image-missing.svg';

// ─── Type Definitions ───────────────────────────────────────────────────────

export type CropMode = 'fill' | 'scale' | 'fit' | 'thumb' | 'crop' | 'pad';
export type QualityOption = 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | number;
export type FormatOption = 'auto' | 'webp' | 'avif' | 'jpg' | 'png' | 'gif';
export type GravityOption = 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';

export interface ImageTransformations {
  width?: number;
  height?: number;
  crop?: CropMode;
  quality?: QualityOption;
  format?: FormatOption;
  gravity?: GravityOption;
  effect?: string;
  background?: string;
  border?: string;
  overlay?: string;
  underlay?: string;
  angle?: number;
  opacity?: number;
  radius?: number | 'max';
}

export interface ImageUrlResult {
  primary: string;
  fallback: string;
}

// ─── Transformation Presets ─────────────────────────────────────────────────

export const PRESETS = {
  thumbnail: {
    width: 200,
    height: 200,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  productCard: {
    width: 400,
    height: 400,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  productDetail: {
    width: 1000,
    height: 1000,
    crop: 'pad' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  search: {
    width: 150,
    height: 150,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  wishlist: {
    width: 250,
    height: 250,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  cart: {
    width: 200,
    height: 200,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  checkout: {
    width: 200,
    height: 200,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  mobile: {
    width: 600,
    height: 600,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  desktop: {
    width: 1200,
    height: 1200,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  category: {
    width: 600,
    height: 400,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
    gravity: 'auto' as GravityOption,
  },
  hero: {
    width: 1920,
    height: 600,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
    gravity: 'center' as GravityOption,
  },
  galleryMain: {
    width: 800,
    height: 800,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  galleryThumb: {
    width: 100,
    height: 100,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
  orderItem: {
    width: 200,
    height: 200,
    crop: 'fill' as CropMode,
    quality: 'auto' as QualityOption,
    format: 'auto' as FormatOption,
  },
} as const;

export type PresetName = keyof typeof PRESETS;

// ─── Category Image Mapping ─────────────────────────────────────────────────
// Cloudinary public IDs for category banner images.
// Upload category banners to Cloudinary and update these IDs.

export const CATEGORY_IMAGES: Record<string, string> = {
  produce: 'pandamarket/categories/produce/banner',
  dairy: 'pandamarket/categories/dairy/banner',
  meat: 'pandamarket/categories/meat/banner',
  pantry: 'pandamarket/categories/pantry/banner',
  condiments: 'pandamarket/categories/condiments/banner',
  cleaning: 'pandamarket/categories/cleaning/banner',
  frozen: 'pandamarket/categories/frozen/banner',
  snacks: 'pandamarket/categories/snacks/banner',
  beverages: 'pandamarket/categories/beverages/banner',
  'personal-care': 'pandamarket/categories/personal-care/banner',
  'baby-care': 'pandamarket/categories/baby-care/banner',
  bakery: 'pandamarket/categories/bakery/banner',
};

// ─── Hero Image ─────────────────────────────────────────────────────────────

export const HERO_IMAGE_PUBLIC_ID = 'pandamarket/hero/panda-mascot';

// ─── Content Images (About, Blog) ───────────────────────────────────────────

export const ABOUT_PAGE_IMAGE = 'pandamarket/content/about-panda';

export const BLOG_IMAGES = {
  smartShopping: 'pandamarket/content/blog-smart-shopping',
  freshProduce: 'pandamarket/content/blog-fresh-produce',
  foodStorage: 'pandamarket/content/blog-food-storage',
} as const;

// ─── Core URL Builder ───────────────────────────────────────────────────────

function buildCloudinaryUrl(
  publicId: string,
  transformations: ImageTransformations = PRESETS.productCard
): ImageUrlResult {
  if (!publicId) {
    return { primary: FALLBACK_IMAGE_PATH, fallback: FALLBACK_IMAGE_PATH };
  }

  // Full URL — return as-is
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return { primary: publicId, fallback: publicId };
  }

  // Strip leading slash if present to ensure proper Cloudinary public ID
  if (publicId.startsWith('/')) {
    publicId = publicId.substring(1);
  }

  // Build Cloudinary URL from public ID + transformations
  const params: string[] = [];

  if (transformations.width) params.push(`w_${transformations.width}`);
  if (transformations.height) params.push(`h_${transformations.height}`);
  if (transformations.crop) params.push(`c_${transformations.crop}`);
  if (transformations.quality !== undefined) params.push(`q_${transformations.quality}`);
  if (transformations.format) params.push(`f_${transformations.format}`);
  if (transformations.gravity) params.push(`g_${transformations.gravity}`);
  if (transformations.effect) params.push(`e_${transformations.effect}`);
  if (transformations.background) params.push(`b_${transformations.background}`);
  if (transformations.border) params.push(`bo_${transformations.border}`);
  if (transformations.overlay) params.push(`l_${transformations.overlay}`);
  if (transformations.underlay) params.push(`u_${transformations.underlay}`);
  if (transformations.angle) params.push(`a_${transformations.angle}`);
  if (transformations.opacity !== undefined) params.push(`o_${transformations.opacity}`);
  if (transformations.radius !== undefined) params.push(`r_${transformations.radius}`);

  const transformationString = params.join(',');
  const primary = `${CLOUDINARY_BASE_URL}/${transformationString}/${publicId}`;

  return { primary, fallback: FALLBACK_IMAGE_PATH };
}

// ─── Public Helper Functions ────────────────────────────────────────────────

/**
 * Get an image URL using a named preset.
 */
export function getImageUrl(
  publicId: string | undefined | null,
  preset: PresetName = 'productCard'
): ImageUrlResult {
  return buildCloudinaryUrl(publicId || '', PRESETS[preset]);
}

/**
 * Get an image URL with custom transformations (overrides preset defaults).
 */
export function getImageUrlCustom(
  publicId: string | undefined | null,
  transformations: ImageTransformations
): ImageUrlResult {
  return buildCloudinaryUrl(publicId || '', transformations);
}

/**
 * Generate a responsive srcSet string for an image.
 */
export function getResponsiveSrcSet(
  publicId: string,
  preset: PresetName = 'productCard',
  widths: number[] = [320, 640, 800, 1200, 1600]
): string {
  return widths
    .map((w) => {
      const result = buildCloudinaryUrl(publicId, { ...PRESETS[preset], width: w });
      return `${result.primary} ${w}w`;
    })
    .join(', ');
}

// ─── Context-Specific Shorthand Helpers ─────────────────────────────────────

/** Image for product cards (400x400 fill) */
export function getProductCardImage(publicId: string | undefined | null): ImageUrlResult {
  return getImageUrl(publicId, 'productCard');
}

/** Image for product detail page (1000x1000 pad) */
export function getProductDetailImage(publicId: string | undefined | null): ImageUrlResult {
  return getImageUrl(publicId, 'productDetail');
}

/** Image for cart items (200x200 fill) */
export function getCartImage(publicId: string | undefined | null): ImageUrlResult {
  return getImageUrl(publicId, 'cart');
}

/** Image for order history items (200x200 fill) */
export function getOrderImage(publicId: string | undefined | null): ImageUrlResult {
  return getImageUrl(publicId, 'orderItem');
}

/** Image for wishlist items (250x250 fill) */
export function getWishlistImage(publicId: string | undefined | null): ImageUrlResult {
  return getImageUrl(publicId, 'wishlist');
}

/** Image for search results (150x150 fill) */
export function getSearchImage(publicId: string | undefined | null): ImageUrlResult {
  return getImageUrl(publicId, 'search');
}

/** Image for category cards (600x400 fill) */
export function getCategoryImage(categorySlug: string): ImageUrlResult {
  const publicId = CATEGORY_IMAGES[categorySlug];
  return getImageUrl(publicId, 'category');
}

/** Image for hero/banner sections (1920x600 fill center) */
export function getHeroImage(): ImageUrlResult {
  return getImageUrl(HERO_IMAGE_PUBLIC_ID, 'hero');
}

/** Image for gallery thumbnails (100x100 fill) */
export function getGalleryThumbImage(publicId: string): ImageUrlResult {
  return getImageUrl(publicId, 'galleryThumb');
}

/** Image for gallery main view (800x800 fill) */
export function getGalleryMainImage(publicId: string): ImageUrlResult {
  return getImageUrl(publicId, 'galleryMain');
}

// ─── Validation & Utility ───────────────────────────────────────────────────

/**
 * Validate that a product has the required number of images (3-5).
 */
export function validateImageCount(count: number): boolean {
  return count >= 3 && count <= 5;
}

/**
 * Generate a standardized Cloudinary public ID from category and product slugs.
 */
export function generatePublicId(
  categorySlug: string,
  productSlug: string,
  index: number
): string {
  const sanitizedCategory = categorySlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const sanitizedProduct = productSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `pandamarket/categories/${sanitizedCategory}/products/${sanitizedProduct}/${index}`;
}

/**
 * Parse a Cloudinary public ID back into its component parts.
 */
export function parsePublicId(publicId: string): {
  categorySlug: string;
  productSlug: string;
  index: number;
} | null {
  const match = publicId.match(
    /^pandamarket\/categories\/([^/]+)\/products\/([^/]+)\/(\d+)$/
  );
  if (!match) return null;

  return {
    categorySlug: match[1],
    productSlug: match[2],
    index: parseInt(match[3], 10),
  };
}
