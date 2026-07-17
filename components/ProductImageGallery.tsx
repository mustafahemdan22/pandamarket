'use client';

import Image from 'next/image';
import { useState } from 'react';
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState<Set<number>>(new Set());

  const allImages = [mainImagePublicId, ...galleryImagePublicIds];
  const currentPublicId = allImages[selectedIndex];

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

  return (
    <div className={`product-image-gallery ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {!imageError.has(selectedIndex) ? (
          <Image
            src={getImageUrls(currentPublicId, mainTransformations).primary}
            alt={`${alt} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={selectedIndex === 0}
            onError={() => setImageError((prev) => new Set(prev).add(selectedIndex))}
          />
        ) : (
          <Image
            src={getImageUrls(currentPublicId, mainTransformations).fallback}
            alt={`${alt} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={selectedIndex === 0}
          />
        )}

        {/* Gallery Indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex
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
      {allImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((publicId, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? 'border-green-500 shadow-lg shadow-green-500/25'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === selectedIndex ? 'true' : 'false'}
            >
              {!imageError.has(index) ? (
                <Image
                  src={getImageUrls(publicId, thumbTransformations).primary}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <Image
                  src={getImageUrls(publicId, thumbTransformations).fallback}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
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
  const [imageError, setImageError] = useState(false);

  if (!imagePublicId) {
    const urls = buildImageUrl('', transformations);
    return (
      <Image
        src={urls.fallback}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  if (imageError) {
    const urls = buildImageUrl(imagePublicId, transformations);
    return (
      <Image
        src={urls.fallback}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={buildImageUrl(imagePublicId, transformations).primary}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setImageError(true)}
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
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    const urls = buildImageUrl(imagePublicId, {
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
    return (
      <Image
        src={urls.fallback}
        alt={alt}
        fill
        className={`object-cover group-hover:scale-110 transition-transform duration-500 ${className}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={buildImageUrl(imagePublicId, {
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
      }).primary}
      alt={alt}
      fill
      className={`object-cover group-hover:scale-110 transition-transform duration-500 ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={priority}
      onError={() => setImageError(true)}
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
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    const urls = buildImageUrl(imagePublicId, {
      width: 1920,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
      gravity: 'center',
    });
    return (
      <Image
        src={urls.fallback}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        priority
        sizes="100vw"
      />
    );
  }

  return (
    <Image
      src={buildImageUrl(imagePublicId, {
        width: 1920,
        height: 600,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
        gravity: 'center',
      }).primary}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      priority
      sizes="100vw"
      onError={() => setImageError(true)}
    />
  );
}