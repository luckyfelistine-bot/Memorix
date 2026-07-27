"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Loader2 } from "lucide-react";

interface Philosopher {
  id: string;
  name: string;
  bio: string;
  era: string;
  schoolOfThought: string;
  influenceScore: number;
  image?: string | null;
  quotes?: string[];
}

const eras = ["All", "Ancient", "Medieval", "Renaissance", "Enlightenment", "Modern", "Contemporary"];

export default function PhilosophersPage() {
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [loading, setLoading] = useState(true);
  const [era, setEra] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (p: number, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", "12");
      if (era !== "All") params.set("era", era);
      const res = await fetch(`/api/v1/philosophers?${params.toString()}`);
      const data = await res.json();
      const items = data.data || [];
      setPhilosophers((prev) => (reset ? items : [...prev, ...items]));
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
  }, [era]);

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/20">
            <Users className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <h1 className="section-title">Philosophers</h1>
        </div>
        <p className="section-subtitle">80+ thinkers who shaped human thought across millennia.</p>
      </motion.div>

      {/* Era Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {eras.map((e) => (
          <button
            key={e}
            onClick={() => setEra(e)}
            className={`category-pill ${era === e ? "active" : ""}`}
          >
            {e}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      {philosophers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {philosophers.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="content-card group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/10 flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate">{p.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{p.era} · {p.schoolOfThought}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-[var(--accent)]">{p.influenceScore}</div>
                  <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">Influence</div>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mt-3">{p.bio}</p>
              {p.quotes && p.quotes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-muted)] italic line-clamp-2">"{p.quotes[0]}"</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : !loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No philosophers found</h3>
          <p className="text-sm text-[var(--text-muted)]">Try a different era or seed the database.</p>
        </div>
      ) : null}

      {loading && philosophers.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="skeleton h-14 w-14 rounded-2xl" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-12 rounded" />
            </div>
          ))}
        </div>
      )}

      {hasMore && philosophers.length > 0 && (
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
