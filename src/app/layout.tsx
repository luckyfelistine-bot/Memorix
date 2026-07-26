import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
