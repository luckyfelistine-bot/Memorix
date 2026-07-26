"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, Calendar, Clock, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

interface HistoricalEvent {
  id: string;
  title: string;
  date: string;
  year: number;
  description: string;
  category: string;
  significance: string | null;
}

export default function HistoryPage() {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    fetch("/api/v1/history/today")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/20">
              <History size={28} className="text-white" />
            </div>
            <h1 className="section-title mb-2">This Day in History</h1>
            <p className="text-[var(--text-secondary)]">
              {monthNames[today.getMonth()]} {today.getDate()} — Events that shaped the world.
            </p>
          </motion.div>

          {/* Date display */}
          <div className="glass-card p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Calendar size={20} className="text-[var(--accent)]" />
              <span className="text-2xl font-bold">{monthNames[today.getMonth()]} {today.getDate()}</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              {events.length} historical events recorded for this date
            </p>
          </div>

          {/* Events */}
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="content-card animate-pulse h-32" />
                ))
              : events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="content-card flex items-start gap-4"
                  >
                    <div className="shrink-0 w-20 text-center">
                      <div className="text-2xl font-bold text-[var(--accent)]">{event.year}</div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{event.category}</div>
                    </div>
                    <div className="w-px h-full bg-[var(--border-color)] self-stretch" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">{event.description}</p>
                      {event.significance && (
                        <p className="text-xs text-[var(--text-muted)] italic">
                          <Clock size={10} className="inline mr-1" />
                          {event.significance}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
          </div>

          {events.length === 0 && !loading && (
            <div className="text-center py-20 text-[var(--text-muted)]">
              <History size={48} className="mx-auto mb-4 opacity-50" />
              <p>No historical events found for today. Check back tomorrow!</p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
