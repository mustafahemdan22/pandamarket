// lib/cloudinary.ts
// DEPRECATED: This file is kept for backward compatibility during migration.
// All new code should import from '@/lib/imageConfig' instead.
// This file will be removed once all imports are migrated.

export type {
  ImageTransformations as CloudinaryTransformations,
  ImageUrlResult,
} from './imageConfig';

export {
  PRESETS,
  FALLBACK_IMAGE_PATH,
  CLOUDINARY_BASE_URL,
  CLOUDINARY_CLOUD_NAME,
  getImageUrl,
  getImageUrlCustom,
  getResponsiveSrcSet,
  getProductCardImage,
  getProductDetailImage,
  getCartImage,
  getOrderImage,
  getWishlistImage,
  getSearchImage,
  getCategoryImage,
  getHeroImage,
  getGalleryThumbImage,
  getGalleryMainImage,
  validateImageCount,
  generatePublicId,
  parsePublicId,
} from './imageConfig';

// Legacy alias — prefer getImageUrl() from imageConfig.ts
import { getImageUrl, type ImageTransformations, type ImageUrlResult } from './imageConfig';

export function buildImageUrl(
  publicId: string,
  transformations: ImageTransformations = {}
): ImageUrlResult {
  return getImageUrl(publicId, 'productCard');
}

// Legacy alias — prefer getResponsiveSrcSet() from imageConfig.ts
export function buildSrcSet(
  publicId: string,
  widths: number[] = [320, 640, 800, 1200, 1600],
  baseTransformations: ImageTransformations = {}
): string {
  const { getResponsiveSrcSet } = require('./imageConfig');
  return getResponsiveSrcSet(publicId, 'productCard', widths);
}

// Legacy alias — prefer getHeroImage() from imageConfig.ts
export function getCloudinaryUrl(
  publicId: string,
  options?: ImageTransformations
): ImageUrlResult {
  return getImageUrl(publicId, 'productCard');
}
