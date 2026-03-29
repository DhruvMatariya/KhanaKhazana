import { motion } from 'motion/react';
import { ArrowRight, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { C, gradients, glass } from './tokens';

const footerLinks = {
  Product: ['Dashboard', 'Dine-In', 'Online Orders', 'Today Summary', 'Integrations', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'GDPR'],
  Support: ['Documentation', 'Help Center', 'Status Page', 'Contact'],
};

function goToLogin() {
  window.location.href = '/login';
}

export default function Footer() {
  return (
    <>
      {/* Final CTA */}
      <section style={{ background: C.bg, padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Glow blobs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(251,113,133,0.15) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.25)',
                borderRadius: '100px', padding: '6px 16px', marginBottom: '28px',
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.rose }}
              />
              <span style={{ fontSize: '13px', color: C.rose, fontWeight: 600 }}>Ready when you are</span>
            </div>

            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: C.text, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: '20px' }}>
              Ready to run your restaurant<br />
              <span style={{ background: gradients.roseOrange, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                like clockwork?
              </span>
            </h2>

            <p style={{ fontSize: '18px', color: C.muted, lineHeight: 1.7, marginBottom: '48px', maxWidth: '520px', margin: '0 auto 48px' }}>
              Join 500+ restaurant teams who use KhanaKhazana to turn every shift into a sharper, faster, more profitable operation.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={goToLogin}
                style={{
                  background: gradients.roseOrange,
                  border: 'none', borderRadius: '18px',
                  padding: '18px 44px',
                  color: '#FFFFFF', fontSize: '17px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.25s',
                  boxShadow: '0 10px 40px rgba(251,113,133,0.4)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(251,113,133,0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(251,113,133,0.4)';
                }}
              >
                Book a Demo <ArrowRight size={20} />
              </button>
              <button
                onClick={goToLogin}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${C.borderStrong}`,
                  borderRadius: '18px', padding: '18px 44px',
                  color: C.text, fontSize: '17px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Start Free Trial
              </button>
            </div>

            <p style={{ fontSize: '13px', color: C.subtle, marginTop: '24px' }}>
              No credit card needed · Live in 24h · Cancel any time
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#070707', borderTop: `1px solid ${C.border}`, padding: '64px 0 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
          <div className="grid grid-cols-2 md:grid-cols-6" style={{ gap: '40px', marginBottom: '56px' }}>
            {/* Brand */}
            <div className="col-span-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: '8px',
                    background: gradients.roseOrange,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" />
                    <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.7" />
                    <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.7" />
                    <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.4" />
                  </svg>
                </div>
                <span style={{ color: C.text, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>KhanaKhazana</span>
              </div>
              <p style={{ fontSize: '14px', color: C.subtle, lineHeight: 1.7, maxWidth: '240px', marginBottom: '24px' }}>
                Restaurant operations, finally under control. Real-time. Reliable. Ready for every shift.
              </p>
              {/* Social icons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {[Globe, Mail, Phone, MapPin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: '36px', height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: C.subtle, textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)';
                      (e.currentTarget as HTMLAnchorElement).style.color = C.text;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = C.borderStrong;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLAnchorElement).style.color = C.subtle;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = C.border;
                    }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <div style={{ fontSize: '12px', color: C.subtle, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  {category}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        fontSize: '14px', color: C.muted,
                        textDecoration: 'none', fontWeight: 500,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: C.subtle }}>
              © 2026 KhanaKhazana Technologies, Inc. All rights reserved.
            </span>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy', 'Terms', 'Security'].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{ fontSize: '13px', color: C.subtle, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.muted)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.subtle)}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
