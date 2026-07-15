// src/app/layout.tsx
'use client';

import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '../contexts/LanguageProvider';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { WishlistProvider } from '../contexts/WishlistProvider';
import { AuthProvider } from '../contexts/AuthProvider';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { OrderProvider } from '../contexts/OrderProvider';
import { ReviewProvider } from '../contexts/ReviewProvider'; // ← أضف هذا
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['monospace'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors duration-300`}
      >
        <ClerkProvider>
          <ConvexProvider client={convex}>
            <Provider store={store}>
              <ThemeProvider>
                <LanguageProvider>
                  <AuthProvider>
                    <WishlistProvider>
                      <OrderProvider>
                        <ReviewProvider> {/* ← غلف هنا */}
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
          </ConvexProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}