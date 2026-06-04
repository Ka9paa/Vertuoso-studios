import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Bot, Globe, Zap, BarChart3, Plug, AppWindow } from "lucide-react";

const E = [0.16, 1, 0.3, 1] as const;

// These describe what we build — not fabricated past projects
const capabilities = [
  {
    icon: Bot,
    category: "Discord Bots",
    headline: "Custom bots built for your community",
    description: "From moderation and ticketing to leveling systems, role automation, and full web dashboards — we build Discord bots tailored to exactly what your server needs.",
    features: ["Moderation & anti-raid", "Ticket systems", "Role automation", "Custom commands", "Web dashboards", "API integrations"],
    accent: "#5865F2",
    accentBg: "rgba(88,101,242,0.07)",
  },
  {
    icon: Globe,
    category: "Web Development",
    headline: "Websites and web apps, done right",
    description: "Full-stack websites and web applications built for performance, scalability, and long-term maintainability — from simple landing pages to complex platforms.",
    features: ["Landing pages", "SaaS platforms", "Admin portals", "E-commerce", "SEO-ready", "Mobile-first"],
    accent: "#4f75ff",
    accentBg: "rgba(79,117,255,0.07)",
  },
  {
    icon: Plug,
    category: "API Integrations",
    headline: "Connect anything to anything",
    description: "We handle the complexity of third-party API connections — REST, GraphQL, OAuth, webhooks — so your tools work together without friction.",
    features: ["REST & GraphQL", "OAuth 2.0", "Webhooks", "Payment gateways", "Data sync", "Error recovery"],
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.07)",
  },
  {
    icon: BarChart3,
    category: "Dashboards",
    headline: "See your data clearly",
    description: "Real-time analytics dashboards and reporting tools that turn raw data into something your team can actually act on — built around your specific metrics.",
    features: ["Real-time charts", "Custom metrics", "Data tables", "Filters & exports", "Role-based access", "Scheduled reports"],
    accent: "#8b5cf6",
    accentBg: "rgba(139,92,246,0.07)",
  },
  {
    icon: AppWindow,
    category: "Custom Applications",
    headline: "Built around your exact workflow",
    description: "Desktop and web applications designed from the ground up for your specific needs — when off-the-shelf software simply isn't good enough.",
    features: ["Internal tools", "Client portals", "CRM systems", "Inventory tools", "Booking systems", "Custom UIs"],
    accent: "#06b6d4",
    accentBg: "rgba(6,182,212,0.07)",
  },
];

export function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" style={{ padding: "120px 0", borderTop: "1px solid rgba(79,117,255,0.07)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: E }}
          style={{ marginBottom: 64 }}>
          <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, fontFamily: "Inter" }}>What We Build</p>
          <h2 style={{ fontFamily: "Manrope", maxWidth: 560, marginBottom: 16 }}>Every service, in detail.</h2>
          <p style={{ color: "#505080", fontSize: 14, lineHeight: 1.75, maxWidth: 480, fontFamily: "Inter" }}>
            Here's exactly what we offer and what's included with each service type.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="cap-grid">
          {capabilities.map((c, i) => <CapCard key={c.category} cap={c} index={i} />)}
        </div>
      </div>

      <style>{`
        .cap-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 720px) { .cap-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function CapCard({ cap: c, index }: { cap: typeof capabilities[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const Icon = c.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 2) * 0.07, ease: E }}
      style={{
        background: "rgba(12,12,22,0.8)", border: "1px solid rgba(79,117,255,0.1)", borderRadius: 22,
        padding: "32px", backdropFilter: "blur(20px)", position: "relative", overflow: "hidden",
        transition: "border-color 0.25s, box-shadow 0.25s, transform 0.2s",
      }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(79,117,255,0.22)"; el.style.boxShadow = "0 0 40px rgba(79,117,255,0.08)"; el.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(79,117,255,0.1)"; el.style.boxShadow = "none"; el.style.transform = ""; }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c.accent, borderRadius: "22px 0 0 22px", opacity: 0.6 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingLeft: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: c.accentBg, border: `1px solid ${c.accent}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={17} style={{ color: c.accent }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: c.accent, fontFamily: "Inter" }}>{c.category}</span>
      </div>

      <h3 style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1.1rem", color: "#eaeaff", letterSpacing: "-0.025em", marginBottom: 12, paddingLeft: 12 }}>
        {c.headline}
      </h3>
      <p style={{ color: "#505080", fontSize: 13, lineHeight: 1.75, marginBottom: 22, fontFamily: "Inter", paddingLeft: 12 }}>
        {c.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 12 }}>
        {c.features.map((f) => (
          <span key={f} style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", background: "rgba(79,117,255,0.06)", border: "1px solid rgba(79,117,255,0.1)", borderRadius: 100, color: "#404070", fontFamily: "Inter" }}>
            {f}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
