"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/philosophers", label: "Philosophers" },
  { href: "/achievements", label: "Achievements" },
  { href: "/history", label: "History" },
  { href: "/memes", label: "Memes" },
  { href: "/depression-hope", label: "Hope" },
  { href: "/api-docs", label: "API" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 nav-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-[var(--accent)]/20 group-hover:ring-[var(--accent)]/50 transition-all">
              <img
                src="/icons/logo.png"
                alt="Memorix"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight">Memorix</span>
              <span className="text-[10px] text-[var(--text-muted)] -mt-0.5 tracking-widest uppercase">By Aevibron</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group/link"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 rounded-xl bg-[var(--accent)]/0 group-hover/link:bg-[var(--accent)]/10 transition-all" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
              title="Search"
            >
              <Search size={17} />
            </Link>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border-color)] px-4 py-3 space-y-1 bg-[var(--bg-primary)]/95 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
            >
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="pt-2 sm:hidden">
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
