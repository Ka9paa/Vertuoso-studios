import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Star, ArrowRight } from "lucide-react";

const E = [0.16, 1, 0.3, 1] as const;

export function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" style={{ padding: "120px 0", borderTop: "1px solid rgba(79,117,255,0.07)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: E }}
          style={{ marginBottom: 64 }}>
          <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, fontFamily: "Inter" }}>Reviews</p>
          <h2 style={{ fontFamily: "Manrope", maxWidth: 480 }}>What our clients say.</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: E }}
          style={{
            background: "rgba(12,12,22,0.8)",
            border: "1px solid rgba(79,117,255,0.12)",
            borderRadius: 24,
            padding: "56px 48px",
            backdropFilter: "blur(20px)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 48,
            alignItems: "center",
          }}
          className="review-card"
        >
          <div>
            <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" style={{ color: "#f59e0b" }} />)}
            </div>
            <h3 style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: "1.5rem", color: "#eaeaff", letterSpacing: "-0.03em", marginBottom: 14 }}>
              We let our work speak for itself.
            </h3>
            <p style={{ color: "#505080", fontSize: 14, lineHeight: 1.8, maxWidth: 500, fontFamily: "Inter" }}>
              We don't publish fabricated reviews. As we grow and complete projects, real client feedback will be shown here. Submit a ticket to get started — and become one of our first clients.
            </p>
          </div>

          <div style={{ flexShrink: 0 }}>
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#4f75ff", color: "#fff", border: "none",
                borderRadius: 12, padding: "13px 24px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Inter", whiteSpace: "nowrap",
                boxShadow: "0 0 28px rgba(79,117,255,0.3)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#3d62ff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#4f75ff"; e.currentTarget.style.transform = ""; }}
            >
              Open a Ticket <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .review-card { grid-template-columns: 1fr auto; }
        @media (max-width: 680px) { .review-card { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
