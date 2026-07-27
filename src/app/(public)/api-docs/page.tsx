"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileCode, Copy, Check, Terminal, Key, Zap, Shield, Globe } from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/content",
    desc: "Browse content with filters, sorting, and pagination.",
    params: [
      { name: "category", type: "string", desc: "Filter by category" },
      { name: "subcategory", type: "string", desc: "Filter by subcategory" },
      { name: "mood", type: "string", desc: "Filter by mood" },
      { name: "page", type: "number", desc: "Page number (default: 1)" },
      { name: "limit", type: "number", desc: "Items per page, max 100 (default: 20)" },
      { name: "sortBy", type: "string", desc: "Sort field: popularity, createdAt, likes" },
      { name: "order", type: "string", desc: "asc or desc (default: desc)" },
    ],
    example: `curl "https://memorix-blush.vercel.app/api/v1/content?category=quotes&limit=5"`,
  },
  {
    method: "GET",
    path: "/api/v1/content/random",
    desc: "Get a single random content piece.",
    params: [],
    example: `curl "https://memorix-blush.vercel.app/api/v1/content/random"`,
  },
  {
    method: "GET",
    path: "/api/v1/content/daily",
    desc: "Get the daily featured content piece.",
    params: [
      { name: "category", type: "string", desc: "Filter by category" },
    ],
    example: `curl "https://memorix-blush.vercel.app/api/v1/content/daily"`,
  },
  {
    method: "GET",
    path: "/api/v1/search",
    desc: "Full-text search across all content.",
    params: [
      { name: "q", type: "string", desc: "Search query (min 2 chars, required)" },
      { name: "category", type: "string", desc: "Filter by category" },
      { name: "page", type: "number", desc: "Page number" },
      { name: "limit", type: "number", desc: "Items per page, max 100" },
    ],
    example: `curl "https://memorix-blush.vercel.app/api/v1/search?q=love&limit=5"`,
  },
  {
    method: "GET",
    path: "/api/v1/categories",
    desc: "List all available content categories.",
    params: [],
    example: `curl "https://memorix-blush.vercel.app/api/v1/categories"`,
  },
  {
    method: "GET",
    path: "/api/v1/philosophers",
    desc: "Browse philosopher profiles.",
    params: [
      { name: "era", type: "string", desc: "Filter by era" },
      { name: "page", type: "number", desc: "Page number" },
      { name: "limit", type: "number", desc: "Items per page, max 100" },
    ],
    example: `curl "https://memorix-blush.vercel.app/api/v1/philosophers?era=Ancient&limit=10"`,
  },
  {
    method: "GET",
    path: "/api/v1/achievements",
    desc: "Browse human achievements.",
    params: [
      { name: "category", type: "string", desc: "Filter by category" },
      { name: "page", type: "number", desc: "Page number" },
      { name: "limit", type: "number", desc: "Items per page, max 100" },
    ],
    example: `curl "https://memorix-blush.vercel.app/api/v1/achievements?category=Science"`,
  },
  {
    method: "GET",
    path: "/api/v1/history/today",
    desc: "Get historical events for today's date.",
    params: [],
    example: `curl "https://memorix-blush.vercel.app/api/v1/history/today"`,
  },
  {
    method: "GET",
    path: "/api/v1/memes",
    desc: "Browse the meme gallery.",
    params: [
      { name: "category", type: "string", desc: "Filter by category" },
      { name: "page", type: "number", desc: "Page number" },
      { name: "limit", type: "number", desc: "Items per page, max 100" },
    ],
    example: `curl "https://memorix-blush.vercel.app/api/v1/memes?limit=10"`,
  },
  {
    method: "GET",
    path: "/api/v1/health",
    desc: "API health check and database stats.",
    params: [],
    example: `curl "https://memorix-blush.vercel.app/api/v1/health"`,
  },
];

function EndpointCard({ ep, index }: { ep: typeof endpoints[0]; index: number }) {
  const [copied, setCopied] = useState(false);

  const copyExample = () => {
    navigator.clipboard.writeText(ep.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const methodColor: Record<string, string> = {
    GET: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    POST: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    PUT: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    DELETE: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="content-card"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${methodColor[ep.method] || methodColor.GET}`}>
          {ep.method}
        </span>
        <code className="text-sm text-[var(--accent-bright)] font-mono">{ep.path}</code>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-4">{ep.desc}</p>

      {ep.params.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Parameters</h4>
          <div className="space-y-1.5">
            {ep.params.map((p) => (
              <div key={p.name} className="flex items-start gap-2 text-xs">
                <code className="text-[var(--accent)] font-mono min-w-[100px]">{p.name}</code>
                <span className="text-[var(--text-muted)]">{p.type}</span>
                <span className="text-[var(--text-secondary)]">— {p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <button
          onClick={copyExample}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors z-10"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <pre className="code-block text-xs overflow-x-auto">
          <code>{ep.example}</code>
        </pre>
      </div>
    </motion.div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/20">
            <FileCode className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <h1 className="section-title">API Documentation</h1>
        </div>
        <p className="section-subtitle">
          Integrate millions of curated content pieces into your apps. Simple, fast, and free to start.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
      >
        {[
          { icon: Globe, label: "Base URL", value: "memorix-blush.vercel.app" },
          { icon: Key, label: "Auth", value: "X-API-Key header" },
          { icon: Zap, label: "Free Tier", value: "100 req/min" },
          { icon: Shield, label: "Format", value: "JSON" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <s.icon className="w-4 h-4 mx-auto mb-2 text-[var(--accent)]" />
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
            <div className="text-sm font-semibold mt-1">{s.value}</div>
          </div>
        ))}
      </motion.div>

      {/* Auth Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass-card p-6 mb-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-lg font-semibold">Authentication</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Include your API key in the <code className="text-[var(--accent)]">X-API-Key</code> header.
          Free tier keys start with <code className="text-[var(--accent)]">mx_</code> followed by any characters.
        </p>
        <div className="code-block text-xs">
          <code>
            curl -H <span className="string">"X-API-Key: mx_your_key_here"</span>{" "}
            <span className="string">"https://memorix-blush.vercel.app/api/v1/content/random"</span>
          </code>
        </div>
      </motion.div>

      {/* Endpoints */}
      <div className="space-y-5">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Terminal className="w-4 h-4 text-[var(--accent)]" />
          Endpoints
        </h2>
        {endpoints.map((ep, i) => (
          <EndpointCard key={ep.path} ep={ep} index={i} />
        ))}
      </div>
    </div>
  );
}
