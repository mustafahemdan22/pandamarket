import { NextResponse } from 'next/server';
import { getClerkUserMetadata } from '@/lib/auth';

export async function GET() {
  try {
    const metadata = await getClerkUserMetadata();
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Failed to get auth metadata:', error);
    return NextResponse.json({ role: null, permissions: [] }, { status: 500 });
  }
}
