'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageProvider';
import { WishlistProvider } from '@/contexts/WishlistProvider';
import { AuthProvider } from '@/contexts/AuthProvider';
import { OrderProvider } from '@/contexts/OrderProvider';
import { ReviewProvider } from '@/contexts/ReviewProvider';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

// ✅ استيراد Convex
import { ConvexProvider, ConvexReactClient } from "convex/react";

// ✅ إنشاء عميل Convex
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ConvexProvider client={convex}>
      <Provider store={store}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <WishlistProvider>
                <OrderProvider>
                  <ReviewProvider>
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <main className="flex-1">
                        {children}
                      </main>
                      <Footer />
                      <ScrollToTop />
                    </div>
                  </ReviewProvider>
                </OrderProvider>
              </WishlistProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </Provider>
    </ConvexProvider>
  );
}
