"use client";

import Link from "next/link";
import { Sparkles, Github, Twitter, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Memorix
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              The Living Matrix of Human Memory. Every word ever spoken, every hope,
              every tear, every laugh — archived and accessible. Built by Aevibron.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              Explore
            </h4>
            <div className="flex flex-col gap-2.5">
              {["Home", "Explore", "Search", "Philosophers", "Achievements", "History", "Memes"].map((l) => (
                <Link
                  key={l}
                  href={l === "Home" ? "/" : `/${l.toLowerCase()}`}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* API */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              Developers
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/api-docs" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                API Documentation
              </Link>
              <Link href="/admin" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://github.com/luckyfelistine-bot/Memorix" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/[0.03] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/[0.03] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="fancy-divider my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <span>© 2026 Memorix. Built by Aevibron.</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> for humanity
          </span>
        </div>
      </div>
    </footer>
  );
}
