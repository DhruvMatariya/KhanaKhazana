import { motion } from 'motion/react';
import { Plug, MonitorCheck, BarChart3, ArrowRight } from 'lucide-react';
import { C, gradients, glass } from './tokens';

const steps = [
  {
    number: '01',
    icon: Plug,
    gradient: gradients.roseOrange,
    glow: 'rgba(251,113,133,0.25)',
    title: 'Connect your operation',
    body: "Add your restaurant profile, upload your menu, and invite your team. Most setups complete in under 24 hours — no engineering or IT support needed.",
    detail: 'Works with Square, Toast, Clover, Lightspeed and more.',
  },
  {
    number: '02',
    icon: MonitorCheck,
    gradient: gradients.indigo,
    glow: 'rgba(99,102,241,0.25)',
    title: 'Track everything in real time',
    body: 'Every table seating, every online order, and every register transaction flows into a live dashboard your whole team can see and act on — together.',
    detail: 'Zero delay. Sub-second data refresh.',
  },
  {
    number: '03',
    icon: BarChart3,
    gradient: gradients.emerald,
    glow: 'rgba(16,185,129,0.25)',
    title: 'Act on daily insights',
    body: 'At the close of every shift, KhanaKhazana surfaces what worked, what slipped, and what to prepare for tomorrow. Decisions backed by your own data.',
    detail: 'Automated nightly summary delivered to your inbox.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: C.bg, padding: '80px 0 100px', position: 'relative' }}>
      {/* Background accent */}
      <div
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '800px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)',
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
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.25)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '20px',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.rose }} />
            <span style={{ fontSize: '13px', color: C.rose, fontWeight: 600 }}>Simple by design</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.1 }}>
            Up and running in<br />
            <span style={{ background: gradients.roseOrange, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              three steps.
            </span>
          </h2>
          <p style={{ fontSize: '18px', color: C.muted, maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            No long implementation projects. No consultants. KhanaKhazana is built to activate fast and pay off faster.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col lg:flex-row" style={{ gap: '24px', alignItems: 'stretch' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                style={{ flex: 1 }}
              >
                <motion.div
                  whileHover={{ y: -8, boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${C.borderStrong}` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    ...glass,
                    padding: '36px 32px',
                    border: `1px solid ${C.border}`,
                    height: '100%',
                    display: 'flex', flexDirection: 'column',
                    cursor: 'default',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Step number watermark */}
                  <div
                    style={{
                      position: 'absolute', top: '20px', right: '24px',
                      fontSize: '64px', fontWeight: 900,
                      color: 'rgba(255,255,255,0.03)',
                      lineHeight: 1, letterSpacing: '-2px',
                      userSelect: 'none',
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: '56px', height: '56px',
                      borderRadius: '16px',
                      background: step.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '24px',
                      boxShadow: `0 8px 24px ${step.glow}`,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} color="white" />
                  </div>

                  {/* Step label */}
                  <div style={{ fontSize: '11px', color: C.subtle, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Step {step.number}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: C.text, letterSpacing: '-0.3px', marginBottom: '14px', lineHeight: 1.2 }}>
                    {step.title}
                  </h3>

                  {/* Body */}
                  <p style={{ fontSize: '15px', color: C.muted, lineHeight: 1.75, marginBottom: '20px', flex: 1 }}>
                    {step.body}
                  </p>

                  {/* Detail */}
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
                      padding: '10px 14px', border: `1px solid ${C.border}`,
                    }}
                  >
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.emerald, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: C.muted, fontWeight: 500 }}>{step.detail}</span>
                  </div>

                  {/* Connector arrow (between cards, desktop only) */}
                  {i < steps.length - 1 && (
                    <div
                      className="hidden lg:flex"
                      style={{
                        position: 'absolute',
                        top: '50%', right: '-28px',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        background: C.surfaceSolid,
                        border: `1px solid ${C.border}`,
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      }}
                    >
                      <ArrowRight size={14} color={C.muted} />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: '56px' }}
        >
          <button
            style={{
              background: gradients.roseOrange,
              border: 'none', borderRadius: '16px',
              padding: '16px 40px',
              color: '#FFFFFF', fontSize: '16px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.25s',
              boxShadow: '0 8px 32px rgba(251,113,133,0.35)',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(251,113,133,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(251,113,133,0.35)';
            }}
          >
            Get started today <ArrowRight size={18} />
          </button>
          <p style={{ fontSize: '13px', color: C.subtle, marginTop: '16px' }}>
            Most restaurants are live within 24 hours.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
