import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";

const E = [0.16, 1, 0.3, 1] as const;

const faqs = [
  { q: "What types of projects does Vertuoso Studios take on?", a: "Discord bots, full-stack websites, custom web and desktop applications, automation systems, API integrations, analytics dashboards, and bespoke software. If it involves code, we're likely a fit — reach out for a free consultation." },
  { q: "How long does a typical project take?", a: "A Discord bot: 1–3 weeks. A full website: 2–6 weeks. Custom apps and automation systems are scoped individually. We always provide a timeline commitment before any work begins — and we hold to it." },
  { q: "Do you provide ongoing support after delivery?", a: "Yes. Every project includes a dedicated post-launch support window, and we offer ongoing retainer plans for long-term coverage. We don't disappear after handoff." },
  { q: "What does your development process look like?", a: "Scoping session → written proposal (scope, timeline, pricing) → structured milestones with regular updates → final delivery with full documentation and handover call." },
  { q: "How do I get started?", a: "Fill out the quote form below. We respond within 24 hours to schedule a free consultation. No commitment required at any early stage." },
  { q: "What are your payment terms?", a: "50% deposit before work begins, 50% on final delivery. Larger engagements use milestone-based structures. All terms are in writing before anything starts." },
];

function FAQItem({ item, index }: { item: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: index * 0.04, ease: E }}
      style={{ background: open ? "rgba(79,117,255,0.04)" : "transparent", border: "1px solid rgba(79,117,255,0.08)", borderRadius: 16, overflow: "hidden", transition: "background 0.2s, border-color 0.2s", marginBottom: 8, borderColor: open ? "rgba(79,117,255,0.2)" : "rgba(79,117,255,0.08)" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "22px 26px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontFamily: "Manrope", fontSize: "0.9rem", fontWeight: 700, color: open ? "#eaeaff" : "#8080b0", lineHeight: 1.45, letterSpacing: "-0.02em", transition: "color 0.15s" }}>
          {item.q}
        </span>
        <div style={{ flexShrink: 0, width: 26, height: 26, border: "1px solid rgba(79,117,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.25s, border-color 0.2s", transform: open ? "rotate(45deg)" : "rotate(0deg)", borderColor: open ? "rgba(79,117,255,0.4)" : "rgba(79,117,255,0.15)" }}>
          <Plus size={12} style={{ color: "#4f75ff" }} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <p style={{ color: "#505080", fontSize: 14, lineHeight: 1.8, padding: "0 26px 24px", fontFamily: "Inter" }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" style={{ padding: "120px 0", borderTop: "1px solid rgba(79,117,255,0.07)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 100 }} className="faq-layout">
          <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: E }} style={{ position: "sticky", top: 100 }}>
            <p style={{ color: "#303060", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, fontFamily: "Inter" }}>FAQ</p>
            <h2 style={{ fontFamily: "Manrope", marginBottom: 20 }}>Common questions.</h2>
            <p style={{ color: "#404070", fontSize: 14, lineHeight: 1.75, fontFamily: "Inter" }}>
              Still have questions? Reach out — we respond promptly.
            </p>
          </motion.div>
          <div>{faqs.map((item, i) => <FAQItem key={item.q} item={item} index={i} />)}</div>
        </div>
      </div>
      <style>{`
        .faq-layout { grid-template-columns: 1fr 1.8fr; }
        @media (max-width: 780px) { .faq-layout { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </section>
  );
}
