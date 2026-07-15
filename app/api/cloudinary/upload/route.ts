import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const runtime = 'nodejs';
export const maxDuration = 60;

async function uploadToCloudinary(
  buffer: Buffer,
  publicId: string,
  folder: string
): Promise<{ public_id: string; secure_url: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId,
          folder,
          resource_type: 'image',
          transformation: [
            { width: 2000, height: 2000, crop: 'limit' },
            { quality: 'auto:best' },
            { format: 'auto' },
          ],
          overwrite: true,
          invalidate: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({ public_id: result!.public_id, secure_url: result!.secure_url });
        }
      )
      .end(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const categorySlug = formData.get('categorySlug') as string;
    const productSlug = formData.get('productSlug') as string;
    const type = formData.get('type') as string;
    const replaceIndex = formData.get('replaceIndex') as string; // e.g. "3"
    const productId = formData.get('productId') as string; // Optional: to sync database

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    const buffers = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return Buffer.from(arrayBuffer);
      })
    );

    if (type === 'category') {
      if (files.length > 1) {
        return NextResponse.json(
          { error: 'Category only accepts one image' },
          { status: 400 }
        );
      }
      const publicId = `pandamarket/categories/${categorySlug}/banner`;
      const result = await uploadToCloudinary(buffers[0], publicId, `pandamarket/categories/${categorySlug}`);
      return NextResponse.json({ success: true, publicId: result.public_id });
    }

    if (!productSlug) {
      return NextResponse.json(
        { error: 'Product slug is required for product images' },
        { status: 400 }
      );
    }

    // Single Image Replacement Mode
    if (replaceIndex) {
      const indexNum = parseInt(replaceIndex, 10);
      if (isNaN(indexNum) || indexNum < 1 || indexNum > 10) {
        return NextResponse.json(
          { error: 'Invalid replaceIndex value (must be 1-10)' },
          { status: 400 }
        );
      }

      if (files.length !== 1) {
        return NextResponse.json(
          { error: 'Single image replacement accepts exactly one image' },
          { status: 400 }
        );
      }

      const publicId = `pandamarket/categories/${categorySlug}/products/${productSlug}/${indexNum}`;
      const folder = `pandamarket/categories/${categorySlug}/products/${productSlug}`;
      const result = await uploadToCloudinary(buffers[0], publicId, folder);

      // If productId is provided, update Convex database to ensure the ID is in the list
      if (productId) {
        const product = await convex.query(api.products.getProductById, { id: productId as Id<'products'> });
        if (product) {
          const currentIds = product.imagePublicIds || [];
          if (!currentIds.includes(result.public_id)) {
            // Put it at the correct index (1-based map to 0-based array indexNum - 1)
            const updatedIds = [...currentIds];
            updatedIds[indexNum - 1] = result.public_id;
            
            // Clean up any empty slots with placeholders or filters
            const finalIds = Array.from(
              { length: Math.max(updatedIds.length, indexNum) },
              (_, i) => updatedIds[i] || `pandamarket/categories/${categorySlug}/products/${productSlug}/${i + 1}`
            );

            await convex.mutation(api.products.updateProduct, {
              id: productId as Id<'products'>,
              imagePublicId: finalIds[0] || result.public_id,
              imagePublicIds: finalIds,
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        publicId: result.public_id,
      });
    }

    // Bulk Image Upload Mode (3-5 images)
    if (files.length < 3 || files.length > 5) {
      return NextResponse.json(
        { error: 'Bulk uploads must have between 3 and 5 images' },
        { status: 400 }
      );
    }

    const publicIds: string[] = [];
    const folder = `pandamarket/categories/${categorySlug}/products/${productSlug}`;

    for (let i = 0; i < files.length; i++) {
      const publicId = `pandamarket/categories/${categorySlug}/products/${productSlug}/${i + 1}`;
      const result = await uploadToCloudinary(buffers[i], publicId, folder);
      publicIds.push(result.public_id);
    }

    // Update database if productId is provided
    if (productId) {
      await convex.mutation(api.products.updateProduct, {
        id: productId as Id<'products'>,
        imagePublicId: publicIds[0],
        imagePublicIds: publicIds,
      });
    }

    return NextResponse.json({
      success: true,
      publicIds,
      mainImagePublicId: publicIds[0],
      galleryImagePublicIds: publicIds,
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const msg = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicIds = searchParams.get('publicIds')?.split(',') || [];
    const categorySlug = searchParams.get('categorySlug');
    const productSlug = searchParams.get('productSlug');
    const productId = searchParams.get('productId');
    const publicIdToDelete = searchParams.get('publicIdToDelete');

    // 1. Delete single image from Cloudinary & Convex
    if (productId && publicIdToDelete) {
      await cloudinary.uploader.destroy(publicIdToDelete, { invalidate: true });
      
      const product = await convex.query(api.products.getProductById, { id: productId as Id<'products'> });
      if (product) {
        const remainingIds = (product.imagePublicIds || []).filter(id => id !== publicIdToDelete);
        
        await convex.mutation(api.products.updateProduct, {
          id: productId as Id<'products'>,
          imagePublicId: remainingIds[0] || '',
          imagePublicIds: remainingIds,
        });
      }
      return NextResponse.json({ success: true });
    }

    // 2. Delete selected public IDs
    if (publicIds.length > 0) {
      for (const publicId of publicIds) {
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
      }

      // If productId is provided, update Convex
      if (productId) {
        const product = await convex.query(api.products.getProductById, { id: productId as Id<'products'> });
        if (product) {
          const remainingIds = (product.imagePublicIds || []).filter(id => !publicIds.includes(id));
          await convex.mutation(api.products.updateProduct, {
            id: productId as Id<'products'>,
            imagePublicId: remainingIds[0] || '',
            imagePublicIds: remainingIds,
          });
        }
      }
      return NextResponse.json({ success: true });
    }

    // 3. Delete whole product directory prefix
    if (categorySlug && productSlug) {
      const prefix = `pandamarket/categories/${categorySlug}/products/${productSlug}/`;
      
      // List all resources under the prefix and delete them
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix,
      });
      const ids = result.resources.map((r: { public_id: string }) => r.public_id);
      if (ids.length > 0) {
        await cloudinary.api.delete_resources(ids);
      }

      // If productId is provided, clear Convex image references
      if (productId) {
        await convex.mutation(api.products.updateProduct, {
          id: productId as Id<'products'>,
          imagePublicId: '',
          imagePublicIds: [],
        });
      }

      return NextResponse.json({ success: true });
    }

    // 4. Delete category banner
    if (categorySlug && !productSlug) {
      const publicId = `pandamarket/categories/${categorySlug}/banner`;
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'No valid delete parameters provided' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error('Delete error:', error);
    const msg = error instanceof Error ? error.message : 'Delete failed';
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}