"use client";

import Link from "next/link";
import { BookOpen, Heart, Brain, Trophy, History, Image, Code, Sparkles, Zap, Music, Plane, Coffee, Gamepad2, Lightbulb, FlaskConical, TrendingUp, Calendar, MessageCircle, Dumbbell, GraduationCap, Wallet, TreePine, Baby, Compass, PenTool, Film, Puzzle } from "lucide-react";

const categories = [
  { name: "Quotes", slug: "quotes", icon: BookOpen, color: "#6366f1", desc: "Wisdom from ages" },
  { name: "Relationships", slug: "relationships", icon: Heart, color: "#ec4899", desc: "Love & connection" },
  { name: "Philosophy", slug: "philosophy", icon: Brain, color: "#8b5cf6", desc: "Deep thoughts" },
  { name: "Achievements", slug: "achievements", icon: Trophy, color: "#f59e0b", desc: "Human greatness" },
  { name: "History", slug: "history", icon: History, color: "#ef4444", desc: "This day in time" },
  { name: "Memes", slug: "memes", icon: Image, color: "#10b981", desc: "Laugh out loud" },
  { name: "Technology", slug: "technology", icon: Code, color: "#06b6d4", desc: "Code & innovation" },
  { name: "Inspiration", slug: "inspiration", icon: Sparkles, color: "#f97316", desc: "Daily motivation" },
  { name: "Fun Facts", slug: "knowledge", icon: Zap, color: "#eab308", desc: "Expand your mind" },
  { name: "Music", slug: "entertainment", icon: Music, color: "#d946ef", desc: "Songs & playlists" },
  { name: "Travel", slug: "travel", icon: Plane, color: "#0ea5e9", desc: "Explore the world" },
  { name: "Lifestyle", slug: "lifestyle", icon: Coffee, color: "#84cc16", desc: "Live better" },
  { name: "Games", slug: "games", icon: Gamepad2, color: "#a855f7", desc: "Play & compete" },
  { name: "Creativity", slug: "creativity", icon: Lightbulb, color: "#f43f5e", desc: "Create & imagine" },
  { name: "Science", slug: "knowledge", icon: FlaskConical, color: "#14b8a6", desc: "Discover & learn" },
  { name: "Productivity", slug: "productivity", icon: TrendingUp, color: "#22c55e", desc: "Achieve more" },
  { name: "Events", slug: "events", icon: Calendar, color: "#fb923c", desc: "Celebrate life" },
  { name: "Social", slug: "social", icon: MessageCircle, color: "#38bdf8", desc: "Captions & posts" },
  { name: "Wellness", slug: "health-wellness", icon: Dumbbell, color: "#4ade80", desc: "Mind & body" },
  { name: "Education", slug: "education", icon: GraduationCap, color: "#818cf8", desc: "Learn & grow" },
  { name: "Finance", slug: "finance", icon: Wallet, color: "#34d399", desc: "Wealth & budget" },
  { name: "Nature", slug: "pets-nature", icon: TreePine, color: "#65a30d", desc: "Earth & wildlife" },
  { name: "Family", slug: "kids-family", icon: Baby, color: "#f472b6", desc: "Parenting & home" },
  { name: "Stories", slug: "stories", icon: Compass, color: "#c084fc", desc: "Tales & fiction" },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.slug + cat.name}
            href={`/explore?category=${cat.slug}`}
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-all hover:-translate-y-1"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: cat.color + "20", color: cat.color }}
            >
              <Icon size={20} />
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)] text-center">{cat.name}</span>
            <span className="text-[10px] text-[var(--text-muted)] text-center">{cat.desc}</span>
          </Link>
        );
      })}
    </div>
  );
}
