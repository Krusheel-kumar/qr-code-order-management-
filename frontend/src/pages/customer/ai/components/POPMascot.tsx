import { motion } from 'framer-motion';

interface POPMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  glow?: boolean;
  mood?: 'happy' | 'excited' | 'wave';
}

const sizeMap = {
  sm: 80,
  md: 120,
  lg: 160,
  xl: 200,
};

// Sprite sheet positions for macott.png
const moodConfig = {
  happy:   { bgPos: '48% 5%',  bgSize: '280%' },
  excited: { bgPos: '98% 5%',  bgSize: '280%' },
  wave:    { bgPos: '2% 95%',  bgSize: '280%' },
};

export default function POPMascot({ size = 'lg', animate = true, glow = true, mood = 'happy' }: POPMascotProps) {
  const px = sizeMap[size];
  const config = moodConfig[mood];

  return (
    <div className="relative flex items-center justify-center" style={{ width: px, height: px }}>
      {/* Glow ring */}
      {glow && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: px * 1.4,
            height: px * 1.4,
            background: 'radial-gradient(circle, rgba(255,213,79,0.25) 0%, rgba(255,213,79,0) 70%)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Mascot sprite */}
      <motion.div
        className="relative z-10"
        style={{ width: px, height: px }}
        animate={
          animate
            ? { y: [0, -10, 0], rotate: [0, 1.5, -1.5, 0] }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url('/assets/macott.png')`,
            backgroundSize: config.bgSize,
            backgroundPosition: config.bgPos,
            backgroundRepeat: 'no-repeat',
          }}
        />
      </motion.div>
    </div>
  );
}
