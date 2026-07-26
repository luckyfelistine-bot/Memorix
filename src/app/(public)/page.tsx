"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Code2, Heart, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ContentCard from "@/components/ContentCard";
import CategoryGrid from "@/components/CategoryGrid";
import AmbientBackground from "@/components/AmbientBackground";
import FlowingContent from "@/components/FlowingContent";
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
  const [dbEmpty, setDbEmpty] = useState(false);

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

        // Check if database is essentially empty
        const totalContent = healthData?.stats?.content || 0;
        if (totalContent < 10) {
          setDbEmpty(true);
        }
      } catch (e) {
        console.error(e);
        setDbEmpty(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] relative">
        <AmbientBackground />
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-24 px-4">
          <div className="hero-glow top-0 left-1/2 -translate-x-1/2" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <FlowingContent delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium mb-8 animate-glow">
                <Sparkles size={14} />
                <span>The Living Matrix of Human Memory</span>
              </div>
            </FlowingContent>

            <FlowingContent delay={0.1}>
              <h1 className="section-title mb-6">
                Every Word.<br />
                Every <span className="text-gradient">Feeling.</span><br />
                Every Moment.
              </h1>
            </FlowingContent>

            <FlowingContent delay={0.2}>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
                Memorix archives the full spectrum of human expression — from ancient wisdom to modern memes,
                from heartbreak to hope. Search, discover, and integrate millions of curated content pieces into your apps.
              </p>
            </FlowingContent>

            <FlowingContent delay={0.3}>
              <div className="max-w-xl mx-auto mb-10">
                <SearchBar size="lg" placeholder="Search quotes, philosophers, facts, memes..." />
              </div>
            </FlowingContent>

            <FlowingContent delay={0.4}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/explore" className="memorix-btn memorix-btn-primary">
                  <BookOpen size={16} />
                  Explore Content
                </Link>
                <Link href="/api-docs" className="memorix-btn memorix-btn-secondary">
                  <Code2 size={16} />
                  API Documentation
                </Link>
              </div>
            </FlowingContent>
          </div>
        </section>

        {/* Database Empty Warning */}
        {dbEmpty && (
          <section className="px-4 pb-8">
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-6 border-l-4 border-l-amber-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Zap size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Database Needs Seeding</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                      Your content library is empty. The JSON seed files are in <code className="text-[var(--accent)]">data/seed/</code> but haven&apos;t been loaded into the database yet.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <code className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-xs text-[var(--text-muted)] border border-[var(--border-color)]">
                        npx prisma db push
                      </code>
                      <code className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-xs text-[var(--text-muted)] border border-[var(--border-color)]">
                        npm run db:seed
                      </code>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                      Or check your GitHub Actions workflow — ensure the seed step ran successfully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Daily Featured */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <FlowingContent>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold">Daily Featured</h2>
              </div>
            </FlowingContent>

            {loading ? (
              <div className="content-card skeleton h-48" />
            ) : daily ? (
              <FlowingContent>
                <ContentCard {...daily} />
              </FlowingContent>
            ) : (
              <div className="content-card text-center py-16 text-[var(--text-muted)]">
                <Sparkles size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">Daily content will appear once data is seeded.</p>
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <FlowingContent>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                    <Zap size={18} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Browse Categories</h2>
                </div>
                <Link href="/explore" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
            </FlowingContent>
            <CategoryGrid />
          </div>
        </section>

        {/* Hope CTA */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <FlowingContent>
              <Link href="/depression-hope">
                <div className="relative overflow-hidden rounded-2xl glass-card p-8 md:p-12 group hover:border-[var(--accent)]/30 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                      <Heart size={28} className="text-white" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h3 className="text-2xl font-bold mb-2">A Place With All Answers</h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        Feeling lost, sad, or hopeless? Memorix holds thousands of messages of hope, healing,
                        and strength. You are not alone. Find comfort, find courage, find your way back to light.
                      </p>
                    </div>
                    <ArrowRight size={24} className="text-indigo-400 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </FlowingContent>
          </div>
        </section>

        {/* Trending */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <FlowingContent>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                    <Zap size={18} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Trending Now</h2>
                </div>
                <Link href="/explore?sortBy=popularity" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                  See More <ArrowRight size={14} />
                </Link>
              </div>
            </FlowingContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="content-card skeleton h-56" />
                  ))
                : trending.map((item, i) => (
                    <FlowingContent key={item.id} delay={i * 0.05}>
                      <ContentCard {...item} />
                    </FlowingContent>
                  ))}
            </div>
          </div>
        </section>

        {/* API Teaser */}
        <section className="px-4 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <FlowingContent>
              <div className="glass-card p-8 md:p-12">
                <Code2 size={40} className="text-[var(--accent)] mx-auto mb-5" />
                <h2 className="text-2xl font-bold mb-3">Powerful API for Developers</h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto leading-relaxed">
                  Integrate millions of curated content pieces into your apps with a simple REST API.
                  100 requests/minute free tier. Built for scale.
                </p>
                <div className="code-block text-left max-w-lg mx-auto mb-8">
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
            </FlowingContent>
          </div>
        </section>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
