"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function SearchBar({ placeholder = "Search quotes, philosophers, facts...", size = "md", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const sizeClasses = {
    sm: "h-10 text-sm px-4",
    md: "h-12 text-base px-5",
    lg: "h-14 text-lg px-6",
  };

  const iconSizes = { sm: 16, md: 18, lg: 20 };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Search size={iconSizes[size]} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${sizeClasses[size]} pl-12 pr-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all`}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
      >
        <ArrowRight size={iconSizes[size] - 2} />
      </button>
    </form>
  );
}
