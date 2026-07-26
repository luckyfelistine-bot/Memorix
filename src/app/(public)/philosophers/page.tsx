"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Globe, Calendar, BookOpen, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

interface Philosopher {
  id: string;
  name: string;
  bio: string;
  era: string;
  nationality: string;
  schoolOfThought: string | null;
  imageUrl: string | null;
  birthDate: string | null;
  deathDate: string | null;
  works: string[];
  influenceScore: number;
  quoteCount: number;
}

const eras = ["All", "Ancient", "Medieval", "Renaissance", "Enlightenment", "Modern", "Contemporary"];

export default function PhilosophersPage() {
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [loading, setLoading] = useState(true);
  const [era, setEra] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", "24");
    if (era !== "All") params.set("era", era);

    fetch(`/api/v1/philosophers?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setPhilosophers(data.data || []);
        setHasMore((data.data || []).length === 24);
        setPage(1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [era]);

  const loadMore = () => {
    const nextPage = page + 1;
    const params = new URLSearchParams();
    params.set("page", String(nextPage));
    params.set("limit", "24");
    if (era !== "All") params.set("era", era);

    fetch(`/api/v1/philosophers?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setPhilosophers((prev) => [...prev, ...(data.data || [])]);
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain size={20} className="text-white" />
              </div>
              <h1 className="section-title">Philosophers</h1>
            </div>
            <p className="text-[var(--text-secondary)] max-w-xl">
              Explore the minds that shaped human thought — from ancient sages to modern thinkers.
            </p>
          </motion.div>

          {/* Era filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {eras.map((e) => (
              <button
                key={e}
                onClick={() => setEra(e)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  era === e
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]"
                    : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="content-card animate-pulse h-64" />
                ))
              : philosophers.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="content-card"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center shrink-0 border border-violet-500/20">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full rounded-xl object-cover" />
                        ) : (
                          <Brain size={28} className="text-violet-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{p.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-1">
                          <Globe size={12} />
                          <span>{p.nationality}</span>
                          <span className="text-[var(--border-color)]">|</span>
                          <Calendar size={12} />
                          <span>{p.era}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">{p.bio}</p>
                    {p.schoolOfThought && (
                      <div className="mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          {p.schoolOfThought}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} />
                          {p.quoteCount} quotes
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain size={12} />
                          Influence: {p.influenceScore}
                        </span>
                      </div>
                    </div>
                    {p.works.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {p.works.slice(0, 3).map((work) => (
                          <span key={work} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                            {work}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
          </div>

          {philosophers.length === 0 && !loading && (
            <div className="text-center py-20 text-[var(--text-muted)]">
              <Brain size={48} className="mx-auto mb-4 opacity-50" />
              <p>No philosophers found for this era.</p>
            </div>
          )}

          {hasMore && philosophers.length > 0 && (
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
