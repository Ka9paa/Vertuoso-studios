import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { TrustBar } from "./components/TrustBar";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export function MainSite() {
  return (
    <div style={{ background: "#060609", minHeight: "100vh", overflowX: "hidden" }}>
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <Projects />
      <TrustBar />
      <Testimonials />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </div>
  );
}
