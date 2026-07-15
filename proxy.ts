import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const PROTECTED_ROUTES = [
  '/admin',
  '/dashboard',
  '/account',
  '/orders',
] as const;

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isPublicAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/signup';
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    const signInUrl = new URL('/login', request.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  const response = NextResponse.next();
  response.headers.set('x-user-id', userId);
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/account/:path*',
    '/orders/:path*',
  ],
};