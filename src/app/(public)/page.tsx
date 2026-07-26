"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, BookOpen, Zap, TrendingUp, Code2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ContentCard from "@/components/ContentCard";
import CategoryGrid from "@/components/CategoryGrid";
import { ThemeProvider } from "@/components/ThemeProvider";

interface ContentItem {
  id: string;
  title: string | null;
  body: string;
  author: string | null;
  category: string;
  subcategory: string | null;
  tags: string[];
  mood: string | null;
  popularity: number;
}

export default function HomePage() {
  const [daily, setDaily] = useState<ContentItem | null>(null);
  const [trending, setTrending] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dailyRes, trendingRes] = await Promise.all([
          fetch("/api/v1/content/daily"),
          fetch("/api/v1/content?sortBy=popularity&order=desc&limit=6"),
        ]);
        const dailyData = await dailyRes.json();
        const trendingData = await trendingRes.json();
        setDaily(dailyData.data);
        setTrending(trendingData.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-20 px-4">
          <div className="hero-glow top-0 left-1/2 -translate-x-1/2" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium mb-6">
                <Sparkles size={14} />
                <span>The Living Matrix of Human Memory</span>
              </div>
              <h1 className="section-title mb-6">
                Every Word.<br />
                Every <span className="text-gradient">Feeling.</span><br />
                Every Moment.
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
                Memorix archives the full spectrum of human expression — from ancient wisdom to modern memes, 
                from heartbreak to hope. Search, discover, and integrate millions of curated content pieces into your apps.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl mx-auto mb-10"
            >
              <SearchBar size="lg" placeholder="Search quotes, philosophers, facts, memes..." />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Link href="/explore" className="memorix-btn memorix-btn-primary">
                <BookOpen size={16} />
                Explore Content
              </Link>
              <Link href="/api-docs" className="memorix-btn memorix-btn-secondary">
                <Code2 size={16} />
                API Documentation
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Daily Featured */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">Daily Featured</h2>
            </div>
            {loading ? (
              <div className="content-card animate-pulse h-40" />
            ) : daily ? (
              <ContentCard {...daily} />
            ) : (
              <div className="content-card text-center py-12 text-[var(--text-muted)]">
                <Sparkles size={32} className="mx-auto mb-3 opacity-50" />
                <p>Daily content loading...</p>
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-bold">Browse Categories</h2>
              </div>
              <Link href="/explore" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <CategoryGrid />
          </div>
        </section>

        {/* Hope CTA */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <Link href="/depression-hope">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 p-8 md:p-12 group hover:border-indigo-500/40 transition-all">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Heart size={28} className="text-white" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-2xl font-bold mb-2">A Place With All Answers</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      Feeling lost, sad, or hopeless? Memorix holds thousands of messages of hope, healing, 
                      and strength. You are not alone. Find comfort, find courage, find your way back to light.
                    </p>
                  </div>
                  <ArrowRight size={24} className="text-indigo-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Trending */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-bold">Trending Now</h2>
              </div>
              <Link href="/explore?sortBy=popularity" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                See More <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="content-card animate-pulse h-48" />
                  ))
                : trending.map((item) => (
                    <ContentCard key={item.id} {...item} />
                  ))}
            </div>
          </div>
        </section>

        {/* API Teaser */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card p-8 md:p-12">
              <Code2 size={40} className="text-[var(--accent)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Powerful API for Developers</h2>
              <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
                Integrate millions of curated content pieces into your apps with a simple REST API. 
                100 requests/minute free tier. Built for scale.
              </p>
              <div className="code-block text-left max-w-lg mx-auto mb-6">
                <span className="comment">// Get a random quote</span><br />
                <span className="keyword">fetch</span>(<span className="string">&quot;/api/v1/content/random&quot;</span>, {'{'}<br />
                &nbsp;&nbsp;<span className="function">headers</span>: {'{'} <span className="string">&quot;X-API-Key&quot;</span>: <span className="string">&quot;your-key&quot;</span> {'}'}<br />
                {'}'})<br />
                &nbsp;&nbsp;.<span className="function">then</span>(res =&gt; res.<span className="function">json</span>())<br />
                &nbsp;&nbsp;.<span className="function">then</span>(data =&gt; console.<span className="function">log</span>(data));
              </div>
              <Link href="/api-docs" className="memorix-btn memorix-btn-primary inline-flex">
                <ArrowRight size={16} />
                Read API Docs
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
