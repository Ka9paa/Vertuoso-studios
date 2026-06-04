import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Shield, Clock, FileCheck, Headphones } from "lucide-react";

const E = [0.16, 1, 0.3, 1] as const;

const pillars = [
  { icon: Shield, title: "Secure by default", desc: "Security best practices baked into every line — not an afterthought." },
  { icon: Clock, title: "On-time delivery", desc: "We set realistic timelines and hold ourselves to them, always." },
  { icon: FileCheck, title: "Clean, documented code", desc: "Every handoff comes with documentation — no black boxes." },
  { icon: Headphones, title: "Post-launch support", desc: "We stay available and responsive long after your project ships." },
];

export function TrustBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ padding: "120px 0", borderTop: "1px solid rgba(79,117,255,0.07)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: E }} style={{ marginBottom: 60 }}>
          <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, fontFamily: "Inter" }}>Our Standards</p>
          <h2 style={{ fontFamily: "Manrope", maxWidth: 480 }}>Why teams choose Vertuoso.</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }} className="trust-grid">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.08, ease: E }}
                style={{
                  background: "rgba(12,12,22,0.8)", border: "1px solid rgba(79,117,255,0.1)", borderRadius: 20,
                  padding: "32px 28px", backdropFilter: "blur(20px)",
                  transition: "border-color 0.25s, box-shadow 0.25s, transform 0.2s",
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(79,117,255,0.25)"; el.style.boxShadow = "0 0 32px rgba(79,117,255,0.08)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(79,117,255,0.1)"; el.style.boxShadow = "none"; el.style.transform = ""; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(79,117,255,0.1)", border: "1px solid rgba(79,117,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon size={18} style={{ color: "#6b8fff" }} />
                </div>
                <h3 style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1rem", color: "#eaeaff", letterSpacing: "-0.025em", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ color: "#404070", fontSize: 13, lineHeight: 1.75, fontFamily: "Inter" }}>{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <style>{`
        .trust-grid { grid-template-columns: repeat(4,1fr); }
        @media (max-width: 860px) { .trust-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .trust-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
