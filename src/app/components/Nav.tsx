import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 24px" }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto", background: scrolled ? "rgba(6,6,9,0.8)" : "rgba(6,6,9,0)", backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none", border: scrolled ? "1px solid rgba(79,117,255,0.12)" : "1px solid transparent", borderRadius: 16, padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.35s, border-color 0.35s, backdrop-filter 0.35s" }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6b8fff 0%, #4f75ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(79,117,255,0.4)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 6 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 15, color: "#eaeaff", letterSpacing: "-0.04em" }}>Vertuoso</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="nav-desktop">
            {links.map((l) => (
              <button key={l.label} onClick={() => go(l.href)} style={{ background: "none", border: "none", cursor: "pointer", color: "#505080", fontSize: 13, fontWeight: 500, padding: 0, transition: "color 0.15s", fontFamily: "Inter" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#eaeaff")} onMouseLeave={(e) => (e.currentTarget.style.color = "#505080")}>{l.label}</button>
            ))}
            <Link to="/ticket" style={{ color: "#505080", fontSize: 13, fontWeight: 500, fontFamily: "Inter", textDecoration: "none", transition: "color 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#eaeaff")} onMouseLeave={(e) => (e.currentTarget.style.color = "#505080")}>Track Ticket</Link>
            <Link to="/staff" style={{ color: "#303060", fontSize: 13, fontWeight: 500, fontFamily: "Inter", textDecoration: "none", transition: "color 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#6b8fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "#303060")}>Staff</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => go("#contact")} className="nav-desktop" style={{ background: "rgba(79,117,255,0.12)", color: "#8aa8ff", border: "1px solid rgba(79,117,255,0.2)", borderRadius: 10, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "Inter" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79,117,255,0.2)"; e.currentTarget.style.color = "#c0d0ff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(79,117,255,0.12)"; e.currentTarget.style.color = "#8aa8ff"; }}>Contact</button>
            <button onClick={() => go("#contact")} style={{ background: "#4f75ff", color: "#fff", border: "none", borderRadius: 10, padding: "7px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 24px rgba(79,117,255,0.35)", transition: "all 0.2s", fontFamily: "Inter" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#3d62ff"; e.currentTarget.style.boxShadow = "0 0 36px rgba(79,117,255,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#4f75ff"; e.currentTarget.style.boxShadow = "0 0 24px rgba(79,117,255,0.35)"; e.currentTarget.style.transform = ""; }}>Get a Quote</button>
            <button className="hamburger" onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#eaeaff", padding: 4 }}>{open ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} style={{ position: "fixed", top: 80, left: 16, right: 16, zIndex: 99, background: "rgba(10,10,18,0.98)", backdropFilter: "blur(24px)", borderRadius: 16, border: "1px solid rgba(79,117,255,0.15)", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {links.map((l) => (<button key={l.label} onClick={() => go(l.href)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8080c0", fontSize: 15, fontWeight: 500, textAlign: "left", padding: 0, fontFamily: "Inter" }}>{l.label}</button>))}
            <button onClick={() => go("#contact")} style={{ background: "#4f75ff", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8, fontFamily: "Inter" }}>Get a Quote</button>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@media (max-width: 720px) { .nav-desktop { display: none !important; } .hamburger { display: flex !important; } }`}</style>
    </>
  );
}