import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { requirePermission } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const runtime = 'nodejs';
export const maxDuration = 120; // Allow up to 2 minutes for generating multiple images

function buildPromptForView(
  viewName: string,
  nameEn: string,
  descriptionEn: string,
  brand: string,
  unit: string
): string {
  const basePrompt = `A premium, ultra-realistic commercial eCommerce catalog photo of a product package. Product details: ${brand} - ${nameEn} (${descriptionEn || nameEn}, unit/volume: ${unit}). The packaging design is generic and original (no copyrighted logos or real-world trademarks). The presentation is clean, minimalist, and professional supermarket catalog quality. Captured in a professional studio with 8k resolution, crisp focus, studio lighting, soft natural shadows, and a pure white background (#FFFFFF).`;

  switch (viewName) {
    case 'front':
      return `${basePrompt} Composition: Centered, straight front-facing view of the product package.`;
    case 'angle':
      return `${basePrompt} Composition: Centered, 45-degree perspective angle view showing the front and side profile of the product package.`;
    case 'side':
      return `${basePrompt} Composition: Centered, side profile view of the package showcasing package depth and detail.`;
    case 'back':
      return `${basePrompt} Composition: Centered, back view of the package showing the back label and clean design.`;
    case 'detail':
      return `A premium, ultra-realistic commercial photography close-up macro shot of product packaging details for ${brand} ${nameEn}. Focus is on the high-quality packaging material, premium texture, and clean typography. Professional studio lighting, soft natural shadows, pure white background (#FFFFFF), 8k resolution.`;
    default:
      return basePrompt;
  }
}

async function generateImageBuffer(prompt: string, seed: number): Promise<Buffer> {
  const replicateToken = process.env.REPLICATE_API_TOKEN;
  const openAIKey = process.env.OPENAI_API_KEY;

  if (replicateToken) {
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "05359a647d7a691e704177d611ee6bde4e7b419a5c4d0a3d460dec6987f2fa8a",
          input: {
            prompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: 90,
          }
        })
      });

      if (response.ok) {
        let prediction = await response.json();
        const predictionId = prediction.id;
        let status = prediction.status;
        let attempts = 0;
        
        while (status !== 'succeeded' && status !== 'failed' && status !== 'canceled' && attempts < 30) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
            headers: {
              'Authorization': `Token ${replicateToken}`,
            }
          });
          if (pollResponse.ok) {
            prediction = await pollResponse.json();
            status = prediction.status;
          }
          attempts++;
        }

        if (status === 'succeeded') {
          const imageUrl = prediction.output[0];
          const imgRes = await fetch(imageUrl);
          if (imgRes.ok) {
            return Buffer.from(await imgRes.arrayBuffer());
          }
        }
      }
    } catch (e) {
      console.error("Replicate failed, falling back", e);
    }
  }

  if (openAIKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'b64_json',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const b64Data = data.data[0].b64_json;
        return Buffer.from(b64Data, 'base64');
      }
    } catch (e) {
      console.error("OpenAI failed, falling back", e);
    }
  }

  // Fallback to Pollinations AI (Flux)
  const encodedPrompt = encodeURIComponent(prompt);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=2000&height=2000&nologo=true&seed=${seed}`;
  console.log(`Pollinations URL: ${pollinationsUrl}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  const res = await fetch(pollinationsUrl, { 
    signal: controller.signal,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  clearTimeout(timeoutId);
  console.log(`Pollinations response: ${res.status} ${res.statusText}`);
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Pollinations error: ${errorText}`);
    throw new Error(`AI generation failed (Pollinations: ${res.status} ${res.statusText})`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  console.log(`Pollinations image size: ${buffer.length} bytes`);
  if (buffer.length < 1000) {
    const text = buffer.toString('utf8').substring(0, 200);
    console.error(`Pollinations returned small response (likely error): ${text}`);
    throw new Error(`AI generation failed - invalid image data`);
  }
  return buffer;
}

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
    await requirePermission('products');
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      productId,
      categorySlug,
      productSlug,
      nameEn,
      descriptionEn = '',
      brand = 'Generic',
      unit = '1 unit',
      count = 4, // default to 4 views: front, angle, side, detail
    } = body;

    if (!categorySlug || !productSlug || !nameEn) {
      return NextResponse.json(
        { error: 'categorySlug, productSlug, and nameEn are required' },
        { status: 400 }
      );
    }

    if (count < 3 || count > 5) {
      return NextResponse.json(
        { error: 'Image count must be between 3 and 5' },
        { status: 400 }
      );
    }

    const views = ['front', 'angle', 'side', 'back', 'detail'].slice(0, count);
    const publicIds: string[] = [];
    
    // Seed using a hash of productSlug so the same product gets a reproducible initial seed
    const seedBase = Math.abs(
      productSlug.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    ) || 12345;

    console.log(`Generating ${count} AI product images for ${productSlug}...`);

    for (let i = 0; i < views.length; i++) {
      const view = views[i];
      const prompt = buildPromptForView(view, nameEn, descriptionEn, brand, unit);
      
      const seed = seedBase + i * 100;
      const buffer = await generateImageBuffer(prompt, seed);
      
      const publicId = `pandamarket/categories/${categorySlug}/products/${productSlug}/${i + 1}`;
      const folder = `pandamarket/categories/${categorySlug}/products/${productSlug}`;
      
      const uploadResult = await uploadToCloudinary(buffer, publicId, folder);
      publicIds.push(uploadResult.public_id);
      
      console.log(`Generated and uploaded view ${view} for ${productSlug}. Public ID: ${uploadResult.public_id}`);
    }

    // If a productId is provided, update the product in Convex database
    if (productId) {
      await convex.mutation(api.products.updateProduct, {
        id: productId,
        imagePublicId: publicIds[0],
        imagePublicIds: publicIds,
      });
      console.log(`Updated product ${productId} in Convex with generated image public IDs.`);
    }

    return NextResponse.json({
      success: true,
      publicIds,
      mainImagePublicId: publicIds[0],
      galleryImagePublicIds: publicIds,
    });
  } catch (error: unknown) {
    console.error('Error generating or uploading AI product images:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate product images';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
