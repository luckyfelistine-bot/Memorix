"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Code2, Terminal, Key, Shield, Zap, Globe, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/content",
    description: "Browse all content with filtering, sorting, and pagination.",
    params: [
      { name: "category", type: "string", desc: "Filter by category (e.g., quotes, memes)" },
      { name: "subcategory", type: "string", desc: "Filter by subcategory" },
      { name: "mood", type: "string", desc: "Filter by mood (happy, sad, hopeful)" },
      { name: "tags", type: "string", desc: "Comma-separated tags" },
      { name: "page", type: "number", desc: "Page number (default: 1)" },
      { name: "limit", type: "number", desc: "Items per page, max 100 (default: 20)" },
      { name: "sortBy", type: "string", desc: "Sort field: popularity, createdAt, likes" },
      { name: "order", type: "string", desc: "Sort order: asc or desc" },
    ],
    example: `curl -H "X-API-Key: your-key" \  "https://memorix.vercel.app/api/v1/content?category=quotes&limit=5"`,
    response: `{
  "data": [
    {
      "id": "clx...",
      "body": "The only way to do great work...",
      "author": "Steve Jobs",
      "category": "quotes",
      "tags": ["success", "work"],
      "popularity": 1523
    }
  ],
  "meta": { "page": 1, "limit": 5, "total": 4821, "totalPages": 965 }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/content/random",
    description: "Get random content. Optionally filter by category or mood.",
    params: [
      { name: "category", type: "string", desc: "Filter by category" },
      { name: "mood", type: "string", desc: "Filter by mood" },
      { name: "count", type: "number", desc: "Number of items, max 10 (default: 1)" },
    ],
    example: `curl -H "X-API-Key: your-key" \  "https://memorix.vercel.app/api/v1/content/random?count=3"`,
    response: `{
  "data": [
    { "id": "...", "body": "...", "author": "...", "category": "..." }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/content/daily",
    description: "Get the daily featured content. Deterministic per day.",
    params: [
      { name: "category", type: "string", desc: "Filter by category" },
    ],
    example: `curl -H "X-API-Key: your-key" \  "https://memorix.vercel.app/api/v1/content/daily"`,
    response: `{
  "data": {
    "id": "...",
    "body": "Today's featured wisdom...",
    "author": "Marcus Aurelius",
    "category": "quotes"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/search",
    description: "Full-text search across all content.",
    params: [
      { name: "q", type: "string", desc: "Search query (min 2 chars, required)" },
      { name: "category", type: "string", desc: "Filter by category" },
      { name: "page", type: "number", desc: "Page number" },
      { name: "limit", type: "number", desc: "Items per page, max 100" },
    ],
    example: `curl -H "X-API-Key: your-key" \  "https://memorix.vercel.app/api/v1/search?q=love&limit=10"`,
    response: `{
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 342, "totalPages": 35, "query": "love" }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/categories",
    description: "List all content categories with stats.",
    params: [],
    example: `curl -H "X-API-Key: your-key" \  "https://memorix.vercel.app/api/v1/categories"`,
    response: `{
  "data": [
    { "name": "Quotes", "slug": "quotes", "description": "...", "contentCount": 4821 }
  ],
  "contentStats": [{ "name": "quotes", "count": 4821 }]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/philosophers",
    description: "Browse philosopher profiles.",
    params: [
      { name: "era", type: "string", desc: "Filter by era (Ancient, Medieval, Modern)" },
      { name: "page", type: "number", desc: "Page number" },
      { name: "limit", type: "number", desc: "Items per page" },
    ],
    example: `curl -H "X-API-Key: your-key" \  "https://memorix.vercel.app/api/v1/philosophers?era=Ancient"`,
    response: `{
  "data": [
    {
      "id": "...",
      "name": "Socrates",
      "era": "Ancient",
      "nationality": "Greek",
      "influenceScore": 100
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 87 }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/achievements",
    description: "Browse human achievements.",
    params: [
      { name: "category", type: "string", desc: "Filter by category" },
      { name: "page", type: "number", desc: "Page number" },
      { name: "limit", type: "number", desc: "Items per page" },
    ],
    example: `curl -H "X-API-Key: your-key" \  "https://memorix.vercel.app/api/v1/achievements"`,
    response: `{
  "data": [
    {
      "id": "...",
      "title": "First Moon Landing",
      "person": "Neil Armstrong",
      "year": 1969,
      "impactScore": 100
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/history/today",
    description: "Get historical events that happened on this day.",
    params: [],
    example: `curl -H "X-API-Key: your-key" \  "https://memorix.vercel.app/api/v1/history/today"`,
    response: `{
  "data": [
    {
      "id": "...",
      "title": "Declaration of Independence",
      "date": "July 4, 1776",
      "year": 1776,
      "description": "..."
    }
  ],
  "meta": { "day": 4, "month": 7, "count": 12 }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/memes",
    description: "Browse meme gallery.",
    params: [
      { name: "category", type: "string", desc: "Filter by category" },
      { name: "page", type: "number", desc: "Page number" },
      { name: "limit", type: "number", desc: "Items per page" },
    ],
    example: `curl -H "X-API-Key: your-key" \  "https://memorix.vercel.app/api/v1/memes?limit=10"`,
    response: `{
  "data": [
    {
      "id": "...",
      "imageUrl": "https://...",
      "caption": "When the code works on first try",
      "tags": ["programming", "relatable"],
      "popularity": 892
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/health",
    description: "Check API health and get content stats.",
    params: [],
    example: `curl "https://memorix.vercel.app/api/v1/health"`,
    response: `{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-07-24T12:00:00Z",
  "stats": {
    "content": 15000,
    "philosophers": 87,
    "achievements": 234,
    "historicalEvents": 1200,
    "memes": 500
  }
}`,
  },
];

function EndpointCard({ endpoint, index }: { endpoint: typeof endpoints[0]; index: number }) {
  const [copied, setCopied] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodColors: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="content-card"
    >
      <div className="flex items-start gap-3 mb-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${methodColors[endpoint.method] || methodColors.GET}`}>
          {endpoint.method}
        </span>
        <code className="text-sm font-mono text-[var(--text-primary)] break-all">{endpoint.path}</code>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-4">{endpoint.description}</p>

      {endpoint.params.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Query Parameters</h4>
          <div className="space-y-1.5">
            {endpoint.params.map((p) => (
              <div key={p.name} className="flex items-start gap-2 text-sm">
                <code className="text-[var(--accent)] font-mono text-xs shrink-0">{p.name}</code>
                <span className="text-[var(--text-muted)] text-xs">({p.type})</span>
                <span className="text-[var(--text-secondary)]">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Example Request</span>
            <button
              onClick={() => handleCopy(endpoint.example)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="code-block text-xs overflow-x-auto">{endpoint.example}</pre>
        </div>

        <div>
          <button
            onClick={() => setShowResponse(!showResponse)}
            className="text-xs font-semibold text-[var(--accent)] hover:underline mb-1.5"
          >
            {showResponse ? "Hide" : "Show"} Response
          </button>
          {showResponse && (
            <pre className="code-block text-xs overflow-x-auto">{endpoint.response}</pre>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "endpoints" | "auth" | "limits">("overview");

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BookOpen },
    { id: "endpoints" as const, label: "Endpoints", icon: Terminal },
    { id: "auth" as const, label: "Authentication", icon: Key },
    { id: "limits" as const, label: "Rate Limits", icon: Zap },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--accent-glow)]">
              <Code2 size={28} className="text-white" />
            </div>
            <h1 className="section-title mb-3">API Documentation</h1>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              Integrate Memorix into your applications with our simple, powerful REST API.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]"
                      : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Globe size={18} className="text-[var(--accent)]" />
                  Base URL
                </h3>
                <code className="code-block">https://memorix.vercel.app/api/v1</code>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-3">Getting Started</h3>
                <ol className="space-y-3 text-sm text-[var(--text-secondary)] list-decimal list-inside">
                  <li>Get a free API key by using any key starting with <code className="text-[var(--accent)]">mx_</code> followed by random characters.</li>
                  <li>Include your key in the <code className="text-[var(--accent)]">X-API-Key</code> header.</li>
                  <li>Make requests to any endpoint. 100 requests per minute free.</li>
                  <li>Explore categories, search content, or get daily featured items.</li>
                </ol>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Content Pieces", value: "15,000+", icon: BookOpen },
                  { label: "Philosophers", value: "87", icon: Brain },
                  { label: "Uptime", value: "99.9%", icon: Zap },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="glass-card p-5 text-center">
                      <Icon size={20} className="text-[var(--accent)] mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "endpoints" && (
            <div className="space-y-4">
              {endpoints.map((ep, i) => (
                <EndpointCard key={ep.path} endpoint={ep} index={i} />
              ))}
            </div>
          )}

          {activeTab === "auth" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Key size={18} className="text-[var(--accent)]" />
                  API Key Authentication
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  All API requests require an API key in the <code className="text-[var(--accent)]">X-API-Key</code> header.
                </p>
                <div className="code-block text-sm">
                  <span className="comment"># Example header</span><br />
                  X-API-Key: mx_your_api_key_here
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-3">Free Tier Key</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Generate your own free key by prefixing with <code className="text-[var(--accent)]">mx_</code> and adding random characters. Example:
                </p>
                <div className="code-block text-sm">mx_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6</div>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Shield size={18} className="text-[var(--accent)]" />
                  Admin Access
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Admin endpoints require the Aevibron master key. These endpoints are used for content management and analytics.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "limits" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4">Rate Limits</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-color)]">
                        <th className="text-left py-3 px-4 text-[var(--text-muted)] font-semibold">Tier</th>
                        <th className="text-left py-3 px-4 text-[var(--text-muted)] font-semibold">Limit</th>
                        <th className="text-left py-3 px-4 text-[var(--text-muted)] font-semibold">Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border-color)]">
                        <td className="py-3 px-4 font-medium">Free</td>
                        <td className="py-3 px-4 text-[var(--text-secondary)]">100 requests / minute</td>
                        <td className="py-3 px-4 text-[var(--text-secondary)]">All read endpoints</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-[var(--accent)]">Aevibron</td>
                        <td className="py-3 px-4 text-[var(--text-secondary)]">Unlimited</td>
                        <td className="py-3 px-4 text-[var(--text-secondary)]">Full access + admin</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-3">Rate Limit Headers</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Every response includes headers showing your current rate limit status.
                </p>
                <div className="code-block text-sm">
                  X-RateLimit-Remaining: 87<br />
                  X-RateLimit-Reset: 1721823600000
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
