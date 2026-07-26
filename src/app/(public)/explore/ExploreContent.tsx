"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronDown, Loader2, Grid3X3, List } from "lucide-react";
import ContentCard from "@/components/ContentCard";

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

  const fetchItems = useCallback(async (reset = false) => {
    setLoading(true);
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
      const data = await res.json();
      if (reset) {
        setItems(data.data || []);
      } else {
        setItems((prev) => [...prev, ...(data.data || [])]);
      }
      setHasMore((data.data || []).length === 24);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [category, mood, sortBy, page]);

  useEffect(() => {
    setPage(1);
    fetchItems(true);
  }, [category, mood, sortBy]);

  useEffect(() => {
    if (page > 1) fetchItems(false);
  }, [page]);

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm font-medium hover:border-[var(--accent)] transition-all"
          >
            <Filter size={14} />
            Filters
            <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="popularity">Most Popular</option>
            <option value="createdAt">Newest</option>
            <option value="likes">Most Liked</option>
          </select>
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 pb-4"
          >
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      category === cat
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {cat === "All" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Mood</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      mood === m
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)]"
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

      {viewMode === "grid" ? (
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
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="content-card animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="content-card flex items-start gap-4">
              <div className="flex-1">
                <p className="text-[var(--text-primary)] text-sm leading-relaxed">{item.body}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent)]">{item.category}</span>
                  {item.author && <span className="text-xs text-[var(--text-muted)]">— {item.author}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p className="text-lg">No content found matching your filters.</p>
          <button
            onClick={() => { setCategory("All"); setMood("All"); }}
            className="mt-4 text-[var(--accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {hasMore && items.length > 0 && (
        <div className="text-center mt-10">
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
