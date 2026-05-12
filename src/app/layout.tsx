import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { TradeProvider } from "@/app/contexts/TradeContext";
import { siteDescription, siteKeywords, siteName, siteUrl, twitterHandle } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: "%s | TradeReportz",
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  keywords: siteKeywords,
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    creator: twitterHandle,
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>

          <AuthProvider>

            <TradeProvider>

              {children}

            </TradeProvider>

          </AuthProvider>

        </ThemeProvider>

      </body>

    </html>
  );
}