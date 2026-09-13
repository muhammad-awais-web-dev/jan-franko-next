import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArcheryTransition } from "@/components/ArcheryTransition";
import GoogleTranslate from "@/components/GoogleTranslate";
import CookieConsent from "@/components/CookieConsent";
import { constructMetadata } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontSerif = Lora({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Jan Franko - Traditional Archery Academy",
    description: "Traditional archery academy focused on structured training, cultural study, biomechanical precision, and global wilderness expeditions.",
  }),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/wp-assets/favicon-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fontSerif.variable} h-full antialiased scroll-smooth overflow-x-hidden max-w-full`}
    >
      <body className="min-h-full flex flex-col relative bg-[#f0e9d9] text-[#0e3b2e] overflow-x-hidden max-w-full">
        <GoogleTranslate />
        <Navbar />
        <main className="flex-grow">
          <ArcheryTransition>
            {children}
          </ArcheryTransition>
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
