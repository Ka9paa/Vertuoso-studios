import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Ticket, TicketNote, TicketStatus, getTickets, updateTicketStatus, deleteTicket, getTicketNotes, addTicketNote, deleteTicketNote } from "../ticketStore";
import {
  LayoutDashboard, Ticket as TicketIcon, Search, Shield, Users, UserCheck,
  Activity, FileText, Settings, Trash2, ChevronDown, ChevronUp, LogIn, Eye,
  LogOut, RefreshCw, Globe, Bell, Lock, Filter, MessageSquare, ChevronRight,
  Plus, X, Check, Copy, AlertTriangle, ToggleLeft, ToggleRight, Save,
} from "lucide-react";

// ── Role definitions ──────────────────────────────────────────────────────────
type Role = "staff" | "management" | "owner";

const PINS_KEY = "vs_pins";
const DEFAULT_PINS: Record<string, Role> = {
  "staff2025":  "staff",
  "mgmt2025":   "management",
  "owner2025":  "owner",
};

function getPins(): Record<string, Role> {
  try { return JSON.parse(localStorage.getItem(PINS_KEY) || "null") || DEFAULT_PINS; } catch { return DEFAULT_PINS; }
}
function savePins(p: Record<string, Role>) { localStorage.setItem(PINS_KEY, JSON.stringify(p)); }

const ROLE_LABELS: Record<Role, string> = { staff: "Staff Panel", management: "Management Panel", owner: "Owner Panel" };
const ROLE_BADGE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  staff:      { bg: "rgba(96,165,250,0.12)",  text: "#60a5fa", border: "rgba(96,165,250,0.25)" },
  management: { bg: "rgba(251,191,36,0.12)",  text: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  owner:      { bg: "rgba(167,139,250,0.15)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
};

// ── Activity log ──────────────────────────────────────────────────────────────
type LogEntry = { id: string; message: string; ts: string; type: "ticket" | "auth" | "settings" | "security" };
const LOG_KEY = "vs_logs";
function getLogs(): LogEntry[] { try { return JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch { return []; } }
function addLog(message: string, type: LogEntry["type"] = "ticket") {
  const logs = getLogs();
  const entry: LogEntry = { id: Date.now().toString(), message, ts: new Date().toISOString(), type };
  localStorage.setItem(LOG_KEY, JSON.stringify([entry, ...logs].slice(0, 200)));
}

// ── Blacklist ─────────────────────────────────────────────────────────────────
// ── Owners list ───────────────────────────────────────────────────────────────
type OwnerEntry = { id: string; name: string; discord: string; role: Role };
const OWNERS_KEY = "vs_owners";
function getOwners(): OwnerEntry[] {
  try { return JSON.parse(localStorage.getItem(OWNERS_KEY) || "null") || [{ id: "1", name: "Founder", discord: "owner#0001", role: "owner" as Role }]; } catch { return []; }
}
function saveOwners(o: OwnerEntry[]) { localStorage.setItem(OWNERS_KEY, JSON.stringify(o)); }

// ── Panel settings ────────────────────────────────────────────────────────────
type PanelSettings = { requireBudget: boolean; minMessageLength: number; notifyOnNew: boolean; maintenanceMode: boolean };
const SETTINGS_KEY = "vs_settings";
const DEFAULT_SETTINGS: PanelSettings = { requireBudget: false, minMessageLength: 20, notifyOnNew: true, maintenanceMode: false };
function getPanelSettings(): PanelSettings { try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") }; } catch { return DEFAULT_SETTINGS; } }
function savePanelSettings(s: PanelSettings) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

// ── Updates / changelog ───────────────────────────────────────────────────────
type UpdateEntry = { id: string; version: string; title: string; body: string; ts: string };
const UPDATES_KEY = "vs_updates";
function getUpdates(): UpdateEntry[] { try { return JSON.parse(localStorage.getItem(UPDATES_KEY) || "[]"); } catch { return []; } }
function saveUpdates(u: UpdateEntry[]) { localStorage.setItem(UPDATES_KEY, JSON.stringify(u)); }

// ── Validated servers ─────────────────────────────────────────────────────────
type ServerEntry = { id: string; serverId: string; name: string; approved: boolean };
const SERVERS_KEY = "vs_servers";
function getServers(): ServerEntry[] { try { return JSON.parse(localStorage.getItem(SERVERS_KEY) || "[]"); } catch { return []; } }
function saveServers(s: ServerEntry[]) { localStorage.setItem(SERVERS_KEY, JSON.stringify(s)); }

// ── Alert config ──────────────────────────────────────────────────────────────
type AlertConfig = { newTicketAlert: boolean; highVolumeThreshold: number; resolveAlert: boolean };
const ALERTS_KEY = "vs_alerts";
const DEFAULT_ALERTS: AlertConfig = { newTicketAlert: true, highVolumeThreshold: 10, resolveAlert: false };
function getAlerts(): AlertConfig { try { return { ...DEFAULT_ALERTS, ...JSON.parse(localStorage.getItem(ALERTS_KEY) || "{}") }; } catch { return DEFAULT_ALERTS; } }
function saveAlerts(a: AlertConfig) { localStorage.setItem(ALERTS_KEY, JSON.stringify(a)); }

// ── Nav ───────────────────────────────────────────────────────────────────────
type NavItem = { id: string; label: string; icon: React.ReactNode };
type NavSection = { title: string; items: NavItem[]; roles: Role[] };

const NAV: NavSection[] = [
  {
    title: "CORE", roles: ["staff", "management", "owner"],
    items: [
      { id: "overview", label: "Overview", icon: <LayoutDashboard size={14} /> },
      { id: "tickets",  label: "Tickets",  icon: <TicketIcon size={14} /> },
      { id: "search",   label: "Search",   icon: <Search size={14} /> },
      { id: "activity", label: "Activity", icon: <Activity size={14} /> },
    ],
  },
  {
    title: "MANAGEMENT", roles: ["management", "owner"],
    items: [
      { id: "user-access", label: "User Access", icon: <UserCheck size={14} /> },
      { id: "owners",      label: "Owners",      icon: <Users size={14} /> },
      { id: "settings",    label: "Settings",    icon: <Settings size={14} /> },
      { id: "updates",     label: "Updates",     icon: <RefreshCw size={14} /> },
    ],
  },
  {
    title: "SECURITY", roles: ["owner"],
    items: [
      { id: "validation",        label: "Validation",        icon: <Lock size={14} /> },
      { id: "server-validation", label: "Server Validation", icon: <Globe size={14} /> },
      { id: "alerts",            label: "Alerts",            icon: <Bell size={14} /> },
      { id: "logs",              label: "Logs",              icon: <FileText size={14} /> },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string; border: string }> = {
  new:           { label: "New",         color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)" },
  "in-progress": { label: "In Progress", color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)" },
  resolved:      { label: "Resolved",    color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)" },
};

function StatusBadge({ status }: { status: TicketStatus }) {
  const c = STATUS_CONFIG[status];
  return <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 100, color: c.color, background: c.bg, border: `1px solid ${c.border}`, fontFamily: "Inter", whiteSpace: "nowrap" }}>{c.label}</span>;
}

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now"; if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function fmt(iso: string) { return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: "Manrope", fontSize: "1.4rem", marginBottom: 4 }}>{title}</h2>
      {sub && <p style={{ color: "#505080", fontSize: 13, fontFamily: "Inter" }}>{sub}</p>}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: "rgba(10,10,20,0.7)", border: "1px solid rgba(79,117,255,0.09)", borderRadius: 14, padding: "20px 22px", ...style }}>{children}</div>;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: on ? "#4f75ff" : "#303060", display: "flex", alignItems: "center" }}>
      {on ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
    </button>
  );
}

function fallbackCopy(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.cssText = "position:fixed;opacity:0;top:0;left:0";
  document.body.appendChild(el);
  el.focus();
  el.select();
  try { document.execCommand("copy"); } catch {}
  document.body.removeChild(el);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#34d399" : "#404070", padding: 0, display: "flex", alignItems: "center" }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

// ── Ticket row ────────────────────────────────────────────────────────────────
function NoteThread({ ticketId, role }: { ticketId: string; role: string }) {
  const [notes, setNotes] = useState<TicketNote[]>(() => getTicketNotes(ticketId));
  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    addTicketNote(ticketId, body.trim(), role, role as TicketNote["role"], internal);
    setNotes(getTicketNotes(ticketId));
    setBody("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const removeNote = (id: string) => {
    deleteTicketNote(id);
    setNotes(getTicketNotes(ticketId));
  };

  const roleColor: Record<string, string> = { staff: "#60a5fa", management: "#fbbf24", owner: "#a78bfa" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {notes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <p style={{ color: "#303060", fontSize: 12, fontFamily: "Inter" }}>No responses yet. Write the first one below.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
          {notes.map(note => (
            <div key={note.id} style={{ background: note.internal ? "rgba(251,191,36,0.04)" : "rgba(79,117,255,0.05)", border: `1px solid ${note.internal ? "rgba(251,191,36,0.12)" : "rgba(79,117,255,0.1)"}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${roleColor[note.role] || "#4f75ff"}20`, border: `1px solid ${roleColor[note.role] || "#4f75ff"}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 9, color: roleColor[note.role] || "#4f75ff" }}>{note.author[0]?.toUpperCase()}</span>
                </div>
                <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#c0c0e0", textTransform: "capitalize" }}>{note.author}</span>
                {note.internal && (
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 6px", borderRadius: 4, color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", fontFamily: "Inter" }}>Internal</span>
                )}
                <span style={{ fontFamily: "Inter", fontSize: 11, color: "#303060", marginLeft: "auto" }}>{timeAgo(note.createdAt)}</span>
                <button onClick={() => removeNote(note.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.3)", padding: 0, display: "flex" }} onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "rgba(239,68,68,0.3)"}><Trash2 size={11} /></button>
              </div>
              <p style={{ fontFamily: "Inter", fontSize: 13, color: "#9090b8", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>{note.body}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Composer */}
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <textarea
          placeholder="Write a response or internal note…"
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e as any); }}
          rows={3}
          style={{ width: "100%", background: "rgba(8,8,16,0.9)", border: "1px solid rgba(79,117,255,0.14)", borderRadius: 10, padding: "10px 14px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, transition: "border-color 0.15s" }}
          onFocus={e => e.target.style.borderColor = "rgba(79,117,255,0.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(79,117,255,0.14)"}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="button" onClick={() => setInternal(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600, fontFamily: "Inter", cursor: "pointer", border: `1px solid ${internal ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.08)"}`, background: internal ? "rgba(251,191,36,0.1)" : "transparent", color: internal ? "#fbbf24" : "#505080", transition: "all 0.15s" }}>
            {internal ? "🔒 Internal note" : "🌐 Visible reply"}
          </button>
          <span style={{ fontFamily: "Inter", fontSize: 11, color: "#303060", flex: 1 }}>⌘↵ to send</span>
          <button type="submit" disabled={!body.trim()}
            style={{ background: body.trim() ? "#4f75ff" : "rgba(79,117,255,0.15)", border: "none", borderRadius: 8, padding: "7px 18px", color: body.trim() ? "#fff" : "#303060", fontSize: 13, fontWeight: 700, cursor: body.trim() ? "pointer" : "default", fontFamily: "Inter", transition: "all 0.2s" }}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function TicketRow({ ticket, role, onStatusChange, onDelete }: { ticket: Ticket; role: string; onStatusChange: (id: string, s: TicketStatus) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const noteCount = expanded ? getTicketNotes(ticket.id).length : 0;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
      style={{ background: expanded ? "rgba(10,10,22,0.98)" : "rgba(10,10,20,0.6)", border: `1px solid ${expanded ? "rgba(79,117,255,0.22)" : "rgba(79,117,255,0.08)"}`, borderRadius: 14, overflow: "hidden" }}>

      {/* Header row */}
      <div onClick={() => setExpanded(!expanded)} style={{ display: "grid", gridTemplateColumns: "110px 1fr 120px 130px 80px 32px", gap: 14, alignItems: "center", padding: "14px 18px", cursor: "pointer" }}>
        <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 11, color: "#4f75ff", letterSpacing: "0.04em" }}>{ticket.id}</span>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MessageSquare size={11} style={{ color: "#5865F2" }} />
            <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 13, color: "#c0c0e0" }}>{ticket.discord}</span>
          </div>
          {ticket.service && <span style={{ fontFamily: "Inter", fontSize: 11, color: "#404070", marginTop: 1, display: "block" }}>{ticket.service}</span>}
        </div>
        <StatusBadge status={ticket.status} />
        <span style={{ fontFamily: "Inter", fontSize: 11, color: "#404070" }}>{fmt(ticket.createdAt)}</span>
        <span style={{ fontFamily: "Inter", fontSize: 11, color: "#303060" }}>{timeAgo(ticket.createdAt)}</span>
        <div style={{ display: "flex", justifyContent: "center" }}>{expanded ? <ChevronUp size={13} style={{ color: "#505080" }} /> : <ChevronDown size={13} style={{ color: "#505080" }} />}</div>
      </div>

      {/* Expanded dashboard */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
            <div style={{ borderTop: "1px solid rgba(79,117,255,0.1)" }}>

              {/* Top: details + info + status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 0 }}>

                {/* Left: message + response thread */}
                <div style={{ padding: "20px 20px 20px 20px", borderRight: "1px solid rgba(79,117,255,0.08)" }}>
                  {/* Customer message */}
                  <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Inter" }}>Customer Message</p>
                  <div style={{ background: "rgba(79,117,255,0.04)", border: "1px solid rgba(79,117,255,0.08)", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                    <p style={{ color: "#9090b8", fontSize: 13, lineHeight: 1.75, fontFamily: "Inter", margin: 0 }}>
                      {ticket.message || <em style={{ color: "#404060" }}>No details provided.</em>}
                    </p>
                  </div>

                  {/* Response thread */}
                  <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "Inter" }}>Responses</p>
                  <NoteThread ticketId={ticket.id} role={role} />
                </div>

                {/* Right: info + controls */}
                <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 18 }}>
                  {/* Ticket info */}
                  <div>
                    <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "Inter" }}>Ticket Info</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[["Discord", ticket.discord], ["Service", ticket.service || "—"], ["Budget", ticket.budget || "—"], ["Submitted", fmt(ticket.createdAt)]].map(([l, v]) => (
                        <div key={l}>
                          <span style={{ color: "#303060", fontSize: 10, fontFamily: "Inter", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</span>
                          <p style={{ color: "#9090b8", fontSize: 12, fontFamily: "Inter", fontWeight: 500, margin: "2px 0 0" }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Inter" }}>Status</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {(["new", "in-progress", "resolved"] as TicketStatus[]).map(s => {
                        const c = STATUS_CONFIG[s]; const active = ticket.status === s;
                        return (
                          <button key={s} onClick={e => { e.stopPropagation(); onStatusChange(ticket.id, s); }}
                            style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: active ? 700 : 500, fontFamily: "Inter", cursor: "pointer", border: `1px solid ${active ? c.border : "rgba(255,255,255,0.06)"}`, background: active ? c.bg : "transparent", color: active ? c.color : "#404070", transition: "all 0.15s", textAlign: "left" }}>
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delete */}
                  <div style={{ marginTop: "auto" }}>
                    {!confirmDelete ? (
                      <button onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
                        style={{ display: "flex", alignItems: "center", gap: 5, width: "100%", justifyContent: "center", background: "transparent", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "7px 12px", color: "rgba(239,68,68,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "#ef4444"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "rgba(239,68,68,0.5)"; }}>
                        <Trash2 size={11} /> Delete ticket
                      </button>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#ef4444", fontSize: 12, fontFamily: "Inter", textAlign: "center" }}>Are you sure?</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={e => { e.stopPropagation(); onDelete(ticket.id); }} style={{ flex: 1, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 7, padding: "6px", color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter" }}>Delete</button>
                          <button onClick={e => { e.stopPropagation(); setConfirmDelete(false); }} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "6px", color: "#505080", fontSize: 12, cursor: "pointer", fontFamily: "Inter" }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── PAGES ─────────────────────────────────────────────────────────────────────

function OverviewPage({ tickets }: { tickets: Ticket[] }) {
  const counts = { total: tickets.length, new: tickets.filter(t => t.status === "new").length, inProgress: tickets.filter(t => t.status === "in-progress").length, resolved: tickets.filter(t => t.status === "resolved").length };
  const recent = [...tickets].slice(0, 6);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Overview" sub="Summary of all ticket activity across the panel." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[{ label: "Total", value: counts.total, color: "#eaeaff" }, { label: "New", value: counts.new, color: "#60a5fa" }, { label: "In Progress", value: counts.inProgress, color: "#fbbf24" }, { label: "Resolved", value: counts.resolved, color: "#34d399" }].map(s => (
          <Card key={s.label} style={{ padding: "20px" }}>
            <div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: "2rem", color: s.color, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: "#404070", fontSize: 12, fontFamily: "Inter", marginTop: 6 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <Card>
        <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, fontFamily: "Inter" }}>Recent Tickets</p>
        {recent.length === 0 ? (
          <p style={{ color: "#303060", fontSize: 13, fontFamily: "Inter" }}>No tickets yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recent.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", background: "rgba(79,117,255,0.03)", borderRadius: 10, border: "1px solid rgba(79,117,255,0.06)" }}>
                <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 11, color: "#4f75ff", minWidth: 96 }}>{t.id}</span>
                <span style={{ fontFamily: "Inter", fontSize: 13, color: "#9090b8", flex: 1 }}>{t.discord}</span>
                <StatusBadge status={t.status} />
                <span style={{ fontFamily: "Inter", fontSize: 11, color: "#303060" }}>{timeAgo(t.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function TicketsPage({ tickets, role, onStatusChange, onDelete }: { tickets: Ticket[]; role: string; onStatusChange: (id: string, s: TicketStatus) => void; onDelete: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "all">("all");
  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    return (!search || t.discord.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.message.toLowerCase().includes(q)) && (filterStatus === "all" || t.status === filterStatus);
  });
  const counts = { all: tickets.length, new: tickets.filter(t => t.status === "new").length, "in-progress": tickets.filter(t => t.status === "in-progress").length, resolved: tickets.filter(t => t.status === "resolved").length };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Tickets" sub="Review and manage all submitted customer tickets." />
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={12} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#404070", pointerEvents: "none" }} />
          <input placeholder="Search tickets…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.08)", borderRadius: 10, padding: "9px 14px 9px 34px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Filter size={12} style={{ color: "#404070", marginTop: 9 }} />
          {(["all", "new", "in-progress", "resolved"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "7px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: "Inter", cursor: "pointer", border: `1px solid ${filterStatus === s ? "rgba(79,117,255,0.3)" : "rgba(79,117,255,0.08)"}`, background: filterStatus === s ? "rgba(79,117,255,0.12)" : "transparent", color: filterStatus === s ? "#8aa8ff" : "#404070", transition: "all 0.15s" }}>
              {s === "all" ? `All (${counts.all})` : s === "new" ? `New (${counts.new})` : s === "in-progress" ? `In Prog. (${counts["in-progress"]})` : `Resolved (${counts.resolved})`}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "60px 24px" }}>
          <Eye size={28} style={{ color: "#252545", margin: "0 auto 12px", display: "block" }} />
          <p style={{ color: "#303060", fontSize: 13, fontFamily: "Inter" }}>{tickets.length === 0 ? "No tickets yet. They'll appear here once customers submit the form." : "No tickets match your current filter."}</p>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 120px 130px 80px 32px", gap: 14, padding: "6px 18px" }}>
            {["Ticket ID", "Discord", "Status", "Submitted", "Age", ""].map(h => <span key={h} style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter" }}>{h}</span>)}
          </div>
          <AnimatePresence>{filtered.map(t => <TicketRow key={t.id} ticket={t} role={role} onStatusChange={onStatusChange} onDelete={onDelete} />)}</AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function SearchPage({ tickets }: { tickets: Ticket[] }) {
  const [query, setQuery] = useState("");
  const results = query.length < 2 ? [] : tickets.filter(t => {
    const q = query.toLowerCase();
    return t.discord.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.message.toLowerCase().includes(q) || t.service.toLowerCase().includes(q);
  });
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Search" sub="Search across all tickets, IDs, Discord usernames, and messages." />
      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#404070", pointerEvents: "none" }} />
        <input autoFocus placeholder="Type to search tickets…" value={query} onChange={e => setQuery(e.target.value)}
          style={{ width: "100%", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 12, padding: "14px 16px 14px 46px", color: "#eaeaff", fontSize: 14, outline: "none", fontFamily: "Inter", boxSizing: "border-box", transition: "border-color 0.15s" }}
          onFocus={e => e.target.style.borderColor = "rgba(79,117,255,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(79,117,255,0.12)"} />
      </div>
      {query.length < 2 ? (
        <p style={{ color: "#303060", fontSize: 13, fontFamily: "Inter", textAlign: "center", padding: "40px 0" }}>Type at least 2 characters to search.</p>
      ) : results.length === 0 ? (
        <p style={{ color: "#303060", fontSize: 13, fontFamily: "Inter", textAlign: "center", padding: "40px 0" }}>No results for "{query}".</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ color: "#404070", fontSize: 12, fontFamily: "Inter", marginBottom: 4 }}>{results.length} result{results.length !== 1 ? "s" : ""}</p>
          {results.map(t => (
            <Card key={t.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px" }}>
              <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 11, color: "#4f75ff", minWidth: 96 }}>{t.id}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <MessageSquare size={11} style={{ color: "#5865F2" }} />
                  <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 13, color: "#c0c0e0" }}>{t.discord}</span>
                </div>
                <span style={{ fontFamily: "Inter", fontSize: 11, color: "#404070" }}>{t.service}</span>
              </div>
              <StatusBadge status={t.status} />
              <span style={{ fontFamily: "Inter", fontSize: 11, color: "#303060" }}>{timeAgo(t.createdAt)}</span>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ActivityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  useEffect(() => { setLogs(getLogs()); }, []);
  const typeColor: Record<LogEntry["type"], string> = { ticket: "#60a5fa", auth: "#a78bfa", settings: "#fbbf24", security: "#ef4444" };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Activity" sub="A log of recent actions taken within the panel." />
      {logs.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "60px 24px" }}>
          <Activity size={28} style={{ color: "#252545", margin: "0 auto 12px", display: "block" }} />
          <p style={{ color: "#303060", fontSize: 13, fontFamily: "Inter" }}>No activity recorded yet. Actions like status changes and settings updates will appear here.</p>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {logs.map(log => (
            <Card key={log.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: typeColor[log.type], flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter", fontSize: 13, color: "#9090b8", flex: 1 }}>{log.message}</span>
              <span style={{ fontFamily: "Inter", fontSize: 11, color: "#303060", whiteSpace: "nowrap" }}>{timeAgo(log.ts)}</span>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function UserAccessPage() {
  const [pins, setPins] = useState<Record<string, Role>>(getPins);
  const [editing, setEditing] = useState<string | null>(null);
  const [newPin, setNewPin] = useState("");
  const [adding, setAdding] = useState(false);
  const [addPin, setAddPin] = useState("");
  const [addRole, setAddRole] = useState<Role>("staff");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const saveEdit = (oldPin: string) => {
    if (!newPin.trim() || newPin === oldPin) { setEditing(null); return; }
    const updated = { ...pins };
    const role = updated[oldPin];
    delete updated[oldPin];
    updated[newPin.trim()] = role;
    savePins(updated); setPins(updated); setEditing(null); setNewPin("");
    addLog(`PIN for role "${role}" was changed`, "auth");
  };
  const removePin = (pin: string) => {
    const updated = { ...pins }; delete updated[pin];
    savePins(updated); setPins(updated);
    addLog(`Access PIN removed`, "auth");
  };
  const addAccess = () => {
    if (!addPin.trim()) return;
    const updated = { ...pins, [addPin.trim()]: addRole };
    savePins(updated); setPins(updated); setAdding(false); setAddPin(""); setAddRole("staff");
    addLog(`New ${addRole} access PIN added`, "auth");
  };

  const roleColor: Record<Role, string> = { staff: "#60a5fa", management: "#fbbf24", owner: "#a78bfa" };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="User Access" sub="Manage staff access PINs and role assignments." />
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter" }}>Access PINs</p>
          <button onClick={() => setAdding(!adding)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 8, padding: "6px 12px", color: "#8aa8ff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>
            <Plus size={12} /> Add PIN
          </button>
        </div>
        <AnimatePresence>
          {adding && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden", marginBottom: 12 }}>
              <div style={{ background: "rgba(79,117,255,0.05)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 10, padding: "14px" }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 6 }}>New PIN</p>
                    <input placeholder="Enter PIN…" value={addPin} onChange={e => setAddPin(e.target.value)} style={{ width: "100%", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 6 }}>Role</p>
                    <select value={addRole} onChange={e => setAddRole(e.target.value as Role)} style={{ width: "100%", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", boxSizing: "border-box" }}>
                      <option value="staff">Staff</option><option value="management">Management</option><option value="owner">Owner</option>
                    </select>
                  </div>
                  <button onClick={addAccess} style={{ background: "#4f75ff", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>Save</button>
                  <button onClick={() => setAdding(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", color: "#505080", fontSize: 13, cursor: "pointer", fontFamily: "Inter" }}>Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(pins).map(([pin, role]) => (
            <div key={pin} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(79,117,255,0.03)", borderRadius: 10, border: "1px solid rgba(79,117,255,0.07)" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "capitalize", padding: "3px 8px", borderRadius: 6, color: roleColor[role], background: `${roleColor[role]}18`, border: `1px solid ${roleColor[role]}30`, fontFamily: "Inter", minWidth: 80, textAlign: "center" }}>{role}</span>
              {editing === pin ? (
                <input autoFocus value={newPin} onChange={e => setNewPin(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveEdit(pin); if (e.key === "Escape") setEditing(null); }}
                  style={{ flex: 1, background: "rgba(79,117,255,0.06)", border: "1px solid rgba(79,117,255,0.25)", borderRadius: 7, padding: "5px 10px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter" }} />
              ) : (
                <span style={{ flex: 1, fontFamily: "monospace", fontSize: 13, color: revealed[pin] ? "#c0c0e0" : "#303060", letterSpacing: revealed[pin] ? 0 : "0.15em" }}>{revealed[pin] ? pin : "•".repeat(pin.length)}</span>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => setRevealed(r => ({ ...r, [pin]: !r[pin] }))} style={{ background: "none", border: "none", cursor: "pointer", color: "#404070", padding: 0, fontSize: 11, fontFamily: "Inter" }}>{revealed[pin] ? "Hide" : "Show"}</button>
                {editing === pin ? (
                  <><button onClick={() => saveEdit(pin)} style={{ background: "rgba(79,117,255,0.12)", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 6, padding: "4px 10px", color: "#8aa8ff", fontSize: 11, cursor: "pointer", fontFamily: "Inter" }}>Save</button><button onClick={() => setEditing(null)} style={{ background: "transparent", border: "none", color: "#505080", fontSize: 11, cursor: "pointer", fontFamily: "Inter" }}>Cancel</button></>
                ) : (
                  <><CopyButton text={pin} /><button onClick={() => { setEditing(pin); setNewPin(pin); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#404070", padding: 0, fontSize: 11, fontFamily: "Inter" }}>Edit</button></>
                )}
                <button onClick={() => removePin(pin)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.4)", padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "rgba(239,68,68,0.4)"}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

function OwnersPage() {
  const [owners, setOwners] = useState<OwnerEntry[]>(getOwners);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", discord: "", role: "owner" as Role });

  const addOwner = () => {
    if (!form.name.trim() || !form.discord.trim()) return;
    const updated = [...owners, { id: Date.now().toString(), ...form }];
    saveOwners(updated); setOwners(updated); setAdding(false); setForm({ name: "", discord: "", role: "owner" });
    addLog(`Owner "${form.name}" added`, "auth");
  };
  const removeOwner = (id: string) => {
    const o = owners.find(o => o.id === id);
    const updated = owners.filter(o => o.id !== id);
    saveOwners(updated); setOwners(updated);
    if (o) addLog(`Owner "${o.name}" removed`, "auth");
  };
  const roleColor: Record<Role, string> = { staff: "#60a5fa", management: "#fbbf24", owner: "#a78bfa" };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Owners" sub="Manage the list of owners and their access levels." />
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter" }}>Owner Accounts</p>
          <button onClick={() => setAdding(!adding)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 8, padding: "6px 12px", color: "#8aa8ff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}><Plus size={12} /> Add</button>
        </div>
        <AnimatePresence>
          {adding && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden", marginBottom: 12 }}>
              <div style={{ background: "rgba(79,117,255,0.05)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 10, padding: "14px" }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                  {["Name", "Discord"].map(f => (
                    <div key={f} style={{ flex: 1, minWidth: 120 }}>
                      <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 6 }}>{f}</p>
                      <input placeholder={f + "…"} value={f === "Name" ? form.name : form.discord} onChange={e => setForm(p => ({ ...p, [f.toLowerCase()]: e.target.value }))} style={{ width: "100%", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 6 }}>Role</p>
                    <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as Role }))} style={{ width: "100%", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", boxSizing: "border-box" }}>
                      <option value="staff">Staff</option><option value="management">Management</option><option value="owner">Owner</option>
                    </select>
                  </div>
                  <button onClick={addOwner} style={{ background: "#4f75ff", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>Save</button>
                  <button onClick={() => setAdding(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", color: "#505080", fontSize: 13, cursor: "pointer", fontFamily: "Inter" }}>Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {owners.length === 0 ? (
          <p style={{ color: "#303060", fontSize: 13, fontFamily: "Inter" }}>No owners added yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {owners.map(o => (
              <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(79,117,255,0.03)", borderRadius: 10, border: "1px solid rgba(79,117,255,0.07)" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${roleColor[o.role]}20`, border: `1px solid ${roleColor[o.role]}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 13, color: roleColor[o.role] }}>{o.name[0]?.toUpperCase()}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 13, color: "#c0c0e0" }}>{o.name}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 11, color: "#404070" }}>{o.discord}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "capitalize", padding: "3px 8px", borderRadius: 6, color: roleColor[o.role], background: `${roleColor[o.role]}18`, border: `1px solid ${roleColor[o.role]}30`, fontFamily: "Inter" }}>{o.role}</span>
                <button onClick={() => removeOwner(o.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.4)", padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "rgba(239,68,68,0.4)"}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function SettingsPage() {
  const [settings, setSettings] = useState<PanelSettings>(getPanelSettings);
  const [saved, setSaved] = useState(false);
  const toggle = (key: keyof PanelSettings) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const save = () => {
    savePanelSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2000);
    addLog("Panel settings updated", "settings");
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Settings" sub="Configure ticket form and panel behaviour." />
      <Card style={{ marginBottom: 14 }}>
        <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 16 }}>Form Rules</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "requireBudget" as const, label: "Require budget field", desc: "Customers must select a budget before submitting." },
            { key: "notifyOnNew" as const,   label: "Notify on new ticket",  desc: "Show an indicator when new tickets arrive." },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: "1px solid rgba(79,117,255,0.06)" }}>
              <div>
                <p style={{ fontFamily: "Inter", fontSize: 13, color: "#c0c0e0", marginBottom: 2 }}>{label}</p>
                <p style={{ fontFamily: "Inter", fontSize: 12, color: "#404070" }}>{desc}</p>
              </div>
              <Toggle on={settings[key] as boolean} onToggle={() => toggle(key)} />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: "1px solid rgba(79,117,255,0.06)" }}>
            <div>
              <p style={{ fontFamily: "Inter", fontSize: 13, color: "#c0c0e0", marginBottom: 2 }}>Maintenance mode</p>
              <p style={{ fontFamily: "Inter", fontSize: 12, color: "#404070" }}>Disables the contact form on the main site.</p>
            </div>
            <Toggle on={settings.maintenanceMode} onToggle={() => toggle("maintenanceMode")} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "12px 0" }}>
            <div>
              <p style={{ fontFamily: "Inter", fontSize: 13, color: "#c0c0e0", marginBottom: 2 }}>Min. message length</p>
              <p style={{ fontFamily: "Inter", fontSize: 12, color: "#404070" }}>Minimum characters required in the Project Details field.</p>
            </div>
            <input type="number" value={settings.minMessageLength} onChange={e => setSettings(s => ({ ...s, minMessageLength: Number(e.target.value) }))} min={0} max={500} style={{ width: 70, background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "7px 10px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", textAlign: "center" }} />
          </div>
        </div>
      </Card>
      <button onClick={save} style={{ display: "flex", alignItems: "center", gap: 8, background: saved ? "rgba(52,211,153,0.15)" : "#4f75ff", border: saved ? "1px solid rgba(52,211,153,0.3)" : "none", borderRadius: 10, padding: "10px 22px", color: saved ? "#34d399" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter", transition: "all 0.3s" }}>
        {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Settings</>}
      </button>
    </motion.div>
  );
}

function UpdatesPage() {
  const [updates, setUpdates] = useState<UpdateEntry[]>(getUpdates);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ version: "", title: "", body: "" });
  const add = () => {
    if (!form.version.trim() || !form.title.trim()) return;
    const entry: UpdateEntry = { id: Date.now().toString(), ...form, ts: new Date().toISOString() };
    const updated = [entry, ...updates];
    saveUpdates(updated); setUpdates(updated); setAdding(false); setForm({ version: "", title: "", body: "" });
    addLog(`Update "${form.version}" posted`, "settings");
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Updates" sub="Post updates and changelogs for the team." />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setAdding(!adding)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 8, padding: "7px 14px", color: "#8aa8ff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}><Plus size={12} /> Post Update</button>
      </div>
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden", marginBottom: 14 }}>
            <Card>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Version", "Title"].map(f => (
                    <div key={f} style={{ flex: f === "Version" ? "0 0 120px" : 1 }}>
                      <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 6 }}>{f}</p>
                      <input placeholder={f === "Version" ? "v1.0.0" : "What changed…"} value={f === "Version" ? form.version : form.title} onChange={e => setForm(p => ({ ...p, [f.toLowerCase()]: e.target.value }))} style={{ width: "100%", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 6 }}>Details</p>
                  <textarea placeholder="Describe the changes…" value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={3} style={{ width: "100%", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", resize: "vertical", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={add} style={{ background: "#4f75ff", border: "none", borderRadius: 8, padding: "8px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>Post</button>
                  <button onClick={() => setAdding(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 14px", color: "#505080", fontSize: 13, cursor: "pointer", fontFamily: "Inter" }}>Cancel</button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      {updates.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "60px 24px" }}><p style={{ color: "#303060", fontSize: 13, fontFamily: "Inter" }}>No updates posted yet.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {updates.map(u => (
            <Card key={u.id}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 11, color: "#4f75ff", background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 6, padding: "2px 8px" }}>{u.version}</span>
                    <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: "#eaeaff" }}>{u.title}</span>
                  </div>
                  {u.body && <p style={{ fontFamily: "Inter", fontSize: 13, color: "#7070a0", lineHeight: 1.65 }}>{u.body}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "Inter", fontSize: 11, color: "#303060", whiteSpace: "nowrap" }}>{timeAgo(u.ts)}</span>
                  <button onClick={() => { const n = updates.filter(x => x.id !== u.id); saveUpdates(n); setUpdates(n); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.4)", padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "rgba(239,68,68,0.4)"}><Trash2 size={13} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ValidationPage() {
  const [settings, setSettings] = useState<PanelSettings>(getPanelSettings);
  const [saved, setSaved] = useState(false);
  const save = () => { savePanelSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2000); addLog("Validation rules updated", "security"); };
  const rules = [
    { key: "requireBudget" as const, label: "Require budget selection", desc: "Prevents form submission if no budget range is selected." },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Validation" sub="Configure input validation rules for the contact form." />
      <Card style={{ marginBottom: 14 }}>
        <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 16 }}>Validation Rules</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {rules.map(({ key, label, desc }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(79,117,255,0.06)" }}>
              <div><p style={{ fontFamily: "Inter", fontSize: 13, color: "#c0c0e0", marginBottom: 2 }}>{label}</p><p style={{ fontFamily: "Inter", fontSize: 12, color: "#404070" }}>{desc}</p></div>
              <Toggle on={settings[key] as boolean} onToggle={() => setSettings(s => ({ ...s, [key]: !s[key] }))} />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 0" }}>
            <div><p style={{ fontFamily: "Inter", fontSize: 13, color: "#c0c0e0", marginBottom: 2 }}>Minimum message length</p><p style={{ fontFamily: "Inter", fontSize: 12, color: "#404070" }}>Characters required in Project Details field. Set 0 to disable.</p></div>
            <input type="number" value={settings.minMessageLength} onChange={e => setSettings(s => ({ ...s, minMessageLength: Number(e.target.value) }))} min={0} max={500} style={{ width: 70, background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "7px 10px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", textAlign: "center" }} />
          </div>
        </div>
      </Card>
      <button onClick={save} style={{ display: "flex", alignItems: "center", gap: 8, background: saved ? "rgba(52,211,153,0.15)" : "#4f75ff", border: saved ? "1px solid rgba(52,211,153,0.3)" : "none", borderRadius: 10, padding: "10px 22px", color: saved ? "#34d399" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter", transition: "all 0.3s" }}>
        {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Rules</>}
      </button>
    </motion.div>
  );
}

function ServerValidationPage() {
  const [servers, setServers] = useState<ServerEntry[]>(getServers);
  const [form, setForm] = useState({ serverId: "", name: "" });
  const [adding, setAdding] = useState(false);
  const add = () => {
    if (!form.serverId.trim() || !form.name.trim()) return;
    const entry: ServerEntry = { id: Date.now().toString(), ...form, approved: true };
    const updated = [entry, ...servers]; saveServers(updated); setServers(updated); setAdding(false); setForm({ serverId: "", name: "" });
    addLog(`Server "${form.name}" added to validated list`, "security");
  };
  const toggle = (id: string) => {
    const updated = servers.map(s => s.id === id ? { ...s, approved: !s.approved } : s);
    saveServers(updated); setServers(updated);
  };
  const remove = (id: string) => {
    const s = servers.find(x => x.id === id);
    const updated = servers.filter(x => x.id !== id); saveServers(updated); setServers(updated);
    if (s) addLog(`Server "${s.name}" removed`, "security");
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Server Validation" sub="Manage approved Discord servers for service access." />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setAdding(!adding)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 8, padding: "7px 14px", color: "#8aa8ff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}><Plus size={12} /> Add Server</button>
      </div>
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden", marginBottom: 14 }}>
            <Card>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                {[{ label: "Server ID", key: "serverId", placeholder: "123456789012345678" }, { label: "Server Name", key: "name", placeholder: "My Server" }].map(f => (
                  <div key={f.key} style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 6 }}>{f.label}</p>
                    <input placeholder={f.placeholder} value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: "100%", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", boxSizing: "border-box" }} />
                  </div>
                ))}
                <button onClick={add} style={{ background: "#4f75ff", border: "none", borderRadius: 8, padding: "8px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>Add</button>
                <button onClick={() => setAdding(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", color: "#505080", fontSize: 13, cursor: "pointer", fontFamily: "Inter" }}>Cancel</button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      {servers.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "60px 24px" }}><p style={{ color: "#303060", fontSize: 13, fontFamily: "Inter" }}>No servers added. Add a server ID to approve access.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {servers.map(s => (
            <Card key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 13, color: "#c0c0e0" }}>{s.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#404070" }}>{s.serverId}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, fontFamily: "Inter", color: s.approved ? "#34d399" : "#ef4444", background: s.approved ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${s.approved ? "rgba(52,211,153,0.25)" : "rgba(239,68,68,0.25)"}` }}>{s.approved ? "Approved" : "Suspended"}</span>
              <button onClick={() => toggle(s.id)} style={{ background: "rgba(79,117,255,0.08)", border: "1px solid rgba(79,117,255,0.15)", borderRadius: 7, padding: "5px 10px", color: "#8aa8ff", fontSize: 11, cursor: "pointer", fontFamily: "Inter" }}>{s.approved ? "Suspend" : "Approve"}</button>
              <button onClick={() => remove(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.4)", padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "rgba(239,68,68,0.4)"}><Trash2 size={13} /></button>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function AlertsPage() {
  const [config, setConfig] = useState<AlertConfig>(getAlerts);
  const [saved, setSaved] = useState(false);
  const save = () => { saveAlerts(config); setSaved(true); setTimeout(() => setSaved(false), 2000); addLog("Alert config updated", "security"); };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <SectionHeader title="Alerts" sub="Configure automated alert thresholds and notifications." />
      <Card style={{ marginBottom: 14 }}>
        <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter", marginBottom: 16 }}>Alert Rules</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(79,117,255,0.06)" }}>
            <div><p style={{ fontFamily: "Inter", fontSize: 13, color: "#c0c0e0", marginBottom: 2 }}>New ticket alert</p><p style={{ fontFamily: "Inter", fontSize: 12, color: "#404070" }}>Show an indicator in the panel when a new ticket arrives.</p></div>
            <Toggle on={config.newTicketAlert} onToggle={() => setConfig(c => ({ ...c, newTicketAlert: !c.newTicketAlert }))} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(79,117,255,0.06)" }}>
            <div><p style={{ fontFamily: "Inter", fontSize: 13, color: "#c0c0e0", marginBottom: 2 }}>Resolve confirmation alert</p><p style={{ fontFamily: "Inter", fontSize: 12, color: "#404070" }}>Prompt confirmation before marking a ticket as resolved.</p></div>
            <Toggle on={config.resolveAlert} onToggle={() => setConfig(c => ({ ...c, resolveAlert: !c.resolveAlert }))} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 0" }}>
            <div><p style={{ fontFamily: "Inter", fontSize: 13, color: "#c0c0e0", marginBottom: 2 }}>High-volume threshold</p><p style={{ fontFamily: "Inter", fontSize: 12, color: "#404070" }}>Warn when open ticket count exceeds this number.</p></div>
            <input type="number" value={config.highVolumeThreshold} onChange={e => setConfig(c => ({ ...c, highVolumeThreshold: Number(e.target.value) }))} min={1} max={500} style={{ width: 70, background: "rgba(10,10,20,0.8)", border: "1px solid rgba(79,117,255,0.12)", borderRadius: 8, padding: "7px 10px", color: "#eaeaff", fontSize: 13, outline: "none", fontFamily: "Inter", textAlign: "center" }} />
          </div>
        </div>
      </Card>
      <button onClick={save} style={{ display: "flex", alignItems: "center", gap: 8, background: saved ? "rgba(52,211,153,0.15)" : "#4f75ff", border: saved ? "1px solid rgba(52,211,153,0.3)" : "none", borderRadius: 10, padding: "10px 22px", color: saved ? "#34d399" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter", transition: "all 0.3s" }}>
        {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Alerts</>}
      </button>
    </motion.div>
  );
}

function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(getLogs);
  const typeColor: Record<LogEntry["type"], string> = { ticket: "#60a5fa", auth: "#a78bfa", settings: "#fbbf24", security: "#ef4444" };
  const typeLabel: Record<LogEntry["type"], string> = { ticket: "Ticket", auth: "Auth", settings: "Settings", security: "Security" };
  const clearLogs = () => { localStorage.removeItem(LOG_KEY); setLogs([]); };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <SectionHeader title="Logs" sub="Full audit trail of panel actions." />
        {logs.length > 0 && (
          <button onClick={clearLogs} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "7px 14px", color: "rgba(239,68,68,0.6)", fontSize: 12, cursor: "pointer", fontFamily: "Inter", flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "rgba(239,68,68,0.6)"}><Trash2 size={12} /> Clear logs</button>
        )}
      </div>
      {logs.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "60px 24px" }}><FileText size={28} style={{ color: "#252545", margin: "0 auto 12px", display: "block" }} /><p style={{ color: "#303060", fontSize: 13, fontFamily: "Inter" }}>No logs yet.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {logs.map(log => (
            <Card key={log.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 16px" }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 5, color: typeColor[log.type], background: `${typeColor[log.type]}15`, border: `1px solid ${typeColor[log.type]}30`, fontFamily: "Inter", minWidth: 60, textAlign: "center" }}>{typeLabel[log.type]}</span>
              <span style={{ fontFamily: "Inter", fontSize: 13, color: "#9090b8", flex: 1 }}>{log.message}</span>
              <span style={{ fontFamily: "Inter", fontSize: 11, color: "#303060", whiteSpace: "nowrap" }}>{fmt(log.ts)}</span>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function StaffPanel() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(() => {
    const saved = sessionStorage.getItem("vs_role") as Role | null;
    return saved && ["staff", "management", "owner"].includes(saved) ? saved : null;
  });
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activePage, setActivePage] = useState("overview");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => { if (role) { setTickets(getTickets()); setActivePage("overview"); } }, [role]);

  const refresh = () => setTickets(getTickets());

  const handlePin = (e: React.FormEvent) => {
    e.preventDefault();
    const pins = getPins();
    const matched = pins[pin];
    if (matched) {
      sessionStorage.setItem("vs_role", matched);
      setRole(matched); setPinError(false); setPin("");
      addLog(`${matched} signed in`, "auth");
    } else { setPinError(true); setPin(""); }
  };

  const signOut = () => { sessionStorage.removeItem("vs_role"); setRole(null); setPin(""); navigate("/"); };

  const handleStatusChange = (id: string, status: TicketStatus) => {
    updateTicketStatus(id, status); refresh();
    addLog(`Ticket ${id} status changed to ${status}`, "ticket");
  };
  const handleDelete = (id: string) => {
    addLog(`Ticket ${id} deleted`, "ticket");
    deleteTicket(id); refresh();
  };

  const visibleSections = role ? NAV.filter(s => s.roles.includes(role)) : [];

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!role) {
    return (
      <div style={{ minHeight: "100vh", background: "#060609", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(79,117,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "rgba(10,10,18,0.97)", border: "1px solid rgba(79,117,255,0.15)", borderRadius: 24, padding: "48px 40px", width: "100%", maxWidth: 400, backdropFilter: "blur(24px)", boxShadow: "0 0 80px rgba(79,117,255,0.06), 0 40px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #6b8fff, #4f75ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(79,117,255,0.4)" }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 6 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 15, color: "#eaeaff", letterSpacing: "-0.04em" }}>Vertuoso</span>
            <span style={{ color: "#303060", fontSize: 13, fontFamily: "Inter" }}>/ Staff Access</span>
          </div>
          <h2 style={{ fontFamily: "Manrope", fontSize: "1.6rem", marginBottom: 8 }}>Welcome back.</h2>
          <p style={{ color: "#505080", fontSize: 13, fontFamily: "Inter", lineHeight: 1.65, marginBottom: 28 }}>Enter your PIN to access the panel. Your role is determined automatically.</p>
          <form onSubmit={handlePin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Inter" }}>Access PIN</label>
              <input type="password" required autoFocus placeholder="••••••••" value={pin} onChange={e => { setPin(e.target.value); setPinError(false); }}
                style={{ width: "100%", background: "rgba(15,15,24,0.8)", border: `1px solid ${pinError ? "rgba(239,68,68,0.5)" : "rgba(79,117,255,0.12)"}`, borderRadius: 12, padding: "13px 16px", color: "#eaeaff", fontSize: 14, outline: "none", fontFamily: "Inter", boxSizing: "border-box", transition: "border-color 0.15s" }}
                onFocus={e => { if (!pinError) e.target.style.borderColor = "rgba(79,117,255,0.45)"; }}
                onBlur={e => { if (!pinError) e.target.style.borderColor = "rgba(79,117,255,0.12)"; }} />
              <AnimatePresence>
                {pinError && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: "#ef4444", fontSize: 12, fontFamily: "Inter", marginTop: 8 }}>Incorrect PIN. Try again.</motion.p>}
              </AnimatePresence>
            </div>
            <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#4f75ff", color: "#fff", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Inter", boxShadow: "0 0 28px rgba(79,117,255,0.4)", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "#3d62ff"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "#4f75ff"; e.currentTarget.style.transform = ""; }}>
              <LogIn size={14} /> Enter Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const roleColors = ROLE_BADGE_COLORS[role];

  const renderPage = () => {
    switch (activePage) {
      case "overview":         return <OverviewPage tickets={tickets} />;
      case "tickets":          return <TicketsPage tickets={tickets} role={role} onStatusChange={handleStatusChange} onDelete={handleDelete} />;
      case "search":           return <SearchPage tickets={tickets} />;
      case "activity":         return <ActivityPage />;
      case "user-access":      return <UserAccessPage />;
      case "owners":           return <OwnersPage />;
      case "settings":         return <SettingsPage />;
      case "updates":          return <UpdatesPage />;
      case "validation":       return <ValidationPage />;
      case "server-validation":return <ServerValidationPage />;
      case "alerts":           return <AlertsPage />;
      case "logs":             return <LogsPage />;
      default:                 return <OverviewPage tickets={tickets} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      style={{ minHeight: "100vh", background: "#060609", display: "flex" }}>
      {/* Sidebar */}
      <motion.aside initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: 220, flexShrink: 0, background: "rgba(8,8,16,0.98)", borderRight: "1px solid rgba(79,117,255,0.1)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "22px 18px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, #6b8fff, #4f75ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(79,117,255,0.35)" }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 6 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 14, color: "#eaeaff", letterSpacing: "-0.04em" }}>Vertuoso</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 8, background: roleColors.bg, border: `1px solid ${roleColors.border}` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: roleColors.text, boxShadow: `0 0 6px ${roleColors.text}` }} />
            <span style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, color: roleColors.text, letterSpacing: "0.04em", textTransform: "capitalize" }}>{ROLE_LABELS[role]}</span>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(79,117,255,0.07)", flex: 1, padding: "12px 10px" }}>
          {visibleSections.map(section => (
            <div key={section.title} style={{ marginBottom: 20 }}>
              <p style={{ color: "#252550", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Inter", padding: "0 8px", marginBottom: 6 }}>{section.title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {section.items.map(item => {
                  const active = activePage === item.id;
                  return (
                    <button key={item.id} onClick={() => setActivePage(item.id)}
                      style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, background: active ? "rgba(79,117,255,0.12)" : "transparent", border: `1px solid ${active ? "rgba(79,117,255,0.2)" : "transparent"}`, color: active ? "#8aa8ff" : "#404070", fontSize: 13, fontWeight: active ? 600 : 500, fontFamily: "Inter", cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.15s" }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(79,117,255,0.05)"; e.currentTarget.style.color = "#6070a0"; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#404070"; } }}>
                      <span style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                      {item.label}
                      {active && <ChevronRight size={11} style={{ marginLeft: "auto", opacity: 0.5 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(79,117,255,0.07)", padding: "12px 10px" }}>
          <button onClick={refresh} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, background: "transparent", border: "none", color: "#404070", fontSize: 13, fontWeight: 500, fontFamily: "Inter", cursor: "pointer", width: "100%", textAlign: "left", marginBottom: 2, transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "#6070a0"} onMouseLeave={e => e.currentTarget.style.color = "#404070"}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={signOut} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, background: "transparent", border: "none", color: "#404070", fontSize: 13, fontWeight: 500, fontFamily: "Inter", cursor: "pointer", width: "100%", textAlign: "left", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "#404070"}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <motion.main initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={{ flex: 1, padding: "36px 36px 80px", overflowX: "hidden", minHeight: "100vh" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activePage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      <style>{`@media (max-width: 700px) { aside { display: none !important; } main { padding: 20px 16px 60px !important; } }`}</style>
    </motion.div>
  );
}
