import { motion } from 'motion/react';

export function FoodGraphic({ type, animated = true }: { type: 'pizza' | 'veggie_burger' | 'chinese' | 'salad'; animated?: boolean }) {
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } }
  };

  if (type === 'pizza') {
    return (
      <motion.svg viewBox="0 0 100 100" width="80" height="80" initial={animated ? "hidden" : "visible"} whileInView={animated ? "visible" : undefined} whileHover={animated ? "hover" : undefined} variants={variants}>
        <circle cx="50" cy="50" r="45" fill="#FF8C42" opacity="0.2" />
        {/* Pizza base */}
        <circle cx="50" cy="55" r="35" fill="#D2691E" />
        {/* Cheese */}
        <circle cx="50" cy="55" r="32" fill="#FFD700" />
        {/* Tomato sauce */}
        <circle cx="50" cy="55" r="28" fill="#DC143C" opacity="0.8" />
        {/* Vegetable toppings */}
        <circle cx="45" cy="50" r="2" fill="#228B22" />
        <circle cx="55" cy="52" r="2" fill="#228B22" />
        <circle cx="50" cy="58" r="2.5" fill="#FF6347" />
        <circle cx="42" cy="54" r="1.5" fill="#DAA520" />
        {/* Pizza slice lines */}
        <line x1="50" y1="55" x2="70" y2="70" stroke="#8B4513" strokeWidth="1" />
      </motion.svg>
    );
  }

  if (type === 'veggie_burger') {
    return (
      <motion.svg viewBox="0 0 100 100" width="80" height="80" initial={animated ? "hidden" : "visible"} whileInView={animated ? "visible" : undefined} whileHover={animated ? "hover" : undefined} variants={variants}>
        <circle cx="50" cy="50" r="45" fill="#228B22" opacity="0.2" />
        {/* Bottom bun */}
        <path d="M 35 60 Q 35 70 50 72 Q 65 70 65 60 Z" fill="#D2B48C" />
        {/* Lettuce */}
        <path d="M 36 58 Q 35 54 50 52 Q 65 54 64 58 Z" fill="#228B22" />
        {/* Tomato */}
        <rect x="38" y="54" width="24" height="3" fill="#FF6347" rx="1" />
        {/* Veggie patty */}
        <ellipse cx="50" cy="50" rx="14" ry="5" fill="#8B7355" />
        {/* Top bun */}
        <path d="M 35 45 Q 35 35 50 33 Q 65 35 65 45 Z" fill="#D2B48C" />
        {/* Sesame seeds */}
        <circle cx="48" cy="38" r="0.5" fill="#FFFACD" />
        <circle cx="52" cy="39" r="0.5" fill="#FFFACD" />
        <circle cx="50" cy="36" r="0.5" fill="#FFFACD" />
      </motion.svg>
    );
  }

  if (type === 'chinese') {
    return (
      <motion.svg viewBox="0 0 100 100" width="80" height="80" initial={animated ? "hidden" : "visible"} whileInView={animated ? "visible" : undefined} whileHover={animated ? "hover" : undefined} variants={variants}>
        <circle cx="50" cy="50" r="45" fill="#DAA520" opacity="0.2" />
        {/* Bowl */}
        <path d="M 30 55 Q 30 70 50 72 Q 70 70 70 55 L 70 50 Q 70 48 69 47 L 31 47 Q 30 48 30 50 Z" fill="#CD853F" />
        {/* Noodles */}
        <path d="M 35 58 Q 40 56 50 57 Q 60 56 65 58" stroke="#FFD700" strokeWidth="2" fill="none" />
        <path d="M 36 60 Q 42 59 50 60 Q 58 59 64 60" stroke="#FFD700" strokeWidth="2" fill="none" />
        {/* Vegetables */}
        <circle cx="45" cy="61" r="1.5" fill="#228B22" />
        <circle cx="55" cy="62" r="1.5" fill="#FF6347" />
        <circle cx="50" cy="63" r="1.5" fill="#DAA520" />
        {/* Chopsticks */}
        <line x1="32" y1="45" x2="28" y2="35" stroke="#8B4513" strokeWidth="2" />
        <line x1="68" y1="45" x2="72" y2="35" stroke="#8B4513" strokeWidth="2" />
      </motion.svg>
    );
  }

  if (type === 'salad') {
    return (
      <motion.svg viewBox="0 0 100 100" width="80" height="80" initial={animated ? "hidden" : "visible"} whileInView={animated ? "visible" : undefined} whileHover={animated ? "hover" : undefined} variants={variants}>
        <circle cx="50" cy="50" r="45" fill="#90EE90" opacity="0.2" />
        {/* Bowl */}
        <path d="M 30 55 Q 30 68 50 72 Q 70 68 70 55" fill="#FFFACD" stroke="#DAA520" strokeWidth="1.5" />
        {/* Lettuce base */}
        <ellipse cx="50" cy="58" rx="18" ry="8" fill="#228B22" />
        {/* Tomatoes */}
        <circle cx="40" cy="57" r="2" fill="#FF6347" />
        <circle cx="60" cy="56" r="2" fill="#FF6347" />
        {/* Cucumber */}
        <ellipse cx="50" cy="60" rx="3" ry="1.5" fill="#7CB342" />
        {/* Dressing */}
        <circle cx="45" cy="62" r="1" fill="#DAA520" opacity="0.6" />
        <circle cx="55" cy="61" r="1" fill="#DAA520" opacity="0.6" />
      </motion.svg>
    );
  }

  return null;
}

export function FoodGraphicsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center my-12">
      <FoodGraphic type="pizza" />
      <FoodGraphic type="veggie_burger" />
      <FoodGraphic type="chinese" />
      <FoodGraphic type="salad" />
    </div>
  );
}
