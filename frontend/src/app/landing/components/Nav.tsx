import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { C, gradients } from './tokens';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
}

function goToLogin() {
  window.location.href = '/login';
}

export default function Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // If on landing page, scroll to top. Otherwise, navigate to landing page
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
          background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            height: '72px',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
            onClick={handleLogoClick}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: gradients.roseOrange,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(251, 113, 133, 0.4)',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.7" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.7" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.4" />
              </svg>
            </div>
            <span style={{ color: C.text, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>
              KhanaKhazana
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex" style={{ gap: '36px', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                style={{
                  color: C.muted,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex" style={{ gap: '12px', alignItems: 'center' }}>
            <button
              onClick={goToLogin}
              style={{
                background: 'transparent',
                border: `1px solid ${C.borderStrong}`,
                borderRadius: '12px',
                padding: '10px 20px',
                color: C.text,
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderStrong; e.currentTarget.style.background = 'transparent'; }}
            >
              Sign In
            </button>
            <button
              onClick={goToLogin}
              style={{
                background: gradients.roseOrange,
                border: 'none',
                borderRadius: '12px',
                padding: '10px 24px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s',
                boxShadow: '0 4px 20px rgba(251, 113, 133, 0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(251, 113, 133, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(251, 113, 133, 0.35)';
              }}
            >
              Book a Demo
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: '10px',
              padding: '8px',
              color: C.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              zIndex: 99,
              background: 'rgba(10,10,10,0.98)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: `1px solid ${C.border}`,
              padding: '20px 32px 28px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); setMobileOpen(false); }}
                  style={{
                    color: C.muted,
                    fontSize: '16px',
                    textDecoration: 'none',
                    padding: '12px 0',
                    borderBottom: `1px solid ${C.border}`,
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={goToLogin}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${C.borderStrong}`,
                    borderRadius: '12px',
                    padding: '14px 24px',
                    color: C.text,
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={goToLogin}
                  style={{
                    background: gradients.roseOrange,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: '0 4px 20px rgba(251, 113, 133, 0.35)',
                  }}
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
