export interface CloudinaryTransformations {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop' | 'pad';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png' | 'gif';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
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

export const DEFAULT_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 800,
  height: 800,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
  gravity: 'auto',
};

// Optimized presets for frontend components
export const THUMBNAIL_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
};

export const PRODUCT_CARD_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 400,
  height: 400,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
};

export const PRODUCT_DETAIL_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 1000,
  height: 1000,
  crop: 'pad',
  quality: 'auto',
  format: 'auto',
};

export const SEARCH_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 150,
  height: 150,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
};

export const WISHLIST_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 250,
  height: 250,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
};

export const CART_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
};

export const CHECKOUT_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
};

export const MOBILE_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 600,
  height: 600,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
};

export const DESKTOP_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 1200,
  height: 1200,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
};

export const CATEGORY_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 600,
  height: 400,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
  gravity: 'auto',
};

export const HERO_TRANSFORMATIONS: CloudinaryTransformations = {
  width: 1920,
  height: 600,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
  gravity: 'center',
};

export function buildImageUrl(
  publicId: string,
  transformations: CloudinaryTransformations = DEFAULT_TRANSFORMATIONS
): ImageUrlResult {
  if (!publicId) {
    const fallback = getPlaceholderUrl('', transformations.width || 400, transformations.height || 400);
    return { primary: '', fallback };
  }

  // If it's already a full URL, return as-is (backward compatibility)
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return { primary: publicId, fallback: publicId };
  }

  // If it's a local path (starts with /), return as-is for Next.js Image
  if (publicId.startsWith('/')) {
    return { primary: publicId, fallback: publicId };
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfq1xxerr';
  const params: string[] = [];

  if (transformations.width) params.push(`w_${transformations.width}`);
  if (transformations.height) params.push(`h_${transformations.height}`);
  if (transformations.crop) params.push(`c_${transformations.crop}`);
  if (transformations.quality) params.push(`q_${transformations.quality}`);
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

  const primary = `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
  const fallback = getPlaceholderUrl(publicId, transformations.width || 400, transformations.height || 400);

  return { primary, fallback };
}

function getPlaceholderUrl(publicId: string, width: number, height: number): string {
  const seed = encodeURIComponent(publicId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 50);
  return `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`;
}

export function buildSrcSet(
  publicId: string,
  widths: number[] = [320, 640, 800, 1200, 1600],
  baseTransformations: CloudinaryTransformations = DEFAULT_TRANSFORMATIONS
): string {
  return widths
    .map((w) => {
      const url = buildImageUrl(publicId, { ...baseTransformations, width: w });
      return `${url.primary} ${w}w`;
    })
    .join(', ');
}

export function generatePublicId(
  categorySlug: string,
  productSlug: string,
  index: number
): string {
  const sanitizedCategory = categorySlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const sanitizedProduct = productSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `pandamarket/categories/${sanitizedCategory}/products/${sanitizedProduct}/${index}`;
}

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

export function validateImageCount(count: number): boolean {
  return count >= 3 && count <= 5;
}

export function getCloudinaryUrl(publicId: string, options?: CloudinaryTransformations): ImageUrlResult {
  return buildImageUrl(publicId, options);
}