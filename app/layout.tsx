import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Tempo Examples",
  description: "Examples of using Tempo.xyz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "scrollbar-none overscroll-none antialiased [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        geistSans.variable,
        geistMono.variable,
      )}
      lang="en"
    >
      <body className="overscroll-none">{children}</body>
    </html>
  );
}
