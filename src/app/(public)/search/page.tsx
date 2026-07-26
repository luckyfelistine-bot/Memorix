"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ContentCard from "@/components/ContentCard";
import { ThemeProvider } from "@/components/ThemeProvider";

interface ContentItem {
  id: string;
  title: string | null;
  body: string;
  author: string | null;
  category: string;
  subcategory: string | null;
  tags: string[];
  mood: string | null;
  popularity: number;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setPage(1);
    fetch(`/api/v1/search?q=${encodeURIComponent(q)}&page=1&limit=24`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.data || []);
        setMeta(data.meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  useEffect(() => {
    if (page === 1) return;
    fetch(`/api/v1/search?q=${encodeURIComponent(q)}&page=${page}&limit=24`)
      .then((r) => r.json())
      .then((data) => {
        setItems((prev) => [...prev, ...(data.data || [])]);
      })
      .catch(console.error);
  }, [page, q]);

  return (
    <div>
      <div className="max-w-xl mx-auto mb-10">
        <SearchBar placeholder={`Searching for "${q}"...`} size="md" />
      </div>

      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : items.length > 0 ? (
        <>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Found {meta?.total || items.length} results for &ldquo;{q}&rdquo;
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ContentCard {...item} />
              </motion.div>
            ))}
          </div>
          {meta && page < meta.totalPages && (
            <div className="text-center mt-10">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="memorix-btn memorix-btn-secondary"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : q ? (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-[var(--text-secondary)] mb-6">
            We couldn&apos;t find anything matching &ldquo;{q}&rdquo;. Try different keywords.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["love", "hope", "success", "wisdom", "funny", "motivation"].map((suggestion) => (
              <Link
                key={suggestion}
                href={`/search?q=${suggestion}`}
                className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Start Searching</h3>
          <p className="text-[var(--text-secondary)]">Enter a keyword above to find quotes, facts, philosophers, and more.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="section-title mb-8">Search Memorix</h1>
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
            </div>
          }>
            <SearchResults />
          </Suspense>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
