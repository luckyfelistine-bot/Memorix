import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Memorix — The Living Matrix of Human Memory",
  description: "Every word ever spoken, every hope, every tear, every laugh — archived and accessible. Built by Aevibron.",
  keywords: "quotes, API, content, wisdom, philosophy, memes, history, achievements, memorix, aevibron",
  authors: [{ name: "Aevibron" }],
  openGraph: {
    title: "Memorix",
    description: "The Living Matrix of Human Memory",
    type: "website",
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
