import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import LiffProvider from "@/components/LiffProvider";
import BgmPlayer from "@/components/BgmPlayer";
import { RelaxProvider } from "@/context/RelaxContext";

export const metadata: Metadata = {
  title: "Coffee Float - 湯気のように漂うコーヒーの思い出",
  description: "今、この瞬間の美味しいを共有する。コーヒーの感動共有アプリ。",
  referrer: "no-referrer",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <LiffProvider>
          <RelaxProvider>
            {children}
            <BgmPlayer />
          </RelaxProvider>
        </LiffProvider>
      </body>
    </html>
  );
}
