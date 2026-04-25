import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { TradeProvider } from "@/app/contexts/TradeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeReportz",
  description: "AI Powered Trading Journal and Analytics Platform",
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