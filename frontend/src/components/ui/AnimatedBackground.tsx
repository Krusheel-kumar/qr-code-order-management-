import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EE] to-[#FFF5E1]">
      {/* Soft Floating Orbs */}
      <motion.div
        className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] bg-yellow-300/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] max-w-[250px] max-h-[250px] bg-orange-300/10 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-[10%] left-[30%] w-[50vw] h-[50vw] max-w-[350px] max-h-[350px] bg-amber-300/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Tiny floating bubbles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute bg-white/40 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] backdrop-blur-sm"
          style={{
            width: Math.random() * 20 + 10 + 'px',
            height: Math.random() * 20 + 10 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, -100 - Math.random() * 100],
            x: Math.random() * 40 - 20,
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
