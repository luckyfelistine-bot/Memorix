"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, Phone, Wind, Sun, Moon, Loader2 } from "lucide-react";
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

const subcategories = ["All", "depression", "anxiety", "hope", "healing", "self-love", "therapy", "crisis"];

const affirmations = [
  "I am enough exactly as I am.",
  "My feelings are valid and important.",
  "I have survived 100% of my bad days.",
  "I am worthy of love and happiness.",
  "This moment is temporary. Better days are coming.",
  "I choose to be kind to myself today.",
  "I am stronger than I think.",
  "My past does not define my future.",
];

function BreathingExercise() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const cycle = () => {
      setPhase("inhale");
      setTimeout(() => setPhase("hold"), 4000);
      setTimeout(() => setPhase("exhale"), 7000);
    };
    cycle();
    const interval = setInterval(cycle, 12000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="glass-card p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Wind className="w-4 h-4 text-[var(--accent-cyan)]" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Breathing Exercise</h3>
      </div>

      <div className="relative w-32 h-32 mx-auto mb-4">
        <motion.div
          animate={isActive ? {
            scale: phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 1,
            opacity: phase === "inhale" ? 0.3 : phase === "hold" ? 0.3 : 0.1,
          } : { scale: 1, opacity: 0.1 }}
          transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 5 : 0 }}
          className="absolute inset-0 rounded-full bg-[var(--accent-cyan)]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-[var(--text-primary)]">
            {isActive ? phase.charAt(0).toUpperCase() + phase.slice(1) : "Start"}
          </span>
        </div>
      </div>

      <button
        onClick={() => setIsActive(!isActive)}
        className="memorix-btn memorix-btn-primary text-sm py-2 px-6"
      >
        {isActive ? "Stop" : "Begin"}
      </button>
    </div>
  );
}

export default function DepressionHopePage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategory, setSubcategory] = useState("All");
  const [dbEmpty, setDbEmpty] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("category", "mental-health");
    params.set("limit", "50");
    if (subcategory !== "All") params.set("subcategory", subcategory);

    fetch(`/api/v1/content?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.data || []);
        if ((data.data || []).length === 0) setDbEmpty(true);
      })
      .catch(() => setDbEmpty(true))
      .finally(() => setLoading(false));
  }, [subcategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/20">
            <HeartPulse className="w-5 h-5 text-cyan-400" />
          </div>
          <h1 className="section-title">A Place With All Answers</h1>
        </div>
        <p className="section-subtitle">
          Whatever you are going through right now — you are not alone. Take a breath. Read on. You matter.
        </p>
      </motion.div>

      {/* Crisis Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6 mb-10 border-rose-500/20 bg-rose-500/5"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-rose-300 mb-1">If you are in crisis, help is available</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              You don't have to go through this alone. Reach out to someone who can help.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:988" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium hover:bg-rose-500/20 transition-colors">
                <Phone className="w-3.5 h-3.5" /> 988 Suicide & Crisis Lifeline
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Breathing + Affirmations */}
      <div className="grid md:grid-cols-2 gap-5 mb-10">
        <BreathingExercise />
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Daily Affirmations</h3>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
            {affirmations.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-xl bg-white/[0.02] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/20 transition-all cursor-default"
              >
                {a}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {subcategories.map((s) => (
          <button
            key={s}
            onClick={() => setSubcategory(s)}
            className={`category-pill ${subcategory === s ? "active" : ""}`}
          >
            {s === "All" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Messages */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i % 6} />
          ))}
        </div>
      ) : !loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <HeartPulse className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No messages yet</h3>
          <p className="text-sm text-[var(--text-muted)]">Hope messages will appear once data is seeded.</p>
        </div>
      ) : null}

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
    </div>
  );
}
