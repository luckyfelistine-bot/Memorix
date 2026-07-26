"use client";

import { Copy, Check, Heart, Share2 } from "lucide-react";
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

export default function ContentCard({ body, title, author, category, subcategory, tags, mood }: ContentCardProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

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
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)]/20">
            {category}
          </span>
          {subcategory && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-color)]">
              {subcategory}
            </span>
          )}
          {mood && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
              {mood}
            </span>
          )}
        </div>
      </div>

      {title && <h3 className="font-semibold text-lg mb-2 text-[var(--text-primary)]">{title}</h3>}

      <div className="relative">
        <span className="quote-mark absolute -top-2 -left-1">&ldquo;</span>
        <p className="text-[var(--text-primary)] leading-relaxed pl-6 text-[15px]">{body}</p>
      </div>

      {author && (
        <p className="mt-3 text-sm text-[var(--text-muted)] italic pl-6">— {author}</p>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pl-6">
          {tags.slice(0, 5).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)]">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity">
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
            liked ? "text-red-500 bg-red-500/10" : "text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10"
          }`}
        >
          <Heart size={13} className={liked ? "fill-red-500" : ""} />
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
