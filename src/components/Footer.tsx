"use client";

import Link from "next/link";
import { Heart, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
                <span className="text-white font-bold text-xs">Mx</span>
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
                <Github size={16} />
              </a>
              <a href="https://whatsapp.com/channel/0029Vb7IABxCXC3J7ZFFsk2h" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all">
                <Mail size={16} />
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
