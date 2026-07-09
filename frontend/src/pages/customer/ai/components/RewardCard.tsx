import { motion } from 'framer-motion';

interface RewardCardProps {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  emoji: string;
  unlocked: boolean;
  type: string;
}

export default function RewardCard({ title, description, pointsRequired, emoji, unlocked }: RewardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative flex-shrink-0 w-[200px] rounded-3xl overflow-hidden border"
      style={{
        background: unlocked
          ? 'linear-gradient(135deg, #fff8e8 0%, #fffdf8 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
        borderColor: unlocked ? 'rgba(255,213,79,0.4)' : 'rgba(0,0,0,0.06)',
      }}
    >
      {/* Locked overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/60 backdrop-blur-[2px] rounded-3xl">
          <span className="text-2xl mb-1">🔒</span>
          <span className="text-[11px] font-bold text-gray-500 text-center px-3">Join POP Club to unlock</span>
        </div>
      )}

      <div className={`p-4 ${!unlocked ? 'opacity-30 select-none' : ''}`}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-2xl"
          style={{ background: 'rgba(255,213,79,0.2)' }}>
          {emoji}
        </div>
        <h4 className="font-bold text-sm leading-tight mb-1 text-gray-900">{title}</h4>
        <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{description}</p>
        {pointsRequired > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-[#C4A017] bg-[#FFF9E0] px-2 py-0.5 rounded-full">
              ⭐ {pointsRequired} pts
            </span>
          </div>
        )}
        {pointsRequired === 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              ✓ Free Reward
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
