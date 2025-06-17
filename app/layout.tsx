import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import SupabaseProvider from "./supabase-provider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mont Cervin - off-market properties",
  description:
    "Get access to off-market deals that you won’t find anywhere else.",
  keywords: "modern architecture, design homes, property, real estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <AuthProvider>
            <Header />

            <main className="min-h-screen">{children}</main>
            <Toaster position="top-right" />
            <Footer />
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
