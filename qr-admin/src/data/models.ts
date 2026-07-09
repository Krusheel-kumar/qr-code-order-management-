export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  ctaText: string;
  link: string;
}

export interface Story {
  id: string;
  title: string;
  image: string;
  slides?: string[];
  badge?: string;
  isViewed?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Since we don't have images yet, we can use lucide icons or emojis
  subcategories?: string[];
}

export interface DiscoverySection {
  id: string;
  title: string;
  displayOrder: number;
  isActive: boolean;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
  description: string;
  customizable?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  code: string;
  validUntil: string;
  ctaText: string;
}

export interface Combo {
  id: string;
  title: string;
  items: Product[];
  price: number;
  originalPrice: number;
  image: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  freeSelectionsLimit: number;
  isRequired: boolean;
  version?: number;
}

export const BadgeType = {
  MOST_POPULAR: 'MOST_POPULAR',
  BEST_VALUE: 'BEST_VALUE',
  TRENDING: 'TRENDING',
  NEW: 'NEW',
  STAFF_PICK: 'STAFF_PICK',
  BESTSELLER: 'BESTSELLER',
  RECOMMENDED: 'RECOMMENDED',
  PREMIUM: 'PREMIUM',
  LIMITED: 'LIMITED',
  VEGAN: 'VEGAN'
} as const;
export type BadgeType = typeof BadgeType[keyof typeof BadgeType];

export const BadgeColor = {
  PURPLE: 'PURPLE',
  GREEN: 'GREEN',
  ORANGE: 'ORANGE',
  BLUE: 'BLUE',
  RED: 'RED',
  GOLD: 'GOLD',
  PINK: 'PINK'
} as const;
export type BadgeColor = typeof BadgeColor[keyof typeof BadgeColor];

export const BadgeIcon = {
  STAR: 'STAR',
  FIRE: 'FIRE',
  DIAMOND: 'DIAMOND',
  CROWN: 'CROWN',
  TROPHY: 'TROPHY',
  SPARKLE: 'SPARKLE',
  LIGHTNING: 'LIGHTNING',
  LEAF: 'LEAF'
} as const;
export type BadgeIcon = typeof BadgeIcon[keyof typeof BadgeIcon];

export interface CustomizationOption {
  id: string;
  groupId: string;
  name: string;
  defaultPrice: number;
  isAvailable: boolean;
  version?: number;
  badgeEnabled?: boolean;
  badgeType?: BadgeType | string;
  badgeColor?: BadgeColor | string;
  badgeIcon?: BadgeIcon | string;
  badgePriority?: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  active: boolean;
}

export interface StoreSettings {
  taxRate: number;
  deliveryFee: number;
  packingCharge: number;
  prepTime: number;
  storeActive?: boolean;
}
