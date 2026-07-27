'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { buildImageUrl, CloudinaryTransformations, ImageUrlResult } from '../lib/cloudinary';

interface ProductImageGalleryProps {
  mainImagePublicId: string;
  galleryImagePublicIds: string[];
  alt: string;
  className?: string;
}

export function ProductImageGallery({
  mainImagePublicId,
  galleryImagePublicIds,
  alt,
  className = '',
}: ProductImageGalleryProps) {
  const [imgSrcMap, setImgSrcMap] = useState<Record<number, string>>({});
  const fallbackSrc = '/images/image-missing.svg';

  const allImages = [mainImagePublicId, ...galleryImagePublicIds];

  const mainTransformations: CloudinaryTransformations = {
    width: 800,
    height: 800,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  };

  const thumbTransformations: CloudinaryTransformations = {
    width: 100,
    height: 100,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  };

  const getImageUrls = (publicId: string, transformations: CloudinaryTransformations): ImageUrlResult => {
    return buildImageUrl(publicId, transformations);
  };

  const validImages = allImages.filter((id): id is string => typeof id === 'string');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeIndex = Math.min(selectedIndex, validImages.length - 1);
  const currentPublicId = validImages[safeIndex] || '';

  const handleImageError = useCallback((index: number) => {
    setImgSrcMap((prev) => ({ ...prev, [index]: fallbackSrc }));
  }, []);

  return (
    <div className={`product-image-gallery ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <Image
          key={`main-${safeIndex}-${imgSrcMap[safeIndex] || 'primary'}`}
          src={imgSrcMap[safeIndex] || getImageUrls(currentPublicId, mainTransformations).primary}
          alt={`${alt} - Image ${safeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={safeIndex === 0}
          onError={() => handleImageError(safeIndex)}
        />

        {/* Gallery Indicators */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === safeIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {validImages.map((publicId, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === safeIndex
                  ? 'border-green-500 shadow-lg shadow-green-500/25'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === safeIndex ? 'true' : 'false'}
            >
              <Image
                key={`thumb-${index}-${imgSrcMap[index] || 'primary'}`}
                src={imgSrcMap[index] || getImageUrls(publicId, thumbTransformations).primary}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== CATEGORY IMAGE COMPONENT =====

interface CategoryImageProps {
  imagePublicId: string | undefined;
  alt: string;
  className?: string;
  transformations?: CloudinaryTransformations;
}

export function CategoryImage({
  imagePublicId,
  alt,
  className = '',
  transformations = { width: 600, height: 400, crop: 'fill', quality: 'auto', format: 'auto' },
}: CategoryImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() =>
    imagePublicId
      ? buildImageUrl(imagePublicId, transformations).primary
      : '/images/image-missing.svg'
  );

  return (
    <Image
      key={imgSrc}
      src={imgSrc}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setImgSrc('/images/image-missing.svg')}
    />
  );
}

// ===== PRODUCT CARD IMAGE =====

interface ProductCardImageProps {
  imagePublicId: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ProductCardImage({
  imagePublicId,
  alt,
  className = '',
  priority = false,
}: ProductCardImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() =>
    buildImageUrl(imagePublicId || '', {
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    }).primary
  );

  const fallbackSrc = '/images/image-missing.svg';

  const handleError = useCallback(() => {
    setImgSrc(fallbackSrc);
  }, []);

  return (
    <Image
      key={imgSrc}
      src={imgSrc}
      alt={alt}
      fill
      className={`object-cover group-hover:scale-110 transition-transform duration-500 ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={priority}
      onError={handleError}
    />
  );
}

// ===== HERO/BANNER IMAGE =====

interface HeroImageProps {
  imagePublicId: string;
  alt: string;
  className?: string;
}

export function HeroImage({
  imagePublicId,
  alt,
  className = '',
}: HeroImageProps) {
  const transformations = { width: 1920, height: 600, crop: 'fill' as const, quality: 'auto' as const, format: 'auto' as const, gravity: 'center' as const };
  const [imgSrc, setImgSrc] = useState<string>(() =>
    imagePublicId
      ? buildImageUrl(imagePublicId, transformations).primary
      : '/images/image-missing.svg'
  );

  return (
    <Image
      key={imgSrc}
      src={imgSrc}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      priority
      sizes="100vw"
      onError={() => setImgSrc('/images/image-missing.svg')}
    />
  );
}