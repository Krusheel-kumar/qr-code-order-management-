import React from 'react';
import {
  Star, Flame, Gem, Crown, Trophy, Sparkles, Zap, Leaf
} from 'lucide-react';
import { BadgeType, BadgeColor, BadgeIcon } from '../../data/models';

export interface BadgeChipProps {
  type?: BadgeType | string;
  color?: BadgeColor | string;
  icon?: BadgeIcon | string;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  PURPLE: 'bg-violet-600',
  GREEN: 'bg-green-500',
  ORANGE: 'bg-orange-500',
  BLUE: 'bg-blue-500',
  RED: 'bg-red-500',
  GOLD: 'bg-yellow-500',
  PINK: 'bg-pink-500',
};

const ICON_MAP: Record<string, React.ElementType> = {
  STAR: Star,
  FIRE: Flame,
  DIAMOND: Gem,
  CROWN: Crown,
  TROPHY: Trophy,
  SPARKLE: Sparkles,
  LIGHTNING: Zap,
  LEAF: Leaf,
};

const LABEL_MAP: Record<string, string> = {
  MOST_POPULAR: 'MOST POPULAR',
  BEST_VALUE: 'BEST VALUE',
  TRENDING: 'TRENDING',
  NEW: 'NEW',
  STAFF_PICK: 'STAFF PICK',
  BESTSELLER: 'BESTSELLER',
  RECOMMENDED: 'RECOMMENDED',
  PREMIUM: 'PREMIUM',
  LIMITED: 'LIMITED',
  VEGAN: 'VEGAN',
};

export default function BadgeChip({
  type = 'RECOMMENDED',
  color = 'PURPLE',
  icon = 'STAR',
  className = '',
}: BadgeChipProps) {
  const bgColorClass = COLOR_MAP[color] || 'bg-violet-600';
  const IconComponent = ICON_MAP[icon] || Star;
  const label = LABEL_MAP[type] || type.replace(/_/g, ' ');

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white shadow-sm ${bgColorClass} ${className}`}
    >
      <IconComponent className="w-3 h-3 fill-current" />
      <span className="text-[10px] font-black uppercase tracking-wider leading-none">
        {label}
      </span>
    </div>
  );
}
