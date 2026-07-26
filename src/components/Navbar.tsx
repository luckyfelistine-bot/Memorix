"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, BookOpen, Heart, Brain, History, Trophy, Image, Code, Shield } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/explore", label: "Explore", icon: BookOpen },
  { href: "/philosophers", label: "Philosophers", icon: Brain },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/history", label: "History", icon: History },
  { href: "/memes", label: "Memes", icon: Image },
  { href: "/depression-hope", label: "Hope", icon: Heart },
  { href: "/api-docs", label: "API", icon: Code },
  { href: "/admin", label: "Admin", icon: Shield },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-[var(--border-color)] mx-4 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">Mx</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight">Memorix</span>
              <span className="text-[10px] text-[var(--text-muted)] -mt-0.5 tracking-widest uppercase">By Aevibron</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
              title="Search"
            >
              <Search size={18} />
            </Link>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border-color)] px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 sm:hidden">
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
