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

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://happy-albatross-290.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
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
