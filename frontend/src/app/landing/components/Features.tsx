import { motion } from 'motion/react';
import { TrendingUp, LayoutGrid, ShoppingBag, BookOpen, CheckCircle2, BarChart2 } from 'lucide-react';
import { C, gradients, glass } from './tokens';

// ── Mini Dashboard Mockup ────────────────────────────────
function DashboardVisual() {
  const bars = [45, 62, 50, 78, 68, 90, 82];
  const max = 90;
  return (
    <div style={{ ...glass, padding: '24px', border: `1px solid ${C.border}`, height: '100%' }}>
      <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.rose }} />
        Live Revenue Stream
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Today', value: '$14,820', up: true },
          { label: 'Yesterday', value: '$13,200', up: false },
          { label: 'This Week', value: '$82,440', up: true },
          { label: 'Avg Order', value: '$38.50', up: true },
        ].map((s) => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 12px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: '10px', color: C.subtle, marginBottom: '4px', fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: '16px', color: C.text, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '10px', color: C.subtle, fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>7-Day Revenue</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px' }}>
        {bars.map((val, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            style={{
              flex: 1,
              height: `${(val / max) * 60}px`,
              borderRadius: '4px 4px 0 0',
              background: i === bars.length - 1 ? gradients.roseOrange : 'rgba(251,113,133,0.22)',
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: C.subtle, fontWeight: 500 }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

// ── Mini Dine-In Mockup ──────────────────────────────────
function DineInVisual() {
  const tables = [
    { id: 1, guests: 4, status: 'occupied', time: '45m' },
    { id: 2, guests: 2, status: 'available', time: '' },
    { id: 3, guests: 0, status: 'reserved', time: '7 PM' },
    { id: 4, guests: 6, status: 'occupied', time: '12m' },
    { id: 5, guests: 0, status: 'available', time: '' },
    { id: 6, guests: 3, status: 'occupied', time: '28m' },
    { id: 7, guests: 0, status: 'reserved', time: '8 PM' },
    { id: 8, guests: 0, status: 'available', time: '' },
    { id: 9, guests: 5, status: 'occupied', time: '8m' },
  ];
  const statusConfig: Record<string, { bg: string; border: string; dot: string; label: string }> = {
    occupied: { bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.3)', dot: C.rose, label: 'Occ.' },
    available: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', dot: C.emerald, label: 'Free' },
    reserved: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', dot: C.indigo, label: 'Res.' },
  };
  return (
    <div style={{ ...glass, padding: '24px', border: `1px solid ${C.border}`, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.indigo }} />
          Floor Plan · Main Hall
        </div>
        <div style={{ fontSize: '11px', color: C.muted, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px 10px', border: `1px solid ${C.border}` }}>
          9 Tables
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {tables.map((t) => {
          const cfg = statusConfig[t.status];
          return (
            <motion.div
              key={t.id}
              whileHover={{ scale: 1.03 }}
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: C.text, fontWeight: 700 }}>T{t.id}</span>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.dot }} />
              </div>
              <div style={{ fontSize: '10px', color: C.subtle, fontWeight: 500 }}>
                {t.status === 'occupied' ? `${t.guests} guests · ${t.time}` : t.status === 'reserved' ? t.time : 'Open'}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: cfg.dot }} />
            <span style={{ fontSize: '10px', color: C.subtle, fontWeight: 500, textTransform: 'capitalize' }}>{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Mini Online Orders Mockup ────────────────────────────
function OrdersVisual() {
  const pipeline = [
    { label: 'New', count: 4, color: C.muted },
    { label: 'Confirmed', count: 7, color: C.indigo },
    { label: 'Preparing', count: 5, color: C.orange },
    { label: 'Ready', count: 3, color: C.emerald },
  ];
  const recentOrders = [
    { id: '#2041', customer: 'Riya S.', item: 'Truffle Pasta', status: 'Preparing', statusColor: C.orange, total: '$22.00' },
    { id: '#2042', customer: 'Dan K.', item: 'Grilled Salmon', status: 'Ready', statusColor: C.emerald, total: '$34.00' },
    { id: '#2043', customer: 'Sarah M.', item: 'Caesar Salad', status: 'Confirmed', statusColor: C.indigo, total: '$18.00' },
  ];
  return (
    <div style={{ ...glass, padding: '24px', border: `1px solid ${C.border}`, height: '100%' }}>
      <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.orange }} />
        Online Order Pipeline
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {pipeline.map((p) => (
          <div key={p.label} style={{ background: `${p.color}12`, border: `1px solid ${p.color}30`, borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: p.color, lineHeight: 1 }}>{p.count}</div>
            <div style={{ fontSize: '9px', color: C.subtle, fontWeight: 500, marginTop: '3px' }}>{p.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {recentOrders.map((o) => (
          <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '10px 12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', color: C.subtle, fontWeight: 500 }}>{o.id}</span>
                <span style={{ fontSize: '11px', color: C.muted, fontWeight: 500 }}>· {o.customer}</span>
              </div>
              <div style={{ fontSize: '12px', color: C.text, fontWeight: 600 }}>{o.item}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <div style={{ fontSize: '11px', color: o.statusColor, fontWeight: 600, background: `${o.statusColor}15`, borderRadius: '100px', padding: '2px 8px', border: `1px solid ${o.statusColor}35` }}>
                {o.status}
              </div>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>{o.total}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Mini Summary Mockup ──────────────────────────────────
function SummaryVisual() {
  const shifts = [
    { name: 'Lunch', revenue: '$4,240', orders: 68, pct: 64, color: C.indigo },
    { name: 'Dinner', revenue: '$8,620', orders: 102, pct: 88, color: C.rose },
    { name: 'Late Night', revenue: '$1,960', orders: 24, pct: 38, color: C.orange },
  ];
  return (
    <div style={{ ...glass, padding: '24px', border: `1px solid ${C.border}`, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.emerald }} />
          Daily Performance
        </div>
        <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', padding: '3px 10px', border: '1px solid rgba(16,185,129,0.2)', color: C.emerald, fontWeight: 600 }}>
          Sun Mar 29
        </span>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px', border: `1px solid ${C.border}`, marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', color: C.subtle, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Total Revenue</div>
        <div style={{ fontSize: '32px', fontWeight: 800, color: C.text, letterSpacing: '-1px', lineHeight: 1 }}>$14,820</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
          <TrendingUp size={12} color={C.emerald} />
          <span style={{ fontSize: '12px', color: C.emerald, fontWeight: 600 }}>+12.4% vs yesterday</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {shifts.map((s) => (
          <div key={s.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: C.muted, fontWeight: 600 }}>{s.name}</span>
              <span style={{ fontSize: '12px', color: C.text, fontWeight: 700 }}>{s.revenue} · <span style={{ color: C.subtle }}>{s.orders} orders</span></span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: s.color, borderRadius: '100px' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Feature data ─────────────────────────────────────────
const features = [
  {
    icon: BarChart2,
    badge: 'Analytics',
    badgeColor: C.rose,
    headline: 'See revenue, orders, and trends — before your shift even ends.',
    body: "KhanaKhazana's real-time dashboard gives you a live pulse on every metric that matters. Spot your peak hours, track table utilization, and compare today against any prior period — all from a single view.",
    bullets: ['Live revenue and order counters', 'Peak-hour detection', 'Table utilization heatmap', 'Day-over-day comparisons'],
    visual: <DashboardVisual />,
    reversed: false,
    accent: C.rose,
  },
  {
    icon: LayoutGrid,
    badge: 'Dine-In',
    badgeColor: C.indigo,
    headline: 'Your floor, your way. Every table status — one glance.',
    body: 'Stop running back and forth. KhanaKhazana gives every host and manager a live floor view with real-time table status, seating duration, and waitlist queue. Fewer mistakes, faster turns.',
    bullets: ['Live table status grid', 'Seating duration timers', 'Reservation & walk-in management', 'Waitlist with SMS alerts'],
    visual: <DineInVisual />,
    reversed: true,
    accent: C.indigo,
  },
  {
    icon: ShoppingBag,
    badge: 'Online Orders',
    badgeColor: C.orange,
    headline: 'Your delivery pipeline, tracked from tap to table.',
    body: "Third-party orders, your own website, or QR dine-in — KhanaKhazana consolidates every online order into a single, prioritized queue. No missed tickets, no blind spots.",
    bullets: ['Unified multi-channel order feed', 'Status tracking across platforms', 'Kitchen queue prioritization', 'Customer ETA messaging'],
    visual: <OrdersVisual />,
    reversed: false,
    accent: C.orange,
  },
  {
    icon: BookOpen,
    badge: 'Daily Summary',
    badgeColor: C.emerald,
    headline: 'Close every shift knowing exactly what worked.',
    body: "End-of-day reports that don't require a finance degree. KhanaKhazana compiles every shift into a clear performance snapshot — revenue by period, top items, staffing efficiency, and trend signals.",
    bullets: ['Automated shift summaries', 'Revenue by time block', 'Menu performance insights', 'Exportable PDF & CSV reports'],
    visual: <SummaryVisual />,
    reversed: true,
    accent: C.emerald,
  },
];

export default function Features() {
  return (
    <section id="features" style={{ background: C.bg, padding: '80px 0 100px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '20px',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.indigo }} />
            <span style={{ fontSize: '13px', color: C.indigo, fontWeight: 600 }}>Built for operations teams</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.1 }}>
            Everything you need to run <br />
            <span style={{ background: gradients.indigo, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              a tighter operation.
            </span>
          </h2>
          <p style={{ fontSize: '18px', color: C.muted, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Four core modules designed around the actual flow of a restaurant — not generic project management software.
          </p>
        </motion.div>

        {/* Feature blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.badge}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <div
                  className={`flex flex-col ${feat.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  style={{ gap: '56px', alignItems: 'center' }}
                >
                  {/* Text side */}
                  <div style={{ flex: '1 1 0', minWidth: 0 }}>
                    <div
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: `${feat.accent}12`,
                        border: `1px solid ${feat.accent}30`,
                        borderRadius: '100px', padding: '6px 14px', marginBottom: '24px',
                      }}
                    >
                      <Icon size={13} color={feat.accent} />
                      <span style={{ fontSize: '12px', color: feat.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{feat.badge}</span>
                    </div>
                    <h3 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: C.text, letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '16px' }}>
                      {feat.headline}
                    </h3>
                    <p style={{ fontSize: '16px', color: C.muted, lineHeight: 1.75, marginBottom: '28px' }}>
                      {feat.body}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {feat.bullets.map((b) => (
                        <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CheckCircle2 size={16} color={feat.accent} style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '15px', color: C.muted, fontWeight: 500 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual side */}
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    style={{ flex: '1 1 0', minWidth: 0, minHeight: '340px' }}
                  >
                    {feat.visual}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}