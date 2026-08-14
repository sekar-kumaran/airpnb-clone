import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import { WishlistProvider } from "@/components/WishlistProvider";

export const metadata: Metadata = {
  title: "Airbnb Clone — Holiday rentals, cabins, beach houses & more",
  description:
    "Find unique places to stay with local hosts in 191 countries. Belong anywhere with Airbnb.",
  keywords: "airbnb, holiday rentals, cabins, beach houses, vacation rentals, India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-gray-900 antialiased">
        <ToastProvider>
          <WishlistProvider>
            <Suspense fallback={<div className="h-20 border-b border-gray-200 bg-white" />}>
              <Header />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
