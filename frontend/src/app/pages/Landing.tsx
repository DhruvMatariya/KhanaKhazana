import Nav from "../landing/components/Nav";
import Hero from "../landing/components/Hero";
import TrustStrip from "../landing/components/TrustStrip";
import Features from "../landing/components/Features";
import HowItWorks from "../landing/components/HowItWorks";
import Testimonials from "../landing/components/Testimonials";
import Pricing from "../landing/components/Pricing";
import FAQ from "../landing/components/FAQ";
import Footer from "../landing/components/Footer";

export default function Landing() {
  return (
    <div
      style={{
        background: "#0A0A0A",
        color: "#FFFFFF",
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <Nav />
      <Hero />
      <TrustStrip />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
