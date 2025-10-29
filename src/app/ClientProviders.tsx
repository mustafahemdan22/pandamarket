// src/app/ClientProviders.tsx
'use client';

import { ReactNode } from 'react';
import { Providers } from '../components/Providers';
import { LanguageProvider } from '../contexts/LanguageProvider';
import { Toaster } from 'react-hot-toast';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// تأكد من أن NEXT_PUBLIC_CONVEX_URL معرّف في .env.local
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ConvexProvider client={convex}>
      <LanguageProvider>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--card)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </Providers>
      </LanguageProvider>
    </ConvexProvider>
  );
}