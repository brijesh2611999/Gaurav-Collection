import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ContributionBanner from "@/components/ContributionBanner";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gaurav Collection Stock Images & Photography",
  description: "Discover millions of high-quality stock images, photos, and illustrations. Download premium royalty-free images for your creative projects.",
  keywords: ["stock images", "photography", "royalty-free", "premium images", "stock photos", "illustrations"],
  authors: [{ name: "Gaurav Collection" }],
  openGraph: {
    title: "Gaurav Collection Stock Images & Photography",
    description: "Discover millions of high-quality stock images, photos, and illustrations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <ContributionBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
