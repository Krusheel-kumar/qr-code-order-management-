export interface ProductFlavorProfile {
  sweetness: number; // 0-5
  creaminess: number; // 0-5
  refreshment: number; // 0-5
  energy: number; // 0-5
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  largePriceAddOn?: number;
  eligibleAddons?: string[];
  image: string;
  story: string;
  flavorNotes: string[];
  mood: string;
  badge?: string; // 'Best Seller' | 'Staff Pick' | 'New Launch' etc
  staffPickNote?: string;
  rating: number;
  ordersToday?: number;
  calories: number;
  flavorProfile: ProductFlavorProfile;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewLaunch?: boolean;
  pairings: string[]; // IDs of paired items
  recommendedToppings?: string[];
  discoverySections?: any[];
}
