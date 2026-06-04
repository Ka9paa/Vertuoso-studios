import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, CheckCircle, Clock, Shield, FileCheck, Ticket } from "lucide-react";
import { saveTicket } from "../ticketStore";

const E = [0.16, 1, 0.3, 1] as const;
const services = ["Discord Bot", "Website", "Custom Application", "Automation System", "API Integration", "Dashboard", "Other"];
const budgets = ["Under $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000 – $15,000", "$15,000+", "Let's discuss"];

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [form, setForm] = useState({ discord: "", service: "", budget: "", message: "" });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ticket = saveTicket({
        discord: form.discord,
        service: form.service,
        budget: form.budget,
        message: form.message,
      });
      setTicketId(ticket.id);
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  const field: React.CSSProperties = {
    width: "100%", background: "rgba(15,15,24,0.8)", border: "1px solid rgba(79,117,255,0.1)",
    borderRadius: 12, padding: "13px 16px", color: "#eaeaff", fontSize: 14, outline: "none",
    fontFamily: "Inter", transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box",
  };

  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.borderColor = "rgba(79,117,255,0.45)";
    (e.target as HTMLElement).style.boxShadow = "0 0 0 3px rgba(79,117,255,0.08)";
  };
  const onBlur = (e: React.FocusEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.borderColor = "rgba(79,117,255,0.1)";
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  return (
    <section id="contact" style={{ padding: "120px 24px", borderTop: "1px solid rgba(79,117,255,0.07)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80, alignItems: "start" }} className="contact-layout">

          {/* Left */}
          <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: E }}>
            <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, fontFamily: "Inter" }}>Open a Ticket</p>
            <h2 style={{ fontFamily: "Manrope", marginBottom: 20 }}>Start a<br />project.</h2>
            <p style={{ color: "#505080", fontSize: 14, lineHeight: 1.8, marginBottom: 44, fontFamily: "Inter" }}>
              Fill in your project details and submit a ticket. Our team will review it and get back to you.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: Ticket, title: "Ticket created instantly", desc: "Your submission goes straight into our team's panel." },
                { icon: Clock, title: "Reviewed promptly", desc: "Our team checks new tickets regularly throughout the day." },
                { icon: FileCheck, title: "Free consultation", desc: "We scope the work before any pricing is discussed." },
                { icon: Shield, title: "No obligation", desc: "Submitting a ticket commits you to nothing." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <Icon size={14} style={{ color: "#4f75ff", marginTop: 3, flexShrink: 0 }} />
                    <div>
                      <div style={{ color: "#9090c0", fontSize: 13, fontWeight: 600, marginBottom: 2, fontFamily: "Inter" }}>{item.title}</div>
                      <div style={{ color: "#303060", fontSize: 13, lineHeight: 1.6, fontFamily: "Inter" }}>{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.12, ease: E }}
            style={{ background: "rgba(12,12,22,0.9)", border: "1px solid rgba(79,117,255,0.15)", borderRadius: 24, padding: "40px", backdropFilter: "blur(24px)", boxShadow: "0 0 60px rgba(79,117,255,0.06)" }}>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 250, damping: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    <CheckCircle size={28} style={{ color: "#4f75ff" }} />
                  </div>
                </motion.div>

                <h3 style={{ fontFamily: "Manrope", marginBottom: 10 }}>Ticket submitted!</h3>

                <p style={{ color: "#505080", fontSize: 13, fontFamily: "Inter", marginBottom: 16 }}>Save your ticket ID — you'll need it to check status.</p>

                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "rgba(79,117,255,0.08)", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 100, marginBottom: 24 }}>
                  <span style={{ color: "#6b8fff", fontSize: 14, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.06em" }}>{ticketId}</span>
                </div>

                <p style={{ color: "#505080", fontSize: 14, lineHeight: 1.75, fontFamily: "Inter", maxWidth: 320, margin: "0 auto 24px" }}>
                  Our team will review it and reach out via Discord shortly.
                </p>

                <Link to={`/ticket?id=${ticketId}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 10, padding: "10px 20px", color: "#8aa8ff", fontSize: 13, fontWeight: 600, fontFamily: "Inter", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(79,117,255,0.18)"; e.currentTarget.style.color = "#c0d0ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(79,117,255,0.1)"; e.currentTarget.style.color = "#8aa8ff"; }}>
                  <Ticket size={14} /> Track your ticket
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                <div>
                  <label style={{ display: "block", color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Inter" }}>
                    Discord Username
                  </label>
                  <input
                    required
                    placeholder="username or user#0000"
                    value={form.discord}
                    onChange={set("discord")}
                    style={field}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <p style={{ color: "#303060", fontSize: 11, fontFamily: "Inter", marginTop: 6 }}>
                    So our team knows how to reach you.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="form-row">
                  <div>
                    <label style={{ display: "block", color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Inter" }}>
                      Service Needed
                    </label>
                    <select required value={form.service} onChange={set("service")} style={{ ...field, cursor: "pointer", appearance: "none" }} onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Select…</option>
                      {services.map((s) => <option key={s} value={s} style={{ background: "#0c0c16" }}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Inter" }}>
                      Estimated Budget
                    </label>
                    <select value={form.budget} onChange={set("budget")} style={{ ...field, cursor: "pointer", appearance: "none" }} onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Select…</option>
                      {budgets.map((b) => <option key={b} value={b} style={{ background: "#0c0c16" }}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Inter" }}>
                    Project Details
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your project — what you need, your goals, any technical details, and your timeline…"
                    value={form.message}
                    onChange={set("message")}
                    style={{ ...field, resize: "vertical", minHeight: 110 }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <button type="submit" disabled={loading}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#4f75ff", color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: "Inter", opacity: loading ? 0.6 : 1, boxShadow: "0 0 28px rgba(79,117,255,0.35)", transition: "all 0.2s", marginTop: 4 }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "#3d62ff"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#4f75ff"; e.currentTarget.style.transform = ""; }}>
                  {loading ? (
                    <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "block" }} />
                      Submitting…</>
                  ) : (
                    <>Submit Ticket <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        .contact-layout { grid-template-columns: 1fr 1.5fr; }
        @media (max-width: 780px) { .contact-layout { grid-template-columns: 1fr !important; gap: 48px !important; } .form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
