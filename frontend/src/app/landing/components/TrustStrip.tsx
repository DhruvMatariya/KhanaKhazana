import { motion } from 'motion/react';
import { C, glass } from './tokens';

const metrics = [
  { value: '2.4M+', label: 'Orders Handled', color: C.rose },
  { value: '40%', label: 'Avg Time Saved', color: C.orange },
  { value: '4.8★', label: 'Customer Rating', color: C.emerald },
  { value: '99.9%', label: 'Platform Uptime', color: C.indigo },
];

const partnerNames = [
  'Ember Kitchen',
  'Umami House',
  'La Paloma',
  'Coastal Eats',
  'The Garden Fork',
  'Salt & Stone',
  'Plum District',
  'Hearth Co.',
];

export default function TrustStrip() {
  return (
    <section style={{ background: C.bg, paddingBottom: '80px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

        {/* Trusted by label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '36px' }}
        >
          <span style={{ fontSize: '13px', color: C.subtle, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Trusted by restaurant teams across the country
          </span>
        </motion.div>

        {/* Partner logos strip (scrolling) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'relative', overflow: 'hidden', marginBottom: '64px' }}
        >
          {/* Left/right fade */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to right, #0A0A0A, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to left, #0A0A0A, transparent)', zIndex: 2, pointerEvents: 'none' }} />

          <div
            style={{
              display: 'flex', gap: '0', alignItems: 'center',
              animation: 'marquee 28s linear infinite',
            }}
          >
            {[...partnerNames, ...partnerNames, ...partnerNames].map((name, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  padding: '12px 40px',
                  borderRight: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '15px', color: C.subtle, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '16px' }}>
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                ...glass,
                padding: '28px 24px',
                textAlign: 'center',
                border: `1px solid ${C.border}`,
                transition: 'border-color 0.25s, transform 0.25s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${m.color}40`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = C.border;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 800, letterSpacing: '-1px',
                  background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '6px',
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: '13px', color: C.muted, fontWeight: 500 }}>{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${(100 / 3).toFixed(4)}%); }
        }
      `}</style>
    </section>
  );
}
