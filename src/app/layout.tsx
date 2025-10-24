import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/contexts/LanguageProvider"; 


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Panda Supermarket - Your Fresh Grocery Store",
  description: "Welcome to Panda Supermarket - your one-stop shop for fresh groceries, bakery items, spices, and everyday essentials.",
  keywords: "grocery, supermarket, fresh food, bakery, spices, vegetables, online shopping",
  authors: [{ name: "Panda Supermarket" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors duration-300`}
      >
     <LanguageProvider> {/* ✅ إضافة LanguageProvider */}
          <Providers>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                  border: "1px solid var(--border)",
                },
              }}
            />
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
