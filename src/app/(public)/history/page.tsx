"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin } from "lucide-react";

interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  year: number;
  month: number;
  day: number;
  category: string;
  significance?: string | null;
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
            <CalendarDays className="w-5 h-5 text-cyan-400" />
          </div>
          <h1 className="section-title">This Day in History</h1>
        </div>
        <p className="section-subtitle">Events that shaped the world on {monthNames[today.getMonth()]} {today.getDate()}.</p>
      </motion.div>

      {/* Date Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6 mb-10 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-sm text-[var(--text-secondary)]">Today</span>
        </div>
        <div className="text-4xl sm:text-5xl font-bold text-gradient" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {monthNames[today.getMonth()]} {today.getDate()}
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {events.length} historical events recorded for this date
        </p>
      </motion.div>

      {/* Events */}
      {events.length > 0 ? (
        <div className="space-y-5">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="content-card"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/10 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-cyan-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {event.year}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-ghost text-[0.65rem]">{event.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{event.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{event.description}</p>
                  {event.significance && (
                    <div className="mt-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                      <p className="text-xs text-cyan-300/80 flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        {event.significance}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : !loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CalendarDays className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No events found</h3>
          <p className="text-sm text-[var(--text-muted)]">No historical events recorded for today yet. Check back tomorrow!</p>
        </div>
      ) : null}

      {loading && (
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="skeleton h-16 w-16 rounded-2xl" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-12 rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
