"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Laugh, Loader2, Heart, Share2 } from "lucide-react";

interface Meme {
  id: string;
  title: string;
  caption?: string | null;
  imageUrl?: string | null;
  category: string;
  popularity: number;
  likes: number;
}

const categories = ["All", "Relatable", "Wholesome", "Dark", "Dank", "Classic", "Trending"];

export default function MemesPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (p: number, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", "12");
      if (category !== "All") params.set("category", category);
      const res = await fetch(`/api/v1/memes?${params.toString()}`);
      const data = await res.json();
      const items = data.data || [];
      setMemes((prev) => (reset ? items : [...prev, ...items]));
      setHasMore(items.length === 12);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchData(1, true);
  }, [category]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchData(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center border border-yellow-500/20">
            <Laugh className="w-5 h-5 text-yellow-400" />
          </div>
          <h1 className="section-title">Meme Gallery</h1>
        </div>
        <p className="section-subtitle">Curated memes that capture the human experience.</p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`category-pill ${category === c ? "active" : ""}`}
          >
            {c}
          </button>
        ))}
      </motion.div>

      {/* Masonry Grid */}
      {memes.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {memes.map((meme, i) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="content-card break-inside-avoid group"
            >
              {meme.imageUrl ? (
                <div className="relative rounded-xl overflow-hidden mb-3">
                  <img
                    src={meme.imageUrl}
                    alt={meme.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/10 flex items-center justify-center mb-3">
                  <Laugh className="w-12 h-12 text-yellow-400/30" />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">{meme.title}</h3>
                  {meme.caption && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{meme.caption}</p>
                  )}
                </div>
                <span className="badge badge-ghost text-[0.6rem]">{meme.category}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {meme.likes}
                  </span>
                  <span>{meme.popularity} views</span>
                </div>
                <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : !loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Laugh className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No memes found</h3>
          <p className="text-sm text-[var(--text-muted)]">Try a different category or seed the database.</p>
        </div>
      ) : null}

      {loading && memes.length === 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3 break-inside-avoid">
              <div className="skeleton aspect-video rounded-xl" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )}

      {hasMore && memes.length > 0 && (
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
