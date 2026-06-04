import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const E = [0.16, 1, 0.3, 1] as const;

export function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ padding: "0 24px 120px", borderTop: "1px solid rgba(79,117,255,0.07)", paddingTop: 120 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{
            background: "rgba(12,12,22,0.9)",
            border: "1px solid rgba(79,117,255,0.18)",
            borderRadius: 28,
            padding: "80px 64px",
            backdropFilter: "blur(24px)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 80px rgba(79,117,255,0.08)",
          }}
        >
          {/* Background glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse at center, rgba(79,117,255,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

          <p style={{ color: "#303060", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24, fontFamily: "Inter", position: "relative" }}>
            Ready to build?
          </p>
          <h2 style={{ fontFamily: "Manrope", marginBottom: 20, position: "relative", maxWidth: 640, margin: "0 auto 20px" }}>
            Let's build something<br />
            <span style={{ background: "linear-gradient(135deg, #a0b8ff 0%, #4f75ff 50%, #7b6fff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              great together.
            </span>
          </h2>
          <p style={{ color: "#505080", fontSize: "1rem", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 44px", fontFamily: "Inter", position: "relative" }}>
            Submit a ticket and our team will review it and get back to you. No commitment required at any stage.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#4f75ff", color: "#fff", border: "none", borderRadius: 14, padding: "15px 30px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Inter", boxShadow: "0 0 40px rgba(79,117,255,0.45), 0 8px 24px rgba(0,0,0,0.3)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#3d62ff"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(79,117,255,0.6), 0 12px 28px rgba(0,0,0,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#4f75ff"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 40px rgba(79,117,255,0.45), 0 8px 24px rgba(0,0,0,0.3)"; }}
            >
              Get a Free Quote <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
