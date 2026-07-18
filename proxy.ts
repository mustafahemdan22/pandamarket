import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth, createClerkClient } from '@clerk/nextjs/server';

const PROTECTED_ROUTES = [
  '/admin',
  '/dashboard',
  '/account',
  '/orders',
] as const;

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (!isProtectedRoute(pathname)) {
      return NextResponse.next();
    }

    const { userId } = await auth();

    if (!userId) {
      const signInUrl = new URL('/login', request.url);
      signInUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Admin route protection based on Clerk Private Metadata
    if (pathname.startsWith('/admin')) {
      try {
        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
        const user = await clerk.users.getUser(userId);
        const metadata = (user?.privateMetadata || {}) as { role?: string; permissions?: string[] };

        if (metadata.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url));
        }

        const permissions = metadata.permissions || [];

        // Check sub-routes permissions
        if ((pathname.startsWith('/admin/products') || 
             pathname.startsWith('/admin/bulk-ai-generate') || 
             pathname.startsWith('/admin/images')) && 
            !permissions.includes('products')) {
          return NextResponse.redirect(new URL('/', request.url));
        }

        if (pathname.startsWith('/admin/categories') && !permissions.includes('categories')) {
          return NextResponse.redirect(new URL('/', request.url));
        }

        if (pathname.startsWith('/admin/orders') && !permissions.includes('orders')) {
          return NextResponse.redirect(new URL('/', request.url));
        }

        if (pathname.startsWith('/admin/users') && !permissions.includes('users')) {
          return NextResponse.redirect(new URL('/', request.url));
        }

        if (pathname.startsWith('/admin/settings') && !permissions.includes('settings')) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch (error) {
        console.error('Clerk authorization check failed in proxy:', error);
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    const response = NextResponse.next();
    response.headers.set('x-user-id', userId);
    return response;
  } catch (error) {
    console.error('Proxy middleware critical error:', error);
    // Safe fallback: allow request to proceed (pages will do their own client-side/db checks)
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/account/:path*',
    '/orders/:path*',
  ],
};