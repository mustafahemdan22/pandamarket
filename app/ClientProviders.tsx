'use client';

import React from 'react';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '../contexts/LanguageProvider';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { WishlistProvider } from '../contexts/WishlistProvider';
import { AuthProvider } from '../contexts/AuthProvider';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { OrderProvider } from '../contexts/OrderProvider';
import { ReviewProvider } from '../contexts/ReviewProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://intent-bat-912.convex.cloud';
const convex = new ConvexReactClient(convexUrl);
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_c2V0dGxlZC13cmVuLTI2LmNsZXJrLmFjY291bnRzLmRldiQ';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Provider store={store}>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <WishlistProvider>
                  <OrderProvider>
                    <ReviewProvider>
                      <Navbar />
                      {children}
                      <Footer />
                    </ReviewProvider>
                  </OrderProvider>
                </WishlistProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </Provider>
        <Toaster position="top-center" />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
