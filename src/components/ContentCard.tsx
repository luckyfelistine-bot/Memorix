"use client";

import { Copy, Check, Heart, Share2, Quote } from "lucide-react";
import { useState } from "react";

interface ContentCardProps {
  id: string;
  body: string;
  title?: string | null;
  author?: string | null;
  category: string;
  subcategory?: string | null;
  tags?: string[];
  mood?: string | null;
  popularity?: number;
}

const categoryColors: Record<string, string> = {
  quotes: "#8b7cf7",
  relationships: "#ec4899",
  wisdom: "#f59e0b",
  fun: "#22c55e",
  brain: "#06b6d4",
  stories: "#a855f7",
  entertainment: "#ef4444",
  lifestyle: "#84cc16",
  games: "#d946ef",
  creativity: "#f97316",
  knowledge: "#eab308",
  productivity: "#14b8a6",
  events: "#fb923c",
  social: "#38bdf8",
  "health-wellness": "#4ade80",
  education: "#818cf8",
  finance: "#34d399",
  travel: "#0ea5e9",
  technology: "#6366f1",
  "pets-nature": "#65a30d",
  "kids-family": "#f472b6",
  inspiration: "#c084fc",
  media: "#f43f5e",
  "mental-health": "#ec4899",
  memes: "#10b981",
  philosophy: "#8b5cf6",
};

export default function ContentCard({ body, title, author, category, subcategory, tags, mood }: ContentCardProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const color = categoryColors[category] || "#8b7cf7";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: body, title: title || "Memorix" });
    } else {
      await navigator.clipboard.writeText(body);
    }
  };

  return (
    <div className="content-card group">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full border"
            style={{ backgroundColor: color + "15", color: color, borderColor: color + "25" }}
          >
            {category}
          </span>
          {subcategory && (
            <span className="text-[11px] px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-color)]">
              {subcategory}
            </span>
          )}
          {mood && (
            <span className="text-[11px] px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
              {mood}
            </span>
          )}
        </div>
      </div>

      {title && <h3 className="font-semibold text-base mb-3 text-[var(--text-primary)]">{title}</h3>}

      <div className="relative">
        <Quote size={28} className="absolute -top-1 -left-1 opacity-10" style={{ color }} />
        <p className="quote-body pl-6 text-[var(--text-primary)]">{body}</p>
      </div>

      {author && (
        <p className="mt-4 text-sm text-[var(--text-muted)] italic pl-6 font-light tracking-wide">— {author}</p>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pl-6">
          {tags.slice(0, 5).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-color)]">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            liked ? "text-red-400 bg-red-500/10" : "text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10"
          }`}
        >
          <Heart size={13} className={liked ? "fill-red-400" : ""} />
          {liked ? "Liked" : "Like"}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
        >
          <Share2 size={13} />
          Share
        </button>
      </div>
    </div>
  );
}
