import { motion } from 'framer-motion';

interface DrinkCardProps {
  id: string;
  name: string;
  image?: string;
  price: number;
  tag: string;
  reason: string;
  emoji: string;
}

export default function DrinkCard({ name, image, price, tag, reason, emoji }: DrinkCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="flex-shrink-0 w-[160px] rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm"
    >
      {/* Image area */}
      <div className="w-full h-[130px] flex items-center justify-center relative"
        style={{ background: 'linear-gradient(135deg, #FFF8E8 0%, #FFF5DC 100%)' }}>
        {image ? (
          <img src={image} alt={name} className="h-[110px] object-contain drop-shadow-lg" />
        ) : (
          <span className="text-5xl drop-shadow-sm">{emoji}</span>
        )}
        {/* Tag badge */}
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black text-white">
            {tag}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h4 className="font-bold text-[13px] leading-tight text-gray-900 mb-1">{name}</h4>
        <p className="text-[10px] text-gray-500 leading-relaxed mb-2 line-clamp-2">{reason}</p>
        <span className="font-black text-base text-gray-900">₹{price}</span>
      </div>
    </motion.div>
  );
}
