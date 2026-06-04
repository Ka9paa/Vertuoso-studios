import { motion } from "motion/react";
import { ArrowRight, CheckCircle } from "lucide-react";

const E = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const go = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "140px 24px 100px", position: "relative", overflow: "hidden" }}>

      {/* Background glow */}
      <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%, -50%)", width: 1000, height: 600, background: "radial-gradient(ellipse at center, rgba(79,117,255,0.1) 0%, rgba(79,117,255,0.03) 45%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "60%", left: "25%", width: 400, height: 400, background: "radial-gradient(ellipse at center, rgba(79,117,255,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(79,117,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,117,255,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 100%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 860, width: "100%", margin: "0 auto", position: "relative", textAlign: "center" }}>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: E }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(79,117,255,0.08)", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 100, marginBottom: 40 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4f75ff", display: "block", boxShadow: "0 0 8px #4f75ff" }} />
          <span style={{ color: "#8aa8ff", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", fontFamily: "Inter" }}>Custom Software Development Studio</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08, ease: E }}
          style={{ fontFamily: "Manrope", fontWeight: 800, marginBottom: 24 }}>
          Software<br />
          <span style={{ background: "linear-gradient(135deg, #a0b8ff 0%, #4f75ff 50%, #7b6fff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            that ships.
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18, ease: E }}
          style={{ color: "#505080", fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 16px", fontFamily: "Inter" }}>
          Vertuoso Studios builds Discord bots, web apps, automation systems, and custom software solutions for businesses and communities.
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.26, ease: E }}
          style={{ fontFamily: "Manrope", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#252545", marginBottom: 44 }}>
          Software · Automation · Solutions
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: E }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          <button onClick={() => go("#contact")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#4f75ff", color: "#fff", border: "none", borderRadius: 12, padding: "14px 26px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Inter", boxShadow: "0 0 32px rgba(79,117,255,0.4), 0 8px 24px rgba(0,0,0,0.3)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#3d62ff"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 48px rgba(79,117,255,0.55), 0 12px 28px rgba(0,0,0,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#4f75ff"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 32px rgba(79,117,255,0.4), 0 8px 24px rgba(0,0,0,0.3)"; }}>
            Open a Ticket <ArrowRight size={15} />
          </button>
          <button onClick={() => go("#services")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#6060a0", border: "1px solid rgba(79,117,255,0.14)", borderRadius: 12, padding: "14px 26px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "Inter", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#eaeaff"; e.currentTarget.style.borderColor = "rgba(79,117,255,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6060a0"; e.currentTarget.style.borderColor = "rgba(79,117,255,0.14)"; e.currentTarget.style.transform = ""; }}>
            View Services
          </button>
        </motion.div>

        {/* Honest feature pills */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: E }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 52 }}>
          {[
            { icon: CheckCircle, label: "On-time delivery" },
            { icon: CheckCircle, label: "Clean, documented code" },
            { icon: CheckCircle, label: "Ticket-based support" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: "rgba(79,117,255,0.05)", border: "1px solid rgba(79,117,255,0.1)", borderRadius: 100 }}>
              <Icon size={12} style={{ color: "#4f75ff" }} />
              <span style={{ color: "#404070", fontSize: 12, fontFamily: "Inter", fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
