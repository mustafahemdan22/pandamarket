import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_c2V0dGxlZC13cmVuLTI2LmNsZXJrLmFjY291bnRzLmRldiQ';
const secretKey = process.env.CLERK_SECRET_KEY || 'sk_test_eLN4AnKczcErIHn8nV8pjGkkRFMq1aHNBW0zqlOMFN';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/account(.*)',
  '/orders/(.*)',
]);

export const proxy = clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  { publishableKey, secretKey }
);

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};