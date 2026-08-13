import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Airbnb Clone",
  description: "A functional clone built for the SDE Fullstack assignment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 flex flex-col">
        <ToastProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
