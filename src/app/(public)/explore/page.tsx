"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Filter, Loader2, ChevronDown } from "lucide-react";
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

const categories = [
  "All", "quotes", "relationships", "wisdom", "fun", "brain-teasers",
  "stories", "entertainment", "lifestyle", "games", "creativity",
  "knowledge", "productivity", "events", "social-media", "health-wellness",
  "education", "finance", "travel", "technology", "pets-nature",
  "kids-family", "inspiration", "media", "mental-health", "memes", "philosophy"
];

const moods = ["All", "happy", "sad", "motivated", "calm", "energetic", "reflective", "humorous"];
const sortOptions = [
  { value: "popularity", label: "Most Popular" },
  { value: "createdAt", label: "Newest" },
  { value: "likes", label: "Most Liked" },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [mood, setMood] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  const fetchItems = async (p: number, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", "12");
      params.set("sortBy", sortBy);
      params.set("order", "desc");
      if (category !== "All") params.set("category", category);
      if (mood !== "All") params.set("mood", mood);

      const res = await fetch(`/api/v1/content?${params.toString()}`);
      const data = await res.json();
      const newItems = data.data || [];
      setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(newItems.length === 12);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchItems(1, true);
  }, [category, mood, sortBy]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchItems(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/20">
            <Compass className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <h1 className="section-title">Explore</h1>
        </div>
        <p className="section-subtitle">Browse the entire archive. Filter by category, mood, or sort by popularity.</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  sortBy === opt.value
                    ? "bg-[var(--accent-glow)] text-[var(--accent-bright)] border border-[var(--accent)]/20"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-white/[0.02]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {showFilters && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`category-pill ${category === c ? "active" : ""}`}
                  >
                    {c === "All" ? "All" : c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Mood</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`category-pill ${mood === m ? "active" : ""}`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i % 6} />
          ))}
        </div>
      ) : !loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Compass className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No content found</h3>
          <p className="text-sm text-[var(--text-muted)]">Try adjusting your filters or seed the database.</p>
        </div>
      ) : null}

      {/* Loading skeleton */}
      {loading && items.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-16 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && items.length > 0 && (
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
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">
        <div className="skeleton h-8 w-48 rounded mb-8" />
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
      <ExploreContent />
    </Suspense>
  );
}
