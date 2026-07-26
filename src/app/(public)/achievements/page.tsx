"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Calendar, User, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

interface Achievement {
  id: string;
  title: string;
  person: string;
  date: string;
  year: number | null;
  category: string;
  description: string;
  impactScore: number;
  imageUrl: string | null;
}

const categories = ["All", "Science", "Space", "Medicine", "Sports", "Arts", "Technology", "Human Rights", "Exploration", "Literature", "Peace"];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
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

    fetch(`/api/v1/achievements?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setAchievements(data.data || []);
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

    fetch(`/api/v1/achievements?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setAchievements((prev) => [...prev, ...(data.data || [])]);
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Trophy size={20} className="text-white" />
              </div>
              <h1 className="section-title">Human Achievements</h1>
            </div>
            <p className="text-[var(--text-secondary)] max-w-xl">
              Celebrating the milestones that defined our species — from the first step on the moon to the cure for polio.
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
                {c}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/50 to-transparent" />
            <div className="space-y-8">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="content-card animate-pulse h-40" />
                  ))
                : achievements.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      {/* Dot */}
                      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--accent)] border-4 border-[var(--bg-primary)] shadow-lg shadow-[var(--accent-glow)] z-10 mt-6" />

                      {/* Card */}
                      <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}>
                        <div className="content-card">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {a.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              <span>{a.impactScore}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-1">{a.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {a.person}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {a.date}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{a.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
            </div>
          </div>

          {achievements.length === 0 && !loading && (
            <div className="text-center py-20 text-[var(--text-muted)]">
              <Trophy size={48} className="mx-auto mb-4 opacity-50" />
              <p>No achievements found in this category.</p>
            </div>
          )}

          {hasMore && achievements.length > 0 && (
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
