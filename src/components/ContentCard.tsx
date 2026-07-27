"use client";

import { Heart, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ContentItem {
  id: string;
  title?: string | null;
  body: string;
  category: string;
  subcategory?: string | null;
  tags?: string[];
  mood?: string | null;
  theme?: string | null;
  occasion?: string | null;
  author?: string | null;
  popularity?: number;
  likes?: number;
  createdAt?: string;
}

function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    quotes: "#a78bfa",
    relationships: "#f472b6",
    wisdom: "#22d3ee",
    fun: "#fbbf24",
    "brain-teasers": "#34d399",
    stories: "#fb923c",
    entertainment: "#e879f9",
    lifestyle: "#60a5fa",
    games: "#a3e635",
    creativity: "#f87171",
    knowledge: "#2dd4bf",
    productivity: "#818cf8",
    events: "#facc15",
    "social-media": "#c084fc",
    "health-wellness": "#4ade80",
    education: "#38bdf8",
    finance: "#fbbf24",
    travel: "#2dd4bf",
    technology: "#a78bfa",
    "pets-nature": "#4ade80",
    "kids-family": "#f472b6",
    inspiration: "#fb923c",
    media: "#e879f9",
    "mental-health": "#22d3ee",
    memes: "#facc15",
    philosophy: "#c084fc",
  };
  return map[category.toLowerCase()] || "#a78bfa";
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    quotes: "✦",
    wisdom: "◈",
    philosophy: "◉",
    inspiration: "✧",
    fun: "◆",
    memes: "◇",
    relationships: "♥",
    "mental-health": "◐",
    stories: "◊",
  };
  return icons[category.toLowerCase()] || "◆";
}

export default function ContentCard({ item, index = 0 }: { item: ContentItem; index?: number }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const color = getCategoryColor(item.category);
  const icon = getCategoryIcon(item.category);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: item.body, title: item.title || "Memorix" });
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="content-card group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Category badge */}
      <div className="flex items-center justify-between">
        <div className="badge badge-ghost">
          <span style={{ color }}>{icon}</span>
          <span className="capitalize">{item.category}</span>
        </div>
        {item.subcategory && (
          <span className="text-[0.7rem] text-[var(--text-muted)] uppercase tracking-wider">
            {item.subcategory}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="relative">
        <span className="quote-mark" style={{ color }}>"</span>
        <p className="quote-body pt-6">{item.body}</p>
      </div>

      {/* Author */}
      {item.author && (
        <p className="text-sm text-[var(--text-muted)] italic">— {item.author}</p>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[0.7rem] px-2 py-0.5 rounded-full bg-white/[0.03] text-[var(--text-muted)] border border-[var(--border-color)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 mt-1 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1 text-xs transition-colors ${
              liked ? "text-rose-400" : "text-[var(--text-muted)] hover:text-rose-400"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
            {item.likes || 0}
          </button>
          <span className="text-xs text-[var(--text-muted)]">
            {item.popularity || 0} views
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
            title="Copy"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
