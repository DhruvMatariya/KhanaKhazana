import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { C, gradients, glass } from './tokens';

const testimonials = [
  {
    quote: "We cut order errors by 73% in the first month. Kitchen staff finally know what's happening in real time — no more shouting across the pass.",
    metric: '73% fewer order errors',
    metricColor: C.rose,
    name: 'Rachel Torres',
    role: 'Executive Chef',
    restaurant: 'Ember Kitchen',
    initials: 'RT',
    gradient: gradients.roseOrange,
  },
  {
    quote: "Table turnovers jumped 28% within six weeks. That's real money added to the bottom line — not a dashboard vanity metric.",
    metric: '+28% faster table turns',
    metricColor: C.emerald,
    name: 'James Cho',
    role: 'Operations Director',
    restaurant: 'Umami House',
    initials: 'JC',
    gradient: gradients.emerald,
  },
  {
    quote: "Setting up took less than a day. Now I have full visibility across all three locations from a single screen. I can't imagine running shifts without it.",
    metric: '3 locations, 1 dashboard',
    metricColor: C.indigo,
    name: 'Sofia Martinez',
    role: 'Owner',
    restaurant: 'La Paloma Group',
    initials: 'SM',
    gradient: gradients.indigo,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ background: C.bg, padding: '80px 0 100px', position: 'relative' }}>
      {/* Background glow */}
      <div
        style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '900px', height: '600px',
          background: 'radial-gradient(ellipse, rgba(251,113,133,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '20px',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.emerald }} />
            <span style={{ fontSize: '13px', color: C.emerald, fontWeight: 600 }}>Real results, real restaurants</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-1px', lineHeight: 1.1 }}>
            Numbers their managers<br />
            <span style={{ background: gradients.emerald, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              can't stop talking about.
            </span>
          </h2>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px' }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                style={{
                  ...glass,
                  padding: '32px',
                  border: `1px solid ${C.border}`,
                  height: '100%',
                  display: 'flex', flexDirection: 'column',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Gradient corner accent */}
                <div
                  style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '120px', height: '120px',
                    background: `radial-gradient(circle at top right, ${t.metricColor}15, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Quote icon */}
                <div
                  style={{
                    width: '40px', height: '40px',
                    borderRadius: '12px',
                    background: t.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: `0 4px 16px ${t.metricColor}40`,
                    flexShrink: 0,
                  }}
                >
                  <Quote size={18} color="white" />
                </div>

                {/* Quote */}
                <p style={{ fontSize: '16px', color: C.text, lineHeight: 1.75, fontWeight: 500, marginBottom: '24px', flex: 1 }}>
                  "{t.quote}"
                </p>

                {/* Metric badge */}
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: `${t.metricColor}12`,
                    border: `1px solid ${t.metricColor}30`,
                    borderRadius: '10px', padding: '10px 16px',
                    marginBottom: '24px',
                    alignSelf: 'flex-start',
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.metricColor }} />
                  <span style={{ fontSize: '13px', color: t.metricColor, fontWeight: 700 }}>{t.metric}</span>
                </div>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: `1px solid ${C.border}`, paddingTop: '20px' }}>
                  <div
                    style={{
                      width: '40px', height: '40px',
                      borderRadius: '12px',
                      background: t.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 800, color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: C.text, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: C.muted, fontWeight: 500 }}>{t.role} · {t.restaurant}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
