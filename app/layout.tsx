import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meridian-dashboard.nublson.com"),
  title: {
    default: "Meridian — Analytics Dashboard",
    template: "%s | Meridian",
  },
  description:
    "Meridian is a modern CRM analytics dashboard with real-time revenue tracking, lead source insights, deal pipeline management, and AI-powered assistant.",
  keywords: [
    "CRM",
    "analytics dashboard",
    "revenue tracking",
    "lead management",
    "deal pipeline",
    "sales analytics",
  ],
  authors: [{ name: "Nubelson Fernandes", url: "https://nublson.com" }],
  creator: "Nubelson Fernandes",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://meridian-dashboard.nublson.com",
    siteName: "Meridian",
    title: "Meridian — Analytics Dashboard",
    description:
      "Modern CRM analytics dashboard with real-time revenue tracking, lead source insights, and deal pipeline management.",
    images: [
      {
        url: "/opengraph-image.jpeg",
        width: 1280,
        height: 832,
        alt: "Meridian — Analytics Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meridian — Analytics Dashboard",
    description:
      "Modern CRM analytics dashboard with real-time revenue tracking, lead source insights, and deal pipeline management.",
    images: ["/twitter-image.jpeg"],
    creator: "@nublsonf",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
