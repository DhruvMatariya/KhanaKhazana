import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { C, gradients, glass } from './tokens';

const faqs = [
  {
    question: 'How long does setup take?',
    answer: 'Most restaurants are fully live within 24 hours. You add your profile, import your menu, and invite your team — we handle the configuration. No engineers required.',
  },
  {
    question: 'Can I integrate KhanaKhazana with my existing POS?',
    answer: 'Yes. KhanaKhazana connects natively with Square, Toast, Clover, and Lightspeed. Custom POS integrations are available on the Scale plan. If you\'re unsure about your setup, our team will walk you through it during onboarding.',
  },
  {
    question: 'Do you support multi-location operations?',
    answer: 'Absolutely. The Growth plan supports up to 3 locations with a unified cross-location dashboard. The Scale plan covers unlimited locations with advanced reporting and custom segmentation by location.',
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'No contracts. KhanaKhazana is billed monthly, and you can cancel anytime. We earn your business every month — that\'s how we prefer it.',
  },
  {
    question: 'How is my restaurant\'s data protected?',
    answer: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II certified and GDPR compliant. We never sell or share your operational data. You own your data — always.',
  },
  {
    question: 'What kind of support do I get?',
    answer: 'Starter plan: email support with 48h SLA. Growth plan: priority email and chat with 4h SLA. Scale plan: dedicated account manager with a direct phone line. All plans get access to our documentation and onboarding library.',
  },
  {
    question: 'Does KhanaKhazana work for ghost kitchens or delivery-only concepts?',
    answer: 'Yes. KhanaKhazana\'s online order pipeline and daily summary modules are built to handle delivery-first operations. You can run KhanaKhazana without the dine-in module if your concept doesn\'t need floor management.',
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div
        style={{
          ...glass,
          borderRadius: '16px',
          border: open ? '1px solid rgba(251,113,133,0.25)' : `1px solid ${C.border}`,
          overflow: 'hidden',
          transition: 'border-color 0.3s',
          boxShadow: open ? '0 8px 32px rgba(251,113,133,0.08)' : '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: '100%', textAlign: 'left',
            padding: '22px 24px',
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: C.text,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.4, flex: 1 }}>
            {faq.question}
          </span>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            style={{
              flexShrink: 0,
              width: '28px', height: '28px',
              borderRadius: '8px',
              background: open ? 'rgba(251,113,133,0.15)' : 'rgba(255,255,255,0.06)',
              border: open ? '1px solid rgba(251,113,133,0.3)' : `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.25s, border-color 0.25s',
            }}
          >
            <Plus size={14} color={open ? C.rose : C.muted} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 24px 22px' }}>
                <div style={{ height: '1px', background: C.border, marginBottom: '16px' }} />
                <p style={{ fontSize: '15px', color: C.muted, lineHeight: 1.75 }}>
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" style={{ background: C.bg, padding: '80px 0 100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px' }}>

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
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '20px',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.indigo }} />
            <span style={{ fontSize: '13px', color: C.indigo, fontWeight: 600 }}>Common questions</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.1 }}>
            Everything you<br />
            <span style={{ background: gradients.indigo, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              need to know.
            </span>
          </h2>
          <p style={{ fontSize: '16px', color: C.muted, lineHeight: 1.7 }}>
            Still have questions? <a href="#" style={{ color: C.rose, fontWeight: 600, textDecoration: 'none' }}>Talk to our team →</a>
          </p>
        </motion.div>

        {/* FAQ items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
