import { Github, Twitter, MessageSquare } from "lucide-react";

export function Footer() {
  const go = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer style={{ borderTop: "1px solid rgba(79,117,255,0.08)", padding: "60px 24px 36px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 52, marginBottom: 56 }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, #6b8fff, #4f75ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(79,117,255,0.35)" }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 6 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 14, color: "#eaeaff", letterSpacing: "-0.04em" }}>Vertuoso</span>
            </div>
            <p style={{ color: "#252545", fontSize: 13, lineHeight: 1.8, maxWidth: 240, marginBottom: 22, fontFamily: "Inter" }}>
              Professional software development studio. Built to perform. Built to last.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[Github, Twitter, MessageSquare].map((Icon, i) => (
                <button key={i} style={{ width: 32, height: 32, borderRadius: 8, background: "transparent", border: "1px solid rgba(79,117,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(79,117,255,0.28)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(79,117,255,0.1)")}>
                  <Icon size={13} style={{ color: "#303060" }} />
                </button>
              ))}
            </div>
          </div>

          {[
            { title: "Services", items: [{ l: "Discord Bots", id: "#services" }, { l: "Web Development", id: "#services" }, { l: "Automation", id: "#services" }, { l: "Dashboards", id: "#services" }] },
            { title: "Company", items: [{ l: "Our Work", id: "#projects" }, { l: "Testimonials", id: "#testimonials" }, { l: "FAQ", id: "#faq" }, { l: "Contact", id: "#contact" }] },
            { title: "Legal", items: [{ l: "Privacy Policy", id: "" }, { l: "Terms of Service", id: "" }, { l: "Cookie Policy", id: "" }] },
          ].map((col) => (
            <div key={col.title}>
              <p style={{ color: "#252545", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18, fontFamily: "Inter" }}>{col.title}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {col.items.map((item) => (
                  <li key={item.l}>
                    <button onClick={() => item.id && go(item.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#303060", fontSize: 13, fontFamily: "Inter", padding: 0, transition: "color 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#6b8fff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#303060")}>
                      {item.l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(79,117,255,0.06)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "#1c1c38", fontSize: 12, fontFamily: "Inter" }}>© 2025 Vertuoso Studios. All rights reserved.</span>
          <span style={{ color: "#1c1c38", fontSize: 12, fontFamily: "Inter" }}>Software · Automation · Solutions</span>
        </div>
      </div>
      <style>{`
        .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        @media (max-width: 860px) { .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
