// src/app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs'; // ← أضف Clerk

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider> {/* ← غلف التطبيق بـ ClerkProvider */}
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors duration-300`}
        >
          <ClientProviders>
            {children}
          </ClientProviders>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgb(17, 24, 39)', // gray-800
                color: 'white',
                borderRadius: '0.5rem',
                padding: '1rem',
                fontSize: '0.875rem',
              },
              success: {
                style: {
                  background: '#10b981', // green-500
                },
              },
              error: {
                style: {
                  background: '#ef4444', // ← تم إصلاحه من #ef44 إلى #ef4444
                },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}