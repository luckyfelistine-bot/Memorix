"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";

const categories = [
  { name: "Quotes", icon: "✦", color: "#a78bfa" },
  { name: "Wisdom", icon: "◈", color: "#22d3ee" },
  { name: "Philosophy", icon: "◉", color: "#c084fc" },
  { name: "Inspiration", icon: "✧", color: "#fb923c" },
  { name: "Relationships", icon: "♥", color: "#f472b6" },
  { name: "Mental Health", icon: "◐", color: "#22d3ee" },
  { name: "Stories", icon: "◊", color: "#fb923c" },
  { name: "Fun", icon: "◆", color: "#fbbf24" },
  { name: "Memes", icon: "◇", color: "#facc15" },
  { name: "Knowledge", icon: "◆", color: "#2dd4bf" },
  { name: "Productivity", icon: "◈", color: "#818cf8" },
  { name: "Lifestyle", icon: "✦", color: "#60a5fa" },
  { name: "Technology", icon: "◉", color: "#a78bfa" },
  { name: "Travel", icon: "✧", color: "#2dd4bf" },
  { name: "Health", icon: "◐", color: "#4ade80" },
  { name: "Creativity", icon: "◊", color: "#f87171" },
  { name: "Education", icon: "◆", color: "#38bdf8" },
  { name: "Finance", icon: "◇", color: "#fbbf24" },
];

export default function MarqueeCategories() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleClick = (cat: string) => {
    router.push(`/explore?category=${encodeURIComponent(cat.toLowerCase())}`);
  };

  const doubled = [...categories, ...categories];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Browse Categories
          </h3>
          <span className="text-xs text-[var(--text-muted)]">Swipe to explore</span>
        </div>
      </div>
      <div
        className="marquee-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className="marquee-track"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {doubled.map((cat, i) => (
            <button
              key={`${cat.name}-${i}`}
              onClick={() => handleClick(cat.name)}
              className="category-pill group"
              style={{
                borderColor: "var(--border-color)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = cat.color;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 25px ${cat.color}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <span style={{ color: cat.color }}>{cat.icon}</span>
              <span className="group-hover:text-white transition-colors">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
