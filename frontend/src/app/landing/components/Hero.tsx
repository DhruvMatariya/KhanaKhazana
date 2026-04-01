import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, Users, ShoppingBag, BarChart2 } from 'lucide-react';
import { C, gradients, glass } from './tokens';
import CircularGallery from '../../components/CircularGallery';

// ── Tiny bar chart ──────────────────────────────────────
const weekBars = [42, 58, 38, 67, 72, 88, 94];
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function MiniBarChart() {
  const max = Math.max(...weekBars);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '52px' }}>
      {weekBars.map((val, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.8 + i * 0.07, ease: 'easeOut' }}
            style={{
              width: '100%',
              height: `${(val / max) * 42}px`,
              borderRadius: '4px',
              background: i === weekBars.length - 1
                ? gradients.roseOrange
                : 'rgba(251, 113, 133, 0.25)',
              transformOrigin: 'bottom',
              boxShadow: i === weekBars.length - 1 ? '0 0 12px rgba(251,113,133,0.4)' : 'none',
            }}
          />
          <span style={{ fontSize: '9px', color: C.subtle, fontWeight: 500 }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Table status grid ────────────────────────────────────
const tableStatuses = [
  'occupied', 'occupied', 'reserved', 'occupied',
  'occupied', 'available', 'occupied', 'reserved',
  'available', 'occupied', 'occupied', 'available',
];

const statusColor: Record<string, string> = {
  occupied: '#FF8C42',
  available: '#10B981',
  reserved: '#6366F1',
};

// ── Order queue data ─────────────────────────────────────
const orders = [
  { id: '#1847', item: 'Biryani', status: 'Preparing', color: '#FF8C42' },
  { id: '#1848', item: 'Veggie Burger', status: 'Ready', color: '#10B981' },
  { id: '#1849', item: 'Pasta Primavera', status: 'New', color: '#A1A1AA' },
];

function goToLogin() {
  window.location.href = '/login';
}

// ── Dashboard Mockup ─────────────────────────────────────
function DashboardMockup() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '580px' }}>
      {/* Main dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
        style={{
          ...glass,
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Card chrome */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#FF8C42', opacity: 0.8 }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#6B5BA0', opacity: 0.8 }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981', opacity: 0.8 }} />
            </div>
            <span style={{ fontSize: '12px', color: C.muted, marginLeft: '6px', fontWeight: 500 }}>Today's Overview</span>
          </div>
          <span style={{ fontSize: '11px', color: C.subtle, fontWeight: 500 }}>Sun, Mar 29</span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Revenue', value: '₹14,820', change: '+12.4%', color: C.rose },
            { label: 'Orders', value: '183', change: '+8.2%', color: C.emerald },
            { label: 'Tables', value: '16/20', change: 'Active', color: C.indigo },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${C.border}`,
                borderRadius: '14px',
                padding: '12px',
              }}
            >
              <div style={{ fontSize: '10px', color: C.subtle, marginBottom: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
              <div style={{ fontSize: '18px', color: C.text, fontWeight: 700, lineHeight: 1, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: stat.color, fontWeight: 600 }}>↑ {stat.change}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ marginBottom: '4px' }}>
          <div style={{ fontSize: '10px', color: C.subtle, marginBottom: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue Last 7 Days</div>
          <MiniBarChart />
        </div>
      </motion.div>

      {/* Floating order queue card */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '-28px',
          right: '-32px',
          ...glass,
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          width: '200px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShoppingBag size={12} color={C.rose} />
            <span style={{ fontSize: '11px', color: C.text, fontWeight: 600 }}>Order Queue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}
            />
            <span style={{ fontSize: '9px', color: C.emerald, fontWeight: 600 }}>LIVE</span>
          </div>
        </div>
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 0',
              borderBottom: i < orders.length - 1 ? `1px solid ${C.border}` : 'none',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', color: C.subtle, fontWeight: 500 }}>{order.id}</div>
              <div style={{ fontSize: '12px', color: C.text, fontWeight: 600 }}>{order.item}</div>
            </div>
            <div
              style={{
                background: `${order.color}18`,
                border: `1px solid ${order.color}40`,
                borderRadius: '100px',
                padding: '3px 8px',
                fontSize: '10px',
                color: order.color,
                fontWeight: 600,
              }}
            >
              {order.status}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating table status card */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-28px',
          ...glass,
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          width: '190px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Users size={12} color={C.indigo} />
          <span style={{ fontSize: '11px', color: C.text, fontWeight: 600 }}>Table Status</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
          {tableStatuses.map((status, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1 + i * 0.04, type: 'spring', stiffness: 300 }}
              title={`Table ${i + 1}: ${status}`}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '6px',
                background: `${statusColor[status]}22`,
                border: `1px solid ${statusColor[status]}50`,
                boxShadow: status === 'occupied' ? `0 0 8px ${statusColor[status]}30` : 'none',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { color: C.rose, label: '9 Occ.' },
            { color: C.emerald, label: '3 Free' },
            { color: C.indigo, label: '2 Res.' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: item.color }} />
              <span style={{ fontSize: '9px', color: C.subtle, fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily summary floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-40px',
          transform: 'translateY(-50%)',
          background: gradients.emerald,
          borderRadius: '14px',
          padding: '12px 16px',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <TrendingUp size={16} color="white" />
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Peak Hour</div>
          <div style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 700 }}>7–9 PM</div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Hero Section ─────────────────────────────────────────
export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: C.bg,
        paddingTop: '72px',
      }}
    >
      {/* Background glow blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-15%', left: '-8%',
            width: '700px', height: '700px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,113,133,0.14) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', top: '-5%', right: '-10%',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute', bottom: '5%', left: '35%',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Noise/grain overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }} />
      </div>

      <div
        style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '80px 32px 140px',
          position: 'relative', zIndex: 1,
          width: '100%',
        }}
      >
        <div className="flex flex-col lg:flex-row" style={{ gap: '72px', alignItems: 'center' }}>
          {/* Left: Copy */}
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(251,113,133,0.08)',
                  border: '1px solid rgba(251,113,133,0.25)',
                  borderRadius: '100px', padding: '7px 16px',
                  marginBottom: '28px',
                }}
              >
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.rose, flexShrink: 0 }}
                />
                <span style={{ fontSize: '13px', color: C.rose, fontWeight: 600 }}>
                  Live across 500+ restaurants
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.08, color: C.text, marginBottom: '24px', letterSpacing: '-1.5px' }}
            >
              Run every shift<br />
              <span style={{ background: gradients.roseOrange, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                without the chaos.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ fontSize: '18px', color: C.muted, lineHeight: 1.75, marginBottom: '40px', maxWidth: '500px' }}
            >
              KhanaKhazana gives your team total visibility — from the first table seated to the last delivery dispatched. Real-time data, zero guesswork, every shift.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <button
                onClick={goToLogin}
                style={{
                  background: gradients.roseOrange,
                  border: 'none', borderRadius: '16px',
                  padding: '16px 32px',
                  color: '#FFFFFF', fontSize: '16px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.25s',
                  boxShadow: '0 8px 32px rgba(251,113,133,0.4)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(251,113,133,0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(251,113,133,0.4)';
                }}
              >
                Book a Demo <ArrowRight size={18} />
              </button>
              <button
                onClick={goToLogin}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${C.borderStrong}`,
                  borderRadius: '16px', padding: '16px 32px',
                  color: C.text, fontSize: '16px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = C.borderStrong;
                }}
              >
                Start Free Trial
              </button>
            </motion.div>

            {/* Trust microcopy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}
            >
              {['No credit card needed', 'Live in under 24h', 'Cancel anytime'].map((text) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.emerald, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: C.muted, fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Product Mockup */}
          <motion.div
            className="hidden lg:flex"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
            style={{ flex: '1 1 0', justifyContent: 'center', paddingRight: '48px', paddingBottom: '40px', paddingTop: '28px' }}
          >
            <div style={{ width: '100%', height: '500px' }}>
              <CircularGallery
                bend={3}
                textColor='#FF8C42'
                borderRadius={0.05}
                font='bold 24px Figtree'
                scrollSpeed={2}
                scrollEase={0.05}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(to bottom, transparent, #0A0A0A)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
