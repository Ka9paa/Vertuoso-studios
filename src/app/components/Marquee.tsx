import { motion } from "motion/react";

const items = [
  "Discord Bots", "Web Applications", "Automation Systems", "API Integrations",
  "Custom Dashboards", "Software Architecture", "Mobile Apps", "Real-time Data",
  "PostgreSQL", "React", "Node.js", "TypeScript", "WebSockets", "REST APIs",
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div style={{ borderTop: "1px solid rgba(79,117,255,0.08)", borderBottom: "1px solid rgba(79,117,255,0.08)", overflow: "hidden", padding: "16px 0", position: "relative" }}>
      {/* Fade masks */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 100, height: "100%", background: "linear-gradient(90deg, #060609, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: "100%", background: "linear-gradient(-90deg, #060609, transparent)", zIndex: 2, pointerEvents: "none" }} />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 0, width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, padding: "0 32px", flexShrink: 0 }}>
            <span style={{ color: "#282848", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", whiteSpace: "nowrap" }}>
              {item}
            </span>
            <span style={{ color: "#1a1a35", fontSize: 14, margin: "0 0 0 32px" }}>·</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
