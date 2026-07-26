"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-[var(--accent)]/20">
                <img src="/icons/logo.png" alt="Memorix" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg">Memorix</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-md">
              The Living Matrix of Human Memory. Every word ever spoken, every hope, every tear, every laugh — archived and accessible through a powerful API. Built with love by Aevibron.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[var(--text-primary)]">Explore</h4>
            <ul className="space-y-2.5">
              {["Quotes", "Philosophers", "Achievements", "History", "Memes", "API Docs"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(" ", "-")}`} className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[var(--text-primary)]">Connect</h4>
            <div className="flex items-center gap-3 mb-4">
              <a href="https://github.com/luckyfelistine-bot/Memorix" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Built by Aevibron<br />
              Where Memory Becomes Infinite
            </p>
          </div>
        </div>
        <div className="border-t border-[var(--border-color)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Memorix. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> by Aevibron
          </p>
        </div>
      </div>
    </footer>
  );
}
