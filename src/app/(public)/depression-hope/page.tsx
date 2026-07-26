"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sun, Wind, MessageCircle, Phone, Loader2, Copy, Check, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";
import FlowingContent from "@/components/FlowingContent";
import { ThemeProvider } from "@/components/ThemeProvider";

interface HopeItem {
  id: string;
  body: string;
  author: string | null;
  subcategory: string | null;
  tags: string[];
}

const breathingSteps = [
  { label: "Breathe In", duration: 4, color: "#8b7cf7" },
  { label: "Hold", duration: 4, color: "#a78bfa" },
  { label: "Breathe Out", duration: 6, color: "#ec4899" },
  { label: "Hold", duration: 2, color: "#8b7cf7" },
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
    <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
      <Wind size={32} className="mx-auto mb-4 text-[var(--accent)] relative z-10" />
      <h3 className="text-xl font-bold mb-2 relative z-10">4-4-6-2 Breathing</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-8 relative z-10">Follow the circle. Breathe with it.</p>
      <div className="relative w-44 h-44 mx-auto mb-8 z-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke={current.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-100"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: step % 2 === 0 ? [1, 1.3, 1] : 1 }}
            transition={{ duration: breathingSteps[step].duration, ease: "easeInOut" }}
            className="text-lg font-bold"
            style={{ color: current.color }}
          >
            {current.label}
          </motion.div>
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)] relative z-10 max-w-sm mx-auto">
        This exercise activates your parasympathetic nervous system, reducing anxiety and calming your mind.
      </p>
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

  const color = subcategoryColors[item.subcategory || "hope"] || "#8b7cf7";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="content-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>
          {item.subcategory || "Hope"}
        </span>
      </div>
      <p className="text-[var(--text-primary)] leading-relaxed text-[15px] mb-4 font-light">{item.body}</p>
      {item.author && (
        <p className="text-sm text-[var(--text-muted)] italic mb-4 font-light">— {item.author}</p>
      )}
      <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-color)]">
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
  const [dbEmpty, setDbEmpty] = useState(false);

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
        if ((data.data || []).length === 0) setDbEmpty(true);
      })
      .catch(() => setDbEmpty(true))
      .finally(() => setLoading(false));
  }, [subcategory]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] relative">
        <AmbientBackground />
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
          {/* Hero */}
          <FlowingContent>
            <div className="text-center mb-14">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/20">
                <Heart size={36} className="text-white" />
              </div>
              <h1 className="section-title mb-4">A Place With All Answers</h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                Whatever you are going through right now — you are not alone. Memorix holds thousands of messages
                of hope, strength, and healing. Take a breath. Read on. You matter.
              </p>
            </div>
          </FlowingContent>

          {/* Crisis Banner */}
          <FlowingContent delay={0.1}>
            <div className="glass-card p-6 md:p-8 mb-10 border-l-4 border-l-red-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
              <div className="flex items-start gap-4 relative z-10">
                <Phone size={24} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">If you are in crisis, help is available</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    You don&apos;t have to go through this alone. Reach out to someone who can help.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="tel:988" className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-all">
                      🇺🇸 988 Suicide & Crisis Lifeline
                    </a>
                    <a href="tel:116123" className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-all">
                      🇬🇧 Samaritans: 116 123
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FlowingContent>

          {/* Breathing Exercise */}
          <div className="mb-12">
            <BreathingExercise />
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {subcategories.map((s) => (
              <button
                key={s}
                onClick={() => setSubcategory(s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  subcategory === s
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]"
                    : "glass-card text-[var(--text-secondary)] hover:border-[var(--accent)]/30"
                }`}
              >
                {s === "All" ? "All Messages" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="content-card skeleton h-40" />
                ))
              : items.map((item) => (
                  <HopeCard key={item.id} item={item} />
                ))}
          </div>

          {dbEmpty && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Sun size={32} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-lg text-[var(--text-muted)]">Hope messages will appear once data is seeded.</p>
              <p className="text-sm mt-2 text-[var(--text-muted)]">Run <code className="text-[var(--accent)]">npm run db:seed</code> to load mental health content.</p>
            </div>
          )}

          {/* Affirmations */}
          <div className="mt-20">
            <FlowingContent>
              <div className="text-center mb-10">
                <Sun size={28} className="text-amber-400 mx-auto mb-3" />
                <h2 className="text-2xl font-bold">Daily Affirmations</h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Repeat these to yourself. Believe them.</p>
              </div>
            </FlowingContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                "I am enough exactly as I am.",
                "My feelings are valid and important.",
                "I have survived 100% of my bad days.",
                "I am worthy of love and happiness.",
                "This moment is temporary. Better days are coming.",
                "I choose to be kind to myself today.",
              ].map((affirmation, i) => (
                <FlowingContent key={i} delay={i * 0.08}>
                  <div className="content-card text-center py-10 hover:border-amber-500/20 transition-all">
                    <MessageCircle size={20} className="text-[var(--accent)] mx-auto mb-4" />
                    <p className="text-[var(--text-primary)] font-medium leading-relaxed text-lg font-light">{affirmation}</p>
                  </div>
                </FlowingContent>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
