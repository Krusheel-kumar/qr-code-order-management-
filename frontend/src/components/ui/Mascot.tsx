import { motion } from 'framer-motion';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Mascot({ size = 'md', className = '' }: MascotProps) {
  // Define responsive sizes mapping
  const sizeClasses = {
    sm: 'w-[100px] h-[100px]',
    md: 'w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]',
    lg: 'w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[240px] lg:h-[240px]',
    xl: 'w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px]',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* Subtle Glow Behind Mascot */}
      <motion.div
        className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Mascot Image with Breathing/Floating Animation */}
      <motion.img
        src="/assets/mascotpob.png" // Updated to use mascotpob.png as requested
        alt="POP Buddy"
        className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
        animate={{
          y: [0, -12, 0],
          rotate: [-1, 1, -1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        // The image is inherently styled nicely, object-contain avoids stretching.
      />
      
      {/* Soft Shadow below mascot */}
      <motion.div
        className="absolute -bottom-4 w-3/4 h-6 bg-black/10 rounded-[100%] blur-md"
        animate={{
          scale: [1, 0.8, 1],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
