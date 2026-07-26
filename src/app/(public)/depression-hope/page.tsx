"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sun, Wind, MessageCircle, Phone, Loader2, Copy, Check, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

interface HopeItem {
  id: string;
  body: string;
  author: string | null;
  subcategory: string | null;
  tags: string[];
}

const breathingSteps = [
  { label: "Breathe In", duration: 4, color: "#6366f1" },
  { label: "Hold", duration: 4, color: "#8b5cf6" },
  { label: "Breathe Out", duration: 6, color: "#ec4899" },
  { label: "Hold", duration: 2, color: "#6366f1" },
];

function BreathingExercise() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const current = breathingSteps[step];
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setStep((s) => (s + 1) % breathingSteps.length);
          return 0;
        }
        return p + (100 / (current.duration * 10));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [step]);

  const current = breathingSteps[step];

  return (
    <div className="glass-card p-8 text-center">
      <Wind size={32} className="mx-auto mb-4 text-[var(--accent)]" />
      <h3 className="text-xl font-bold mb-2">4-4-6-2 Breathing</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6">Follow the circle. Breathe with it.</p>
      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" strokeWidth="4" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke={current.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-100"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: step % 2 === 0 ? [1, 1.2, 1] : 1 }}
            transition={{ duration: breathingSteps[step].duration, ease: "easeInOut" }}
            className="text-lg font-bold"
            style={{ color: current.color }}
          >
            {current.label}
          </motion.div>
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)]">This exercise activates your parasympathetic nervous system, reducing anxiety.</p>
    </div>
  );
}

function HopeCard({ item }: { item: HopeItem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subcategoryColors: Record<string, string> = {
    depression: "#ef4444",
    anxiety: "#f59e0b",
    hope: "#22c55e",
    healing: "#06b6d4",
    "self-love": "#ec4899",
    therapy: "#8b5cf6",
    crisis: "#dc2626",
  };

  const color = subcategoryColors[item.subcategory || "hope"] || "#6366f1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="content-card"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
          {item.subcategory || "Hope"}
        </span>
      </div>
      <p className="text-[var(--text-primary)] leading-relaxed text-[15px] mb-4">{item.body}</p>
      {item.author && (
        <p className="text-sm text-[var(--text-muted)] italic mb-3">— {item.author}</p>
      )}
      <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)]">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
        >
          <Share2 size={13} />
          Share
        </button>
      </div>
    </motion.div>
  );
}

export default function DepressionHopePage() {
  const [items, setItems] = useState<HopeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategory, setSubcategory] = useState("All");

  const subcategories = ["All", "depression", "anxiety", "hope", "healing", "self-love", "therapy", "crisis"];

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
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [subcategory]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/20">
              <Heart size={36} className="text-white" />
            </div>
            <h1 className="section-title mb-4">A Place With All Answers</h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Whatever you are going through right now — you are not alone. Memorix holds thousands of messages 
              of hope, strength, and healing. Take a breath. Read on. You matter.
            </p>
          </motion.div>

          {/* Crisis Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-10 border-l-4 border-l-red-500"
          >
            <div className="flex items-start gap-4">
              <Phone size={24} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">If you are in crisis, help is available</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  You don&apos;t have to go through this alone. Reach out to someone who can help.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:988" className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-all">
                    🇺🇸 988 Suicide & Crisis Lifeline
                  </a>
                  <a href="tel:116123" className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-all">
                    🇬🇧 Samaritans: 116 123
                  </a>
                  <a href="tel:143" className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-all">
                    🇨🇭 Die Dargebotene Hand: 143
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Breathing Exercise */}
          <div className="mb-10">
            <BreathingExercise />
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {subcategories.map((s) => (
              <button
                key={s}
                onClick={() => setSubcategory(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  subcategory === s
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]"
                    : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
                }`}
              >
                {s === "All" ? "All Messages" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="content-card animate-pulse h-40" />
                ))
              : items.map((item) => (
                  <HopeCard key={item.id} item={item} />
                ))}
          </div>

          {items.length === 0 && !loading && (
            <div className="text-center py-20 text-[var(--text-muted)]">
              <Sun size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">More hope messages coming soon.</p>
              <p className="text-sm mt-2">Check back after seed data is loaded.</p>
            </div>
          )}

          {/* Affirmations Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <Sun size={28} className="text-amber-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Daily Affirmations</h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Repeat these to yourself. Believe them.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "I am enough exactly as I am.",
                "My feelings are valid and important.",
                "I have survived 100% of my bad days.",
                "I am worthy of love and happiness.",
                "This moment is temporary. Better days are coming.",
                "I choose to be kind to myself today.",
              ].map((affirmation, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="content-card text-center py-8"
                >
                  <MessageCircle size={20} className="text-[var(--accent)] mx-auto mb-3" />
                  <p className="text-[var(--text-primary)] font-medium leading-relaxed">{affirmation}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
