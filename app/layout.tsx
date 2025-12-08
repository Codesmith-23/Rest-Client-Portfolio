import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LogProvider } from "@/context/LogContext";
import { ConsoleDrawer } from "@/components/ui/ConsoleDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://moinuddin.vercel.app'),
  title: {
    default: "Moinuddin's Localhost | Portolio",
    template: "%s | Moinuddin's Localhost"
  },
  description: "Interactive API-style portfolio showcasing developer skills and projects",
  keywords: ["developer", "portfolio", "full stack", "web development", "API"],
  authors: [{ name: "Mohammed Moinuddin Shaikh" }],
  creator: "Mohammed Moinuddin Shaikh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Moinuddin's Localhost | Portolio",
    description: "Interactive API-style portfolio showcasing developer skills and projects",
    siteName: "Moinuddin Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moinuddin's Localhost | Portolio",
    description: "Interactive API-style portfolio showcasing developer skills and projects",
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
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617",
  // Fix mobile keyboard overlay - resizes viewport when keyboard appears
  interactiveWidget: "resizes-content",
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
        <LogProvider>
          {children}
          <ConsoleDrawer />
          <Toaster />
        </LogProvider>
      </body>
    </html>
  );
}
