import { motion } from 'framer-motion';

interface MissionCardProps {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  total: number;
  emoji: string;
  completed: boolean;
}

export default function MissionCard({ title, description, reward, progress, total, emoji, completed }: MissionCardProps) {
  const pct = Math.min(100, Math.round((progress / total) * 100));

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="rounded-3xl p-5 border"
      style={{
        background: completed
          ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'
          : 'linear-gradient(135deg, #FFFDF8 0%, #FFF8E8 100%)',
        borderColor: completed ? 'rgba(34,197,94,0.3)' : 'rgba(255,213,79,0.3)',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: completed ? 'rgba(34,197,94,0.15)' : 'rgba(255,213,79,0.2)' }}>
          {completed ? '✅' : emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-gray-900 mb-0.5">{title}</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{description}</p>

          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: completed
                  ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                  : 'linear-gradient(90deg, #FFD54F, #FFC107)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-medium">
              {progress} / {total} {total === 1 ? 'visit' : 'orders'}
            </span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              🎁 {reward}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
