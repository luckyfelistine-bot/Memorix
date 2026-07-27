"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, Zap, Globe, Database, ChevronRight,
  Terminal, Copy, Check
} from "lucide-react";
import ContentCard from "@/components/ContentCard";
import MarqueeCategories from "@/components/MarqueeCategories";

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

const stats = [
  { label: "Content Pieces", value: "1M+", icon: Database },
  { label: "Categories", value: "15+", icon: Zap },
  { label: "Philosophers", value: "80+", icon: Globe },
  { label: "Daily Users", value: "∞", icon: Sparkles },
];

export default function HomePage() {
  const [daily, setDaily] = useState<ContentItem | null>(null);
  const [trending, setTrending] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbEmpty, setDbEmpty] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dailyRes, trendingRes, healthRes] = await Promise.all([
          fetch("/api/v1/content/daily"),
          fetch("/api/v1/content?sortBy=popularity&order=desc&limit=6"),
          fetch("/api/v1/health"),
        ]);
        const dailyData = await dailyRes.json();
        const trendingData = await trendingRes.json();
        const healthData = await healthRes.json();

        setDaily(dailyData.data);
        setTrending(trendingData.data || []);

        const totalContent = healthData?.stats?.content || 0;
        if (totalContent < 10) setDbEmpty(true);
      } catch (e) {
        console.error(e);
        setDbEmpty(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(`fetch("/api/v1/content/random")
  .then(r => r.json())
  .then(data => console.log(data));`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[var(--border-color)] text-xs font-medium text-[var(--accent-bright)] mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              The Living Matrix of Human Memory
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Every Word.
            <br />
            <span className="text-gradient">Every Feeling.</span>
            <br />
            Every Moment.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From ancient wisdom to modern memes, from heartbreak to hope —
            millions of curated content pieces, searchable and integrable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/explore" className="memorix-btn memorix-btn-primary">
              Explore Content
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/api-docs" className="memorix-btn memorix-btn-secondary">
              API Documentation
              <Terminal className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto"
          >
            {stats.map((s, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <s.icon className="w-4 h-4 mx-auto mb-2 text-[var(--accent)]" />
                <div className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {s.value}
                </div>
                <div className="text-[0.7rem] text-[var(--text-muted)] uppercase tracking-wider mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== MARQUEE CATEGORIES ===== */}
      <section className="relative z-10">
        <div className="fancy-divider mb-8" />
        <MarqueeCategories />
        <div className="fancy-divider mt-8" />
      </section>

      {/* ===== DAILY FEATURED ===== */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Daily Featured</h2>
              <p className="section-subtitle">Handpicked for today. One piece that matters.</p>
            </div>
            <Link href="/explore" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="glass-card p-8 animate-pulse">
              <div className="skeleton h-4 w-24 rounded mb-4" />
              <div className="skeleton h-6 w-3/4 rounded mb-3" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          ) : daily ? (
            <div className="max-w-3xl">
              <ContentCard item={daily} index={0} />
            </div>
          ) : (
            <div className="glass-card p-10 text-center">
              <p className="text-[var(--text-muted)]">Daily content will appear once data is seeded.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== TRENDING ===== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-[var(--bg-secondary)]/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Trending Now</h2>
              <p className="section-subtitle">What the world is reading right now.</p>
            </div>
            <Link href="/explore" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors">
              See more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card p-6 space-y-3">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-16 rounded" />
                  <div className="skeleton h-3 w-24 rounded" />
                </div>
              ))}
            </div>
          ) : trending.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trending.map((item, i) => (
                <ContentCard key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 text-center">
              <p className="text-[var(--text-muted)]">Trending content will appear once data is seeded.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== API TEASER ===== */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="badge badge-accent mb-4">
                  <Terminal className="w-3 h-3" />
                  Developer Ready
                </div>
                <h2 className="section-title mb-4">Powerful API</h2>
                <p className="section-subtitle mb-6">
                  Integrate millions of curated content pieces into your apps with a simple REST API.
                  Free tier available. Built for scale.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/api-docs" className="memorix-btn memorix-btn-primary">
                    Read API Docs
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="code-block relative">
                  <button
                    onClick={copyCode}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="text-xs sm:text-sm">
<code><span className="keyword">fetch</span>(<span className="string">"/api/v1/content/random"</span>)
  .<span className="function">then</span>(r =&gt; r.<span className="function">json</span>())
  .<span className="function">then</span>(data =&gt; <span className="function">console</span>.<span className="function">log</span>(data));</code>
                  </pre>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    100 req/min free
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    No auth needed to browse
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOPE CTA ===== */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5" />
            <div className="relative z-10">
              <HeartPulseIcon className="w-10 h-10 mx-auto mb-4 text-[var(--accent-cyan)]" />
              <h2 className="section-title mb-4">A Place With All Answers</h2>
              <p className="section-subtitle mx-auto mb-8">
                Feeling lost, sad, or hopeless? Memorix holds thousands of messages of hope,
                healing, and strength. You are not alone.
              </p>
              <Link href="/depression-hope" className="memorix-btn memorix-btn-primary">
                Find Comfort
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DB Empty Warning */}
      {dbEmpty && (
        <section className="relative z-10 py-10 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto glass-card p-6 border-amber-500/20">
            <h3 className="text-lg font-semibold text-amber-400 mb-2">Database Needs Seeding</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Your content library is empty. Run the seed script to load data.
            </p>
            <code className="code-block text-xs">
              npx prisma db push && npm run db:seed
            </code>
          </div>
        </section>
      )}
    </div>
  );
}

function HeartPulseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}
