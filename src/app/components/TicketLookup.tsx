import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Search, MessageSquare, ArrowLeft, Clock, CheckCircle, Loader, AlertCircle } from "lucide-react";
import { getTickets, getTicketNotes, Ticket, TicketNote } from "../ticketStore";

const STATUS_CONFIG = {
  new:           { label: "New",         color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)",  icon: <Clock size={14} /> },
  "in-progress": { label: "In Progress", color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)",  icon: <Loader size={14} /> },
  resolved:      { label: "Resolved",    color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)",  icon: <CheckCircle size={14} /> },
};

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now"; if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const E = [0.16, 1, 0.3, 1] as const;

export function TicketLookup() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("id") || "");
  const [ticket, setTicket] = useState<Ticket | null | undefined>(undefined);
  const [notes, setNotes] = useState<TicketNote[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      const all = getTickets();
      const found = all.find(t => t.id === id.toUpperCase()) ?? null;
      setTicket(found);
      setNotes(found ? getTicketNotes(found.id).filter(n => !n.internal) : []);
      setSearched(true);
    }
  }, []);

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    const id = query.trim().toUpperCase();
    const all = getTickets();
    const found = all.find(t => t.id === id) ?? null;
    setTicket(found);
    setNotes(found ? getTicketNotes(found.id).filter(n => !n.internal) : []);
    setSearched(true);
  };

  const status = ticket ? STATUS_CONFIG[ticket.status] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#060609", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px 80px" }}>

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(79,117,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Back link */}
      <div style={{ width: "100%", maxWidth: 600, paddingTop: 40, marginBottom: 48 }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#404070", fontSize: 13, fontFamily: "Inter", textDecoration: "none", transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#8aa8ff"}
          onMouseLeave={e => e.currentTarget.style.color = "#404070"}>
          <ArrowLeft size={13} /> Back to site
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: E }}
        style={{ width: "100%", maxWidth: 600 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6b8fff, #4f75ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(79,117,255,0.35)" }}>
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 6 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <h1 style={{ fontFamily: "Manrope", fontSize: "1.6rem", margin: 0 }}>Track your ticket</h1>
            <p style={{ color: "#505080", fontSize: 13, fontFamily: "Inter", margin: 0 }}>Enter your ticket ID to check status and view replies.</p>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={lookup} style={{ display: "flex", gap: 10, marginBottom: 32 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#404070", pointerEvents: "none" }} />
            <input
              autoFocus
              placeholder="e.g. TKT-MPZ95UKT"
              value={query}
              onChange={e => { setQuery(e.target.value.toUpperCase()); setSearched(false); }}
              style={{ width: "100%", background: "rgba(12,12,22,0.9)", border: "1px solid rgba(79,117,255,0.14)", borderRadius: 12, padding: "13px 16px 13px 42px", color: "#eaeaff", fontSize: 14, outline: "none", fontFamily: "Inter", boxSizing: "border-box", letterSpacing: "0.04em", transition: "border-color 0.15s" }}
              onFocus={e => e.target.style.borderColor = "rgba(79,117,255,0.45)"}
              onBlur={e => e.target.style.borderColor = "rgba(79,117,255,0.14)"}
            />
          </div>
          <button type="submit"
            style={{ background: "#4f75ff", color: "#fff", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Inter", boxShadow: "0 0 24px rgba(79,117,255,0.35)", whiteSpace: "nowrap", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#3d62ff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#4f75ff"; e.currentTarget.style.transform = ""; }}>
            Look up
          </button>
        </form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searched && (
            <motion.div key={ticket?.id ?? "not-found"} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: E }}>
              {!ticket ? (
                <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(12,12,22,0.8)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 20 }}>
                  <AlertCircle size={28} style={{ color: "#ef444450", margin: "0 auto 14px", display: "block" }} />
                  <p style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1rem", color: "#eaeaff", marginBottom: 8 }}>Ticket not found</p>
                  <p style={{ color: "#505080", fontSize: 13, fontFamily: "Inter" }}>Double-check the ID from your confirmation. IDs are case-sensitive and look like <span style={{ color: "#4f75ff", fontFamily: "monospace" }}>TKT-XXXXXXXX</span>.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Ticket card */}
                  <div style={{ background: "rgba(12,12,22,0.9)", border: "1px solid rgba(79,117,255,0.14)", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 60px rgba(79,117,255,0.05)" }}>

                    {/* Status bar */}
                    <div style={{ background: status!.bg, borderBottom: `1px solid ${status!.border}`, padding: "12px 24px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: status!.color }}>{status!.icon}</span>
                      <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 13, color: status!.color }}>{status!.label}</span>
                      <span style={{ color: status!.color, opacity: 0.4, fontSize: 12 }}>·</span>
                      <span style={{ fontFamily: "Inter", fontSize: 12, color: status!.color, opacity: 0.7 }}>
                        {ticket.status === "new" ? "Our team will review your ticket shortly." : ticket.status === "in-progress" ? "We're actively working on your request." : "This ticket has been resolved."}
                      </span>
                    </div>

                    <div style={{ padding: "24px" }}>
                      {/* ID + discord */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                        <div>
                          <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 4 }}>Ticket ID</p>
                          <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: "#4f75ff" }}>{ticket.id}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 4 }}>Submitted</p>
                          <span style={{ fontFamily: "Inter", fontSize: 13, color: "#7070a0" }}>{fmt(ticket.createdAt)}</span>
                        </div>
                      </div>

                      {/* Details grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                        {[["Discord", ticket.discord], ["Service", ticket.service || "—"], ["Budget", ticket.budget || "—"]].map(([l, v]) => (
                          <div key={l} style={{ background: "rgba(79,117,255,0.04)", border: "1px solid rgba(79,117,255,0.08)", borderRadius: 10, padding: "12px 14px" }}>
                            <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 4 }}>{l}</p>
                            <p style={{ color: "#9090b8", fontSize: 13, fontFamily: "Inter", fontWeight: 500 }}>{v}</p>
                          </div>
                        ))}
                      </div>

                      {/* Message */}
                      {ticket.message && (
                        <div style={{ background: "rgba(79,117,255,0.04)", border: "1px solid rgba(79,117,255,0.08)", borderRadius: 10, padding: "14px 16px" }}>
                          <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 8 }}>Your message</p>
                          <p style={{ color: "#9090b8", fontSize: 13, lineHeight: 1.75, fontFamily: "Inter" }}>{ticket.message}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Staff replies */}
                  {notes.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
                      style={{ background: "rgba(12,12,22,0.9)", border: "1px solid rgba(79,117,255,0.14)", borderRadius: 20, padding: "24px" }}>
                      <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 16 }}>Replies from our team</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {notes.map(note => (
                          <div key={note.id} style={{ background: "rgba(79,117,255,0.05)", border: "1px solid rgba(79,117,255,0.1)", borderRadius: 12, padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(79,117,255,0.15)", border: "1px solid rgba(79,117,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 6 5-6" stroke="#8aa8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </div>
                              <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 13, color: "#c0c0e0", textTransform: "capitalize" }}>Vertuoso Team</span>
                              <span style={{ fontFamily: "Inter", fontSize: 11, color: "#303060", marginLeft: "auto" }}>{timeAgo(note.createdAt)}</span>
                            </div>
                            <p style={{ fontFamily: "Inter", fontSize: 13, color: "#9090b8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{note.body}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* No replies yet */}
                  {notes.length === 0 && ticket.status === "new" && (
                    <div style={{ textAlign: "center", padding: "20px", background: "rgba(12,12,22,0.6)", border: "1px solid rgba(79,117,255,0.07)", borderRadius: 14 }}>
                      <p style={{ color: "#404070", fontSize: 13, fontFamily: "Inter" }}>No replies yet — our team will respond soon. Check back here anytime using your ticket ID.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
