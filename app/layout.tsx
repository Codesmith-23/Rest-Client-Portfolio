import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LogProvider } from "@/context/LogContext";
import { ConsoleDrawer } from "@/components/ui/ConsoleDrawer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SITE_URL } from "@/lib/site";
import resume from "@/context/resume.json";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Mohammed Moinuddin Shaikh · Backend Developer",
    template: "%s | Mohammed Moinuddin Shaikh"
  },
  description: "Explore my work through a live API dashboard. Dive into my full-stack apps, AWS cloud backends, and AI engines.",
  keywords: ["developer", "portfolio", "full stack", "web development", "API"],
  authors: [{ name: "Mohammed Moinuddin Shaikh" }],
  creator: "Mohammed Moinuddin Shaikh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Mohammed Moinuddin Shaikh · Backend Developer",
    description: "Explore my work through a live API dashboard. Dive into my full-stack apps, AWS cloud backends, and AI engines.",
    siteName: "Moinuddin Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Moinuddin Shaikh · Backend Developer",
    description: "Explore my work through a live API dashboard. Dive into my full-stack apps, AWS cloud backends, and AI engines.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  // Fix mobile keyboard overlay - resizes viewport when keyboard appears
  interactiveWidget: "resizes-content",
};

// Structured data so search engines can tie the site to the person
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: resume.user.name,
  jobTitle: resume.user.role,
  url: SITE_URL,
  sameAs: [resume.contact.github, resume.contact.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MotionProvider>
          <LogProvider>
            {children}
            <ConsoleDrawer />
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </LogProvider>
        </MotionProvider>
      </body>
    </html>
  );
}