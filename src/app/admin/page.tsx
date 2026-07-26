"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Lock, BarChart3, FileText, Key, LogOut, Loader2,
  TrendingUp, Users, Database, Activity, Trash2, Plus, Search,
  Eye, RefreshCw, CheckCircle, AlertCircle
} from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";

interface AnalyticsData {
  totals: { content: number; philosophers: number; achievements: number; historicalEvents: number; memes: number };
  activity: { dailyRequests: number; weeklyRequests: number };
  topEndpoints: { endpoint: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
}

interface ContentItem {
  id: string;
  title: string | null;
  body: string;
  category: string;
  author: string | null;
  popularity: number;
  createdAt: string;
}

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--accent-glow)]">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
            Memorix Administration Panel
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full memorix-btn memorix-btn-primary justify-center"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
          <p className="text-xs text-[var(--text-muted)] text-center mt-6">
            Built by Aevibron — Memorix Admin
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="content-card">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "20", color }}>
          <Icon size={20} />
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
    </div>
  );
}

function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/analytics", {
        
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!data) return <div className="text-center py-20 text-[var(--text-muted)]">Failed to load analytics</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Dashboard Overview</h2>
        <button onClick={fetchAnalytics} className="memorix-btn memorix-btn-secondary text-xs">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Content" value={data.totals.content.toLocaleString()} icon={Database} color="#6366f1" />
        <StatCard label="Philosophers" value={data.totals.philosophers} icon={Users} color="#8b5cf6" />
        <StatCard label="Achievements" value={data.totals.achievements} icon={TrendingUp} color="#f59e0b" />
        <StatCard label="History Events" value={data.totals.historicalEvents.toLocaleString()} icon={Activity} color="#ef4444" />
        <StatCard label="Memes" value={data.totals.memes} icon={FileText} color="#10b981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="content-card">
          <h3 className="font-bold mb-4">Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Daily Requests</span>
              <span className="font-bold">{data.activity.dailyRequests.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
              <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${Math.min(data.activity.dailyRequests / 100, 100)}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Weekly Requests</span>
              <span className="font-bold">{data.activity.weeklyRequests.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(data.activity.weeklyRequests / 700, 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3 className="font-bold mb-4">Top Endpoints</h3>
          <div className="space-y-2">
            {data.topEndpoints.map((ep) => (
              <div key={ep.endpoint} className="flex items-center justify-between py-2 border-b border-[var(--border-color)] last:border-0">
                <code className="text-xs text-[var(--accent)]">{ep.endpoint}</code>
                <span className="text-sm font-medium">{ep.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-card">
        <h3 className="font-bold mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.categoryBreakdown.map((cat) => (
            <div key={cat.category} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-elevated)]">
              <span className="text-sm capitalize">{cat.category}</span>
              <span className="text-xs font-bold text-[var(--accent)]">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentTab() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchContent = async (p: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/content?page=${p}&limit=50`, {
        
      });
      const json = await res.json();
      setItems(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this content?")) return;
    try {
      await fetch(`/api/v1/admin/content?id=${id}`, {
        method: "DELETE",
        
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = items.filter((i) =>
    i.body.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Content Management</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search content..."
              className="h-10 pl-9 pr-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] w-full sm:w-64"
            />
          </div>
          <button onClick={() => fetchContent()} className="memorix-btn memorix-btn-secondary text-xs">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left py-3 px-4 text-[var(--text-muted)] font-semibold">Content</th>
                <th className="text-left py-3 px-4 text-[var(--text-muted)] font-semibold">Category</th>
                <th className="text-left py-3 px-4 text-[var(--text-muted)] font-semibold">Author</th>
                <th className="text-left py-3 px-4 text-[var(--text-muted)] font-semibold">Popularity</th>
                <th className="text-right py-3 px-4 text-[var(--text-muted)] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-elevated)]/50 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <p className="truncate text-[var(--text-primary)]">{item.body}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent)]">{item.category}</span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{item.author || "—"}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{item.popularity}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function KeysTab() {
  const [key, setKey] = useState("");
  const [copied, setCopied] = useState(false);

  const generateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let k = "mx_";
    for (let i = 0; i < 32; i++) k += chars.charAt(Math.floor(Math.random() * chars.length));
    setKey(k);
  };

  const copyKey = async () => {
    if (!key) return;
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">API Key Management</h2>

      <div className="content-card">
        <h3 className="font-bold mb-3">Generate Free API Key</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Create a new API key for developers. Keys starting with <code className="text-[var(--accent)]">mx_</code> are automatically validated.
        </p>
        <div className="flex items-center gap-3">
          <button onClick={generateKey} className="memorix-btn memorix-btn-primary">
            <Key size={16} />
            Generate Key
          </button>
          {key && (
            <button onClick={copyKey} className="memorix-btn memorix-btn-secondary">
              {copied ? <CheckCircle size={16} /> : <Key size={16} />}
              {copied ? "Copied" : "Copy Key"}
            </button>
          )}
        </div>
        {key && (
          <div className="mt-4 code-block text-sm break-all">{key}</div>
        )}
      </div>

      <div className="content-card">
        <h3 className="font-bold mb-3">Aevibron Master Key</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          The Aevibron key has unlimited access and admin privileges. Set via <code className="text-[var(--accent)]">AEVIBRON_API_KEY</code> environment variable.
        </p>
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Shield size={14} className="text-[var(--accent)]" />
          <span>Current admin password: Set via ADMIN_PASSWORD env var</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"analytics" | "content" | "keys">("analytics");

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  const tabs = [
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "content" as const, label: "Content", icon: FileText },
    { id: "keys" as const, label: "API Keys", icon: Key },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        {/* Admin Header */}
        <div className="border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold">Memorix Admin</h1>
                <p className="text-[10px] text-[var(--text-muted)]">Built by Aevibron</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
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

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "analytics" && <AnalyticsTab />}
              {activeTab === "content" && <ContentTab />}
              {activeTab === "keys" && <KeysTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ThemeProvider>
  );
}
