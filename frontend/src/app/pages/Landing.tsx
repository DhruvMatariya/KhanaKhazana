import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Nav from "../landing/components/Nav";
import Hero from "../landing/components/Hero";
import TrustStrip from "../landing/components/TrustStrip";
import Features from "../landing/components/Features";
import HowItWorks from "../landing/components/HowItWorks";
import Testimonials from "../landing/components/Testimonials";
import Pricing from "../landing/components/Pricing";
import FAQ from "../landing/components/FAQ";
import Footer from "../landing/components/Footer";
import FallingText from "../components/FallingText";
import { FoodGraphicsGrid } from "../components/FoodGraphics";

export default function Landing() {
  const [showAnimation, setShowAnimation] = useState(true);

  if (showAnimation) {
    return (
      <div
        style={{
          background: "#0A0A0A",
          color: "#FFFFFF",
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          overflowX: "hidden",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Background Image with High Transparency */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.08,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ width: "100%", height: "100vh", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <FallingText
            text="hungry? want food?"
            highlightWords={["hungry?", "food?"]}
            trigger="auto"
            backgroundColor="transparent"
            fontSize="clamp(1.5rem, 8vw, 4rem)"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          style={{
            textAlign: "center",
            marginTop: "40px",
            position: "relative",
            zIndex: 1,
          }}
          onAnimationComplete={() => {
            setTimeout(() => {
              setShowAnimation(false);
            }, 2000);
          }}
        >
          {/* Animated tagline with character-by-character reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                background:
                  'linear-gradient(135deg, #FF8C42 0%, #D45D2B 100%)',
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "20px",
                letterSpacing: "2px",
              }}
            >
              here's khanakhazana!
            </h2>
          </motion.div>

          {/* Food graphics with staggered entrance animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <FoodGraphicsGrid />
          </motion.div>

          {/* Animated decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            style={{
              height: "2px",
              background: "linear-gradient(90deg, transparent, #FF8C42, transparent)",
              width: "200px",
              margin: "20px auto",
              transformOrigin: "center",
            }}
          />
        </motion.div>

        <motion.button
          onClick={() => setShowAnimation(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.6 }}
          style={{
            marginTop: "40px",
            padding: "12px 32px",
            fontSize: "1rem",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #FF8C42 0%, #D45D2B 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 8px 24px rgba(255, 140, 66, 0.4)",
            transition: "box-shadow 0.3s ease",
          }}
          onHoverStart={(e: any) => {
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(255, 140, 66, 0.6)";
          }}
          onHoverEnd={(e: any) => {
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 140, 66, 0.4)";
          }}
        >
          Skip to Site
        </motion.button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0A0A0A",
        color: "#FFFFFF",
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
