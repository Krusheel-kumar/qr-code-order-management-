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
  isStoreActive?: boolean;
}
