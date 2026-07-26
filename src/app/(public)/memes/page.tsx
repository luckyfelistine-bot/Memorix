"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image, Tag, Loader2, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

interface Meme {
  id: string;
  imageUrl: string;
  caption: string | null;
  altText: string;
  tags: string[];
  category: string;
  popularity: number;
}

const categories = ["All", "programming", "relatable", "relationships", "work", "school", "dark-humor", "wholesome", "reaction", "trending", "classic"];

export default function MemesPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", "24");
    if (category !== "All") params.set("category", category);

    fetch(`/api/v1/memes?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setMemes(data.data || []);
        setHasMore((data.data || []).length === 24);
        setPage(1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  const loadMore = () => {
    const nextPage = page + 1;
    const params = new URLSearchParams();
    params.set("page", String(nextPage));
    params.set("limit", "24");
    if (category !== "All") params.set("category", category);

    fetch(`/api/v1/memes?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setMemes((prev) => [...prev, ...(data.data || [])]);
        setHasMore((data.data || []).length === 24);
        setPage(nextPage);
      });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Image size={20} className="text-white" />
              </div>
              <h1 className="section-title">Meme Gallery</h1>
            </div>
            <p className="text-[var(--text-secondary)] max-w-xl">
              The best memes from across the internet — curated, tagged, and ready to make you laugh.
            </p>
          </motion.div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === c
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]"
                    : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
                }`}
              >
                {c === "All" ? "All" : c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="content-card animate-pulse break-inside-avoid" style={{ height: `${200 + Math.random() * 200}px` }} />
                ))
              : memes.map((meme, i) => (
                  <motion.div
                    key={meme.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="content-card break-inside-avoid p-3 group"
                  >
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img
                        src={meme.imageUrl}
                        alt={meme.altText}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%2312121a'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='14'%3EMeme image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {meme.caption && (
                      <p className="text-sm text-[var(--text-primary)] mb-2 font-medium">{meme.caption}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {meme.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)] flex items-center gap-0.5">
                            <Tag size={8} />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">{meme.popularity} views</span>
                    </div>
                  </motion.div>
                ))}
          </div>

          {memes.length === 0 && !loading && (
            <div className="text-center py-20 text-[var(--text-muted)]">
              <Image size={48} className="mx-auto mb-4 opacity-50" />
              <p>No memes found in this category.</p>
            </div>
          )}

          {hasMore && memes.length > 0 && (
            <div className="text-center mt-10">
              <button onClick={loadMore} className="memorix-btn memorix-btn-secondary">
                Load More
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
