"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Loader2 } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  person: string;
  date: string;
  category: string;
  impactScore: number;
  image?: string | null;
}

const categories = ["All", "Science", "Technology", "Arts", "Sports", "Politics", "Medicine", "Exploration", "Human Rights"];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
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
      const res = await fetch(`/api/v1/achievements?${params.toString()}`);
      const data = await res.json();
      const items = data.data || [];
      setAchievements((prev) => (reset ? items : [...prev, ...items]));
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="section-title">Achievements</h1>
        </div>
        <p className="section-subtitle">Celebrating the milestones that defined our species.</p>
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

      {/* Timeline */}
      {achievements.length > 0 ? (
        <div className="relative">
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)]/30 via-[var(--accent)]/10 to-transparent" />
          <div className="space-y-6">
            {achievements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative pl-12 sm:pl-20"
              >
                {/* Dot */}
                <div className="absolute left-2 sm:left-6 top-6 w-4 h-4 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--accent)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                </div>

                <div className="content-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="badge badge-ghost text-[0.65rem]">{a.category}</span>
                        <span className="text-xs text-[var(--text-muted)]">{a.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{a.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">{a.person}</p>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{a.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-sm font-semibold">{a.impactScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : !loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Trophy className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No achievements found</h3>
          <p className="text-sm text-[var(--text-muted)]">Try a different category or seed the database.</p>
        </div>
      ) : null}

      {loading && achievements.length === 0 && (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="pl-20">
              <div className="glass-card p-6 space-y-3">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-12 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && achievements.length > 0 && (
        <div className="flex justify-center mt-10 pl-20">
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
