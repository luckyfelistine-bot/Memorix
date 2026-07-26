"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronDown, Loader2, Grid3X3, List, Database, AlertTriangle, RefreshCw } from "lucide-react";
import ContentCard from "@/components/ContentCard";
import FlowingContent from "@/components/FlowingContent";

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

const categories = [
  "All", "quotes", "relationships", "wisdom", "fun", "brain", "stories",
  "entertainment", "lifestyle", "games", "creativity", "knowledge",
  "productivity", "events", "social", "health-wellness", "education",
  "finance", "travel", "technology", "pets-nature", "kids-family",
  "inspiration", "media", "mental-health", "memes", "philosophy",
];

const moods = ["All", "happy", "sad", "hopeful", "romantic", "motivated", "calm", "energetic", "reflective", "funny"];

export default function ExploreContent({
  initialCategory,
  initialMood,
}: {
  initialCategory: string;
  initialMood: string;
}) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [mood, setMood] = useState(initialMood);
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [dbStats, setDbStats] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchItems = useCallback(async (reset = false) => {
    setLoading(true);
    setFetchError(null);
    const currentPage = reset ? 1 : page;
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", "24");
    params.set("sortBy", sortBy);
    params.set("order", "desc");
    if (category !== "All") params.set("category", category);
    if (mood !== "All") params.set("mood", mood);

    try {
      const res = await fetch(`/api/v1/content?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
      const data = await res.json();
      if (reset) {
        setItems(data.data || []);
      } else {
        setItems((prev) => [...prev, ...(data.data || [])]);
      }
      setHasMore((data.data || []).length === 24);
    } catch (e: any) {
      console.error(e);
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  }, [category, mood, sortBy, page]);

  // Check database health
  useEffect(() => {
    fetch("/api/v1/health")
      .then((r) => r.json())
      .then((data) => setDbStats(data.stats))
      .catch(() => setDbStats(null));
  }, []);

  useEffect(() => {
    setPage(1);
    fetchItems(true);
  }, [category, mood, sortBy]);

  useEffect(() => {
    if (page > 1) fetchItems(false);
  }, [page]);

  const totalContent = dbStats?.content || 0;
  const isDbEmpty = totalContent < 10;

  return (
    <>
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-sm font-medium hover:border-[var(--accent)]/30 transition-all"
          >
            <Filter size={14} />
            Filters
            <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl glass-card text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] bg-transparent"
          >
            <option value="popularity">Most Popular</option>
            <option value="createdAt">Newest</option>
            <option value="likes">Most Liked</option>
          </select>
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-5 pb-5"
          >
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      category === cat
                        ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]"
                        : "glass-card text-[var(--text-secondary)] hover:border-[var(--accent)]/30"
                    }`}
                  >
                    {cat === "All" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 block">Mood</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      mood === m
                        ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]"
                        : "glass-card text-[var(--text-secondary)] hover:border-[var(--accent)]/30"
                    }`}
                  >
                    {m === "All" ? "All" : m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Database Empty State */}
      {isDbEmpty && !loading && (
        <FlowingContent>
          <div className="glass-card p-8 mb-8 border-l-4 border-l-amber-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Database size={24} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-400" />
                  Content Library is Empty
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  Your database has <strong>{totalContent}</strong> content items. The seed data files exist in <code className="text-[var(--accent)]">data/seed/</code> but need to be loaded.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-[var(--text-muted)]">Run these commands locally:</p>
                  <div className="code-block text-xs">
                    npx prisma db push<br />
                    npm run db:seed
                  </div>
                  <p className="text-[var(--text-muted)] mt-2">Or check your GitHub Actions workflow to ensure the seed step completed.</p>
                </div>
                <button
                  onClick={() => { setPage(1); fetchItems(true); }}
                  className="mt-4 memorix-btn memorix-btn-secondary text-xs"
                >
                  <RefreshCw size={14} />
                  Retry Loading
                </button>
              </div>
            </div>
          </div>
        </FlowingContent>
      )}

      {/* Fetch Error */}
      {fetchError && (
        <div className="glass-card p-6 mb-8 border-l-4 border-l-red-500 text-center">
          <p className="text-red-400 text-sm mb-3">{fetchError}</p>
          <button onClick={() => fetchItems(true)} className="memorix-btn memorix-btn-secondary text-xs">
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <ContentCard {...item} />
            </motion.div>
          ))}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="content-card skeleton h-56" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              className="content-card flex items-start gap-4"
            >
              <div className="flex-1">
                <p className="text-[var(--text-primary)] text-sm leading-relaxed">{item.body}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent)]">{item.category}</span>
                  {item.author && <span className="text-xs text-[var(--text-muted)]">— {item.author}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {items.length === 0 && !loading && !isDbEmpty && !fetchError && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Filter size={32} className="text-[var(--text-muted)]" />
          </div>
          <p className="text-lg text-[var(--text-muted)] mb-2">No content found matching your filters.</p>
          <button
            onClick={() => { setCategory("All"); setMood("All"); }}
            className="mt-4 text-[var(--accent)] hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {hasMore && items.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="memorix-btn memorix-btn-secondary"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}
