import { motion } from 'framer-motion';

interface FloatingBubblesProps {
  count?: number;
  dark?: boolean;
}

export default function FloatingBubbles({ count = 12, dark = false }: FloatingBubblesProps) {
  const bubbles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 20 + Math.random() * 80,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 4,
    opacity: dark ? (0.04 + Math.random() * 0.10) : (0.06 + Math.random() * 0.14),
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: dark
              ? `radial-gradient(circle at 30% 30%, rgba(255,213,79,${b.opacity * 2}), rgba(255,213,79,${b.opacity}))`
              : `radial-gradient(circle at 30% 30%, rgba(255,213,79,${b.opacity * 2}), rgba(255,181,30,${b.opacity}))`,
            border: dark
              ? `1px solid rgba(255,213,79,0.12)`
              : `1px solid rgba(255,213,79,0.25)`,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, 6, -6, 0],
            scale: [1, 1.05, 0.97, 1],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
