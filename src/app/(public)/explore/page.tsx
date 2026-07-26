import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import ExploreContent from "./ExploreContent";

export default function ExplorePage({
  searchParams,
}: {
  searchParams: { category?: string; mood?: string };
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="section-title mb-2">Explore Content</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Browse thousands of curated quotes, facts, stories, and more.
          </p>
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
            </div>
          }>
            <ExploreContent
              initialCategory={searchParams.category || "All"}
              initialMood={searchParams.mood || "All"}
            />
          </Suspense>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
