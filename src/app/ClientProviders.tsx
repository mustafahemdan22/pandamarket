'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Toaster } from 'react-hot-toast';

// 🧩 استيراد كل الـ Providers بتاعتك
import { AuthProvider } from '../contexts/AuthProvider';
import { WishlistProvider } from '../contexts/WishlistProvider';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { LanguageProvider } from '../contexts/LanguageProvider';

// ✅ إنشاء عميل Convex
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface Props {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: Props) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <WishlistProvider>
              {children}
              <Toaster position="top-center" />
            </WishlistProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ConvexProvider>
  );

  if (!publishableKey) {
    if (typeof window !== 'undefined') {
      console.warn('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined — ClerkProvider disabled.');
    }
    return content;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {content}
    </ClerkProvider>
  );
}
