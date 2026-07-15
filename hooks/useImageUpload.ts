'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UploadOptions {
  onSuccess?: (data: { publicIds: string[]; mainImagePublicId: string; galleryImagePublicIds: string[] }) => void;
  onError?: (error: Error) => void;
}

export function useImageUpload(options: UploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(
    async (
      files: File[],
      categorySlug: string,
      productSlug: string,
      type: 'product' | 'category' = 'product'
    ) => {
      if (!files.length) throw new Error('No files provided');
      if (type === 'product' && (files.length < 3 || files.length > 5)) {
        throw new Error('Products must have 3-5 images');
      }

      setIsUploading(true);
      setProgress(0);

      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      formData.append('categorySlug', categorySlug);
      formData.append('productSlug', productSlug);
      formData.append('type', type);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((p) => Math.min(p + 10, 90));
        }, 200);

        const response = await fetch('/api/cloudinary/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);
        setProgress(100);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        options.onSuccess?.(data);
        return data;
      } catch (error) {
        options.onError?.(error as Error);
        throw error;
      } finally {
        setIsUploading(false);
        setTimeout(() => setProgress(0), 500);
      }
    },
    [options]
  );

  return { upload, isUploading, progress };
}

export function useImageDelete() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteImages = useCallback(
    async (publicIds: string[]) => {
      if (!publicIds.length) return;

      setIsDeleting(true);
      try {
        const response = await fetch(
          `/api/cloudinary/upload?publicIds=${publicIds.join(',')}`,
          { method: 'DELETE' }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Delete failed');
        }

        return true;
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  return { deleteImages, isDeleting };
}