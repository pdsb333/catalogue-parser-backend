import type { Metadata } from "next";
import { Jost, JetBrains_Mono } from "next/font/google";
import "./globals.css";


const jost = Jost({
  variable: "--font-main", 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel | Scraper Service",
  description: "Interface de gestion optimisée avec Jost & Tailwind v4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${jost.variable} ${jetBrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text antialiased font-main">
        {/* 'font-main' applique Jost par défaut sur tout le body */}
        {children}
      </body>
    </html>
  );
}