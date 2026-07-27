"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Loader2, ArrowRight } from "lucide-react";
import ContentCard from "@/components/ContentCard";

interface ContentItem {
  id: string;
  title?: string | null;
  body: string;
  category: string;
  subcategory?: string | null;
  tags?: string[];
  mood?: string | null;
  author?: string | null;
  popularity?: number;
  likes?: number;
}

const suggestions = ["love", "hope", "success", "wisdom", "funny", "motivation", "peace", "courage"];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ total?: number; totalPages?: number } | null>(null);

  const doSearch = async (q: string, p: number, reset = false) => {
    if (!q.trim()) {
      setItems([]);
      setMeta(null);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("q", q);
      params.set("page", String(p));
      params.set("limit", "12");
      const res = await fetch(`/api/v1/search?${params.toString()}`);
      const data = await res.json();
      setItems((prev) => (reset ? data.data || [] : [...prev, ...(data.data || [])]));
      setMeta(data.meta || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ) {
      setPage(1);
      doSearch(initialQ, 1, true);
    }
  }, [initialQ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    doSearch(query, 1, true);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    doSearch(query, next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center mb-12"
      >
        <h1 className="section-title mb-4">Search Memorix</h1>
        <p className="section-subtitle mx-auto mb-8">
          Find quotes, facts, philosophers, and more across millions of curated pieces.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for wisdom, quotes, hope..."
              className="w-full pl-12 pr-14 py-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20 transition-all text-base"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Suggestions */}
        {!query && !loading && items.length === 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs text-[var(--text-muted)] mr-1">Try:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  doSearch(s, 1, true);
                }}
                className="px-3 py-1 rounded-full text-xs bg-white/[0.03] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/30 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Results */}
      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-16 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[var(--text-secondary)]">
              Found <span className="text-[var(--text-primary)] font-semibold">{meta?.total || items.length}</span> results
              {query && <> for "<span className="text-[var(--accent)]">{query}</span>"</>}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <ContentCard key={item.id} item={item} index={i % 6} />
            ))}
          </div>
          {meta && page < (meta.totalPages || 1) && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                disabled={loading}
                className="memorix-btn memorix-btn-secondary"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : query ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No results found</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            We couldn't find anything matching "{query}". Try different keywords.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  doSearch(s, 1, true);
                }}
                className="px-3 py-1 rounded-full text-xs bg-white/[0.03] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/30 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Start Searching</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Enter a keyword above to find quotes, facts, philosophers, and more.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">
        <div className="skeleton h-8 w-48 rounded mb-8 mx-auto" />
        <div className="skeleton h-14 rounded-2xl mb-8 max-w-2xl mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-16 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
