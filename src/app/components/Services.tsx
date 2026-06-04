import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Bot, Globe, AppWindow, Cpu, Zap, Plug, BarChart3, Code2, MessageSquare, Clock } from "lucide-react";

const E = [0.16, 1, 0.3, 1] as const;

const CARD = {
  bg: "rgba(12,12,22,0.8)",
  border: "1px solid rgba(79,117,255,0.1)",
  borderHover: "1px solid rgba(79,117,255,0.28)",
  radius: 20,
  shadow: "0 0 0 1px rgba(79,117,255,0.08)",
  shadowHover: "0 0 40px rgba(79,117,255,0.12), 0 0 0 1px rgba(79,117,255,0.2)",
};

function Label({ children }: { children: string }) {
  return (
    <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, fontFamily: "Inter" }}>
      {children}
    </p>
  );
}

function Icon({ icon: I, size = 18 }: { icon: React.ElementType; size?: number }) {
  return (
    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
      <I size={size} style={{ color: "#6b8fff" }} />
    </div>
  );
}

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const card = (delay: number, style: React.CSSProperties, children: React.ReactNode) => (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: E }}
      style={{
        background: CARD.bg, border: CARD.border, borderRadius: CARD.radius,
        padding: "28px", backdropFilter: "blur(20px)", transition: "all 0.25s",
        boxShadow: CARD.shadow, position: "relative", overflow: "hidden", ...style,
      }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.border = CARD.borderHover; el.style.boxShadow = CARD.shadowHover; el.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.border = CARD.border; el.style.boxShadow = CARD.shadow; el.style.transform = ""; }}
    >
      {children}
    </motion.div>
  );

  return (
    <section id="services" style={{ padding: "120px 0", borderTop: "1px solid rgba(79,117,255,0.07)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: E }} style={{ marginBottom: 60 }}>
          <Label>Services</Label>
          <h2 style={{ fontFamily: "Manrope", maxWidth: 480 }}>
            Everything<br />we build.
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto auto", gap: 14 }} className="bento-grid">

          {/* Big feature card — Discord Bots */}
          {card(0.05, { gridColumn: "1 / 3" },
            <>
              <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, background: "radial-gradient(ellipse at center, rgba(79,117,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
              <Icon icon={Bot} size={20} />
              <h3 style={{ fontFamily: "Manrope", fontSize: "1.35rem", fontWeight: 800, color: "#eaeaff", letterSpacing: "-0.03em", marginBottom: 12 }}>Discord Bots</h3>
              <p style={{ color: "#505080", fontSize: 14, lineHeight: 1.75, maxWidth: 460, marginBottom: 24, fontFamily: "Inter" }}>
                Production-grade Discord bots with moderation, ticketing, leveling, role automation, webhook integrations, and a full web dashboard. We've supported communities of 50,000+ members without a single outage.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Discord.js", "PostgreSQL", "Redis", "WebSockets", "React Dashboard"].map((t) => (
                  <span key={t} style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", background: "rgba(79,117,255,0.07)", border: "1px solid rgba(79,117,255,0.14)", borderRadius: 100, color: "#6b8fff", fontFamily: "Inter" }}>{t}</span>
                ))}
              </div>
            </>
          )}

          {/* Discord CTA card */}
          {card(0.1, { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: "rgba(88,101,242,0.06)", border: "1px solid rgba(88,101,242,0.18)" },
            <>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(88,101,242,0.15)", border: "1px solid rgba(88,101,242,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <MessageSquare size={20} style={{ color: "#7289da" }} />
              </div>
              <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "0.95rem", color: "#c0c0e0", marginBottom: 6 }}>Discord Support</div>
              <div style={{ color: "#505080", fontSize: 13, fontFamily: "Inter" }}>Real team members, not bots</div>
            </>
          )}

          {/* Web Dev */}
          {card(0.12, {},
            <>
              <Icon icon={Globe} />
              <h3 style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1.1rem", color: "#eaeaff", letterSpacing: "-0.025em", marginBottom: 10 }}>Website Development</h3>
              <p style={{ color: "#505080", fontSize: 13, lineHeight: 1.7, fontFamily: "Inter" }}>Full-stack sites and SaaS platforms built for performance and growth.</p>
            </>
          )}

          {/* API */}
          {card(0.17, {},
            <>
              <Icon icon={Plug} />
              <h3 style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1.1rem", color: "#eaeaff", letterSpacing: "-0.025em", marginBottom: 10 }}>API Integrations</h3>
              <p style={{ color: "#505080", fontSize: 13, lineHeight: 1.7, fontFamily: "Inter" }}>REST, GraphQL, OAuth, webhooks — we connect anything to anything.</p>
            </>
          )}

          {/* Dashboards */}
          {card(0.19, {},
            <>
              <Icon icon={BarChart3} />
              <h3 style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1.1rem", color: "#eaeaff", letterSpacing: "-0.025em", marginBottom: 10 }}>Analytics Dashboards</h3>
              <p style={{ color: "#505080", fontSize: 13, lineHeight: 1.7, fontFamily: "Inter" }}>Real-time data visualization built for decisions that matter.</p>
            </>
          )}

          {/* Apps */}
          {card(0.21, {},
            <>
              <Icon icon={AppWindow} />
              <h3 style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1.1rem", color: "#eaeaff", letterSpacing: "-0.025em", marginBottom: 10 }}>Custom Applications</h3>
              <p style={{ color: "#505080", fontSize: 13, lineHeight: 1.7, fontFamily: "Inter" }}>Desktop and web apps designed around your exact workflow.</p>
            </>
          )}

          {/* CTA card */}
          {card(0.23, { background: "rgba(79,117,255,0.06)", border: "1px solid rgba(79,117,255,0.18)", display: "flex", flexDirection: "column", justifyContent: "center" },
            <>
              <Icon icon={Code2} />
              <h3 style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1.1rem", color: "#eaeaff", letterSpacing: "-0.025em", marginBottom: 10 }}>Custom Development</h3>
              <p style={{ color: "#505080", fontSize: 13, lineHeight: 1.7, fontFamily: "Inter", marginBottom: 20 }}>Something none of the above covers? We'll build it anyway.</p>
              <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: "#4f75ff", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter", width: "fit-content" }}>
                Discuss your project
              </button>
            </>
          )}

          {/* On-time card */}
          {card(0.25, { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" },
            <>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Clock size={20} style={{ color: "#6b8fff" }} />
              </div>
              <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "0.95rem", color: "#c0c0e0", marginBottom: 6 }}>On-time delivery</div>
              <div style={{ color: "#505080", fontSize: 13, fontFamily: "Inter" }}>Every project, every time</div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .bento-grid { grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width: 860px) {
          .bento-grid { grid-template-columns: 1fr 1fr !important; }
          .bento-grid > div:first-child { grid-column: 1 / 3 !important; }
        }
        @media (max-width: 540px) {
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-grid > div:first-child { grid-column: 1 !important; }
        }
      `}</style>
    </section>
  );
}
