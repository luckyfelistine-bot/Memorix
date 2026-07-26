"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Flame, Sparkles } from "lucide-react";

const themes = [
  { id: "midnight" as const, icon: Moon, label: "Midnight" },
  { id: "aurora" as const, icon: Sparkles, label: "Aurora" },
  { id: "ember" as const, icon: Flame, label: "Ember" },
  { id: "serenity" as const, icon: Sun, label: "Serenity" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-[var(--bg-elevated)] rounded-full p-1 border border-[var(--border-color)]">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isActive
                ? "bg-[var(--accent)] text-white shadow-lg"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            title={t.label}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
