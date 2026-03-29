import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { C, gradients, glass } from './tokens';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 'Free', annual: 'Free' },
    priceNote: 'Forever free',
    description: 'Perfect for single-location restaurants testing the waters.',
    color: C.muted,
    gradient: 'linear-gradient(135deg, #52525B 0%, #71717A 100%)',
    glow: 'rgba(113,113,122,0.2)',
    featured: false,
    cta: 'Start Free',
    features: [
      '1 restaurant location',
      'Up to 50 orders per day',
      'Real-time dashboard',
      'Dine-in table management',
      'Email support (48h SLA)',
      'Daily summary reports',
    ],
  },
  {
    name: 'Growth',
    price: { monthly: '$79', annual: '$63' },
    priceNote: '/month per location',
    description: 'For multi-location operators who need full visibility and control.',
    color: C.rose,
    gradient: gradients.roseOrange,
    glow: 'rgba(251,113,133,0.25)',
    featured: true,
    cta: 'Book a Demo',
    features: [
      'Up to 3 restaurant locations',
      'Unlimited orders per day',
      'Online order pipeline',
      'Multi-channel order consolidation',
      'Priority support (4h SLA)',
      'API access (standard)',
      'Team accounts (up to 15)',
      'CSV & PDF export',
    ],
  },
  {
    name: 'Scale',
    price: { monthly: 'Custom', annual: 'Custom' },
    priceNote: 'Tailored to your operation',
    description: 'For restaurant groups and chains ready for enterprise-grade ops.',
    color: C.indigo,
    gradient: gradients.indigo,
    glow: 'rgba(99,102,241,0.25)',
    featured: false,
    cta: 'Talk to Sales',
    features: [
      'Unlimited locations',
      'Custom POS integrations',
      'Dedicated account manager',
      'White-glove onboarding',
      'SLA guarantee (99.9%)',
      'Advanced analytics suite',
      'Custom reporting & dashboards',
      'Phone support line',
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" style={{ background: C.bg, padding: '80px 0 100px', position: 'relative' }}>
      {/* Background glow */}
      <div
        style={{
          position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(251,113,133,0.07) 0%, transparent 70%)',
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
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.25)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '20px',
            }}
          >
            <Zap size={13} color={C.rose} />
            <span style={{ fontSize: '13px', color: C.rose, fontWeight: 600 }}>Simple, transparent pricing</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.1 }}>
            Pay for what you use.<br />
            <span style={{ background: gradients.roseOrange, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              No surprises.
            </span>
          </h2>
          <p style={{ fontSize: '18px', color: C.muted, maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            No long contracts, no setup fees. Start free and upgrade when your operation grows.
          </p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: '100px', padding: '4px 8px' }}>
            <button
              onClick={() => setAnnual(false)}
              style={{
                padding: '8px 20px', borderRadius: '100px', border: 'none',
                background: !annual ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: !annual ? C.text : C.muted,
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                padding: '8px 20px', borderRadius: '100px', border: 'none',
                background: annual ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: annual ? C.text : C.muted,
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              Annual
              <span style={{ background: gradients.emerald, borderRadius: '100px', padding: '2px 8px', fontSize: '10px', color: 'white', fontWeight: 700 }}>
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '20px', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ position: 'relative' }}
            >
              {plan.featured && (
                <div
                  style={{
                    position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                    background: gradients.roseOrange,
                    borderRadius: '100px', padding: '5px 18px',
                    fontSize: '12px', color: 'white', fontWeight: 700,
                    boxShadow: `0 4px 16px ${plan.glow}`,
                    whiteSpace: 'nowrap', zIndex: 2,
                  }}
                >
                  Most Popular
                </div>
              )}

              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                style={{
                  ...glass,
                  padding: '36px 28px',
                  border: plan.featured ? `1px solid rgba(251,113,133,0.35)` : `1px solid ${C.border}`,
                  height: '100%',
                  display: 'flex', flexDirection: 'column',
                  boxShadow: plan.featured ? `0 0 60px rgba(251,113,133,0.12), 0 16px 60px rgba(0,0,0,0.4)` : '0 8px 32px rgba(0,0,0,0.3)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Corner glow */}
                {plan.featured && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0, width: '200px', height: '200px',
                    background: 'radial-gradient(circle at top right, rgba(251,113,133,0.12), transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Plan name + description */}
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: `${plan.color}15`,
                    border: `1px solid ${plan.color}35`,
                    borderRadius: '100px', padding: '4px 12px',
                    marginBottom: '20px', alignSelf: 'flex-start',
                  }}
                >
                  <span style={{ fontSize: '12px', color: plan.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{plan.name}</span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: plan.price.monthly === 'Custom' || plan.price.monthly === 'Free' ? '36px' : '44px',
                      fontWeight: 900, color: C.text, letterSpacing: '-2px', lineHeight: 1,
                    }}
                  >
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly !== 'Free' && plan.price.monthly !== 'Custom' && (
                    <span style={{ fontSize: '14px', color: C.muted, fontWeight: 500, marginLeft: '4px' }}>
                      {plan.priceNote}
                    </span>
                  )}
                  {(plan.price.monthly === 'Free' || plan.price.monthly === 'Custom') && (
                    <div style={{ fontSize: '13px', color: C.muted, marginTop: '4px' }}>{plan.priceNote}</div>
                  )}
                </div>

                <p style={{ fontSize: '14px', color: C.muted, lineHeight: 1.65, marginBottom: '28px' }}>
                  {plan.description}
                </p>

                {/* CTA */}
                <button
                  style={{
                    background: plan.featured ? plan.gradient : 'rgba(255,255,255,0.06)',
                    border: plan.featured ? 'none' : `1px solid ${C.borderStrong}`,
                    borderRadius: '14px', padding: '14px 24px',
                    color: C.text, fontSize: '15px', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.25s',
                    width: '100%', marginBottom: '28px',
                    boxShadow: plan.featured ? `0 6px 24px ${plan.glow}` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    if (plan.featured) e.currentTarget.style.boxShadow = `0 12px 36px ${plan.glow}`;
                    else e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    if (plan.featured) e.currentTarget.style.boxShadow = `0 6px 24px ${plan.glow}`;
                    else e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                >
                  {plan.cta} <ArrowRight size={16} />
                </button>

                {/* Divider */}
                <div style={{ height: '1px', background: C.border, marginBottom: '24px' }} />

                {/* Feature list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div
                        style={{
                          width: '18px', height: '18px', borderRadius: '6px',
                          background: `${plan.color}18`,
                          border: `1px solid ${plan.color}35`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: '1px',
                        }}
                      >
                        <Check size={11} color={plan.color} />
                      </div>
                      <span style={{ fontSize: '14px', color: C.muted, fontWeight: 500, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <p style={{ fontSize: '14px', color: C.subtle }}>
            All plans include SSL encryption, 99.9% uptime SLA (Growth+), and GDPR-compliant data handling.
            <span style={{ color: C.muted }}> No credit card required to start.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
