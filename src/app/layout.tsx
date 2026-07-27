import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Memorix — The Living Matrix of Human Memory",
  description: "Every word ever spoken, every hope, every tear, every laugh — archived and accessible. Built by Aevibron.",
  keywords: "quotes, API, content, wisdom, philosophy, memes, history, achievements, memorix, aevibron",
  authors: [{ name: "Aevibron" }],
  icons: {
    icon: "/icons/logo.png",
    shortcut: "/icons/logo.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: "Memorix",
    description: "The Living Matrix of Human Memory",
    type: "website",
    images: [{ url: "/icons/icon-512.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <SessionProvider>
          <AmbientBackground />
          <div className="relative z-10 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
