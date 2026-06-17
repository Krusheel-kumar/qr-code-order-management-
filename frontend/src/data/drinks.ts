export interface DrinkMetadata {
  id: string;
  name: string;
  category: string;
  image?: string;
  
  // Scoring parameters (0-10)
  sweetness: number;
  
  // Boolean traits
  milk: boolean;
  fruity: boolean;
  chocolate: boolean;
  coffee: boolean;
  healthy: boolean;
  refreshing: boolean;
  dessert: boolean;
  firstTimer: boolean;
  kidsFriendly: boolean;
  energyBoost: boolean;
  creamy: boolean;
  
  // Social Proof & UI tags
  tags: string[];
  isBestSeller?: boolean;
  isTrending?: boolean;
  rating: number;
  
  // Recommended Pairings (Upselling)
  pairings: { name: string; type: string }[];
}

export const drinksDatabase: DrinkMetadata[] = [
  // CLASSICS
  {
    id: 'p-authentic-milk-tea',
    name: 'Authentic Boba Tea',
    category: 'Classic',
    sweetness: 6,
    milk: true,
    fruity: false,
    chocolate: false,
    coffee: false,
    healthy: false,
    refreshing: false,
    dessert: false,
    firstTimer: true,
    kidsFriendly: true,
    energyBoost: true,
    creamy: true,
    tags: ['Classic', 'Chewy Boba', 'Creamy'],
    isBestSeller: true,
    rating: 4.8,
    pairings: [{ name: 'Cheese Shots', type: 'Snack' }]
  },
  {
    id: 'p-brown-sugar-boba',
    name: 'Brown Sugar Boba',
    category: 'Classic',
    sweetness: 9,
    milk: true,
    fruity: false,
    chocolate: false,
    coffee: false,
    healthy: false,
    refreshing: false,
    dessert: true,
    firstTimer: true,
    kidsFriendly: true,
    energyBoost: true,
    creamy: true,
    tags: ['Rich', 'Sweet', 'Decadent'],
    isTrending: true,
    rating: 4.9,
    pairings: [{ name: 'French Fries', type: 'Snack' }]
  },
  {
    id: 'p-taro-milk-tea',
    name: 'Taro Boba Tea',
    category: 'Classic',
    sweetness: 7,
    milk: true,
    fruity: false,
    chocolate: false,
    coffee: false,
    healthy: false,
    refreshing: false,
    dessert: true,
    firstTimer: false,
    kidsFriendly: true,
    energyBoost: false,
    creamy: true,
    tags: ['Earthy', 'Vanilla Notes', 'Creamy'],
    rating: 4.7,
    pairings: []
  },
  {
    id: 'p-matcha-green-tea',
    name: 'Matcha Boba Tea',
    category: 'Classic',
    sweetness: 5,
    milk: true,
    fruity: false,
    chocolate: false,
    coffee: false,
    healthy: true,
    refreshing: true,
    dessert: false,
    firstTimer: false,
    kidsFriendly: false,
    energyBoost: true,
    creamy: true,
    tags: ['Earthy', 'Antioxidants', 'Balanced'],
    rating: 4.8,
    pairings: [{ name: 'Matcha Cookie', type: 'Dessert' }]
  },

  // FRUIT TEA
  {
    id: 'p-mango-milk-tea',
    name: 'Mango Fruit Tea',
    category: 'Fruit Tea',
    sweetness: 7,
    milk: false,
    fruity: true,
    chocolate: false,
    coffee: false,
    healthy: true,
    refreshing: true,
    dessert: false,
    firstTimer: true,
    kidsFriendly: true,
    energyBoost: true,
    creamy: false,
    tags: ['Tropical', 'Refreshing', 'Sweet'],
    isBestSeller: true,
    rating: 4.9,
    pairings: [{ name: 'Mango Cheesecake', type: 'Dessert' }, { name: 'Fries', type: 'Snack' }]
  },
  {
    id: 'p-lychee-milk-tea',
    name: 'Lychee Fruit Tea',
    category: 'Fruit Tea',
    sweetness: 8,
    milk: false,
    fruity: true,
    chocolate: false,
    coffee: false,
    healthy: true,
    refreshing: true,
    dessert: false,
    firstTimer: true,
    kidsFriendly: true,
    energyBoost: false,
    creamy: false,
    tags: ['Floral', 'Light', 'Sweet'],
    rating: 4.6,
    pairings: []
  },
  {
    id: 'p-strawberry-milk-tea',
    name: 'Strawberry Fruit Tea',
    category: 'Fruit Tea',
    sweetness: 7,
    milk: false,
    fruity: true,
    chocolate: false,
    coffee: false,
    healthy: true,
    refreshing: true,
    dessert: false,
    firstTimer: true,
    kidsFriendly: true,
    energyBoost: false,
    creamy: false,
    tags: ['Berry', 'Tangy', 'Refreshing'],
    rating: 4.8,
    pairings: []
  },

  // CHOCOLATE SERIES
  {
    id: 'p-ferrero-rocher-boba-tea',
    name: 'Ferrero Boba',
    category: 'Chocolate Series',
    sweetness: 9,
    milk: true,
    fruity: false,
    chocolate: true,
    coffee: false,
    healthy: false,
    refreshing: false,
    dessert: true,
    firstTimer: true,
    kidsFriendly: true,
    energyBoost: true,
    creamy: true,
    tags: ['Hazelnut', 'Rich Chocolate', 'Indulgent'],
    isTrending: true,
    rating: 4.9,
    pairings: [{ name: 'Brownie', type: 'Dessert' }]
  },
  {
    id: 'p-nutella-boba-tea',
    name: 'Nutella Boba',
    category: 'Chocolate Series',
    sweetness: 10,
    milk: true,
    fruity: false,
    chocolate: true,
    coffee: false,
    healthy: false,
    refreshing: false,
    dessert: true,
    firstTimer: true,
    kidsFriendly: true,
    energyBoost: true,
    creamy: true,
    tags: ['Extra Sweet', 'Nutella', 'Decadent'],
    rating: 5.0,
    pairings: []
  },

  // COFFEE SERIES
  {
    id: 'p-mocha-milk-tea',
    name: 'Mocha Coffee Boba',
    category: 'Coffee Series',
    sweetness: 6,
    milk: true,
    fruity: false,
    chocolate: true,
    coffee: true,
    healthy: false,
    refreshing: false,
    dessert: true,
    firstTimer: false,
    kidsFriendly: false,
    energyBoost: true,
    creamy: true,
    tags: ['Coffee Blend', 'Chocolate', 'Energizing'],
    rating: 4.6,
    pairings: [{ name: 'Croissant', type: 'Snack' }]
  },
  {
    id: 'p-desi-coffee',
    name: 'Desi Coffee Boba',
    category: 'Coffee Series',
    sweetness: 7,
    milk: true,
    fruity: false,
    chocolate: false,
    coffee: true,
    healthy: false,
    refreshing: false,
    dessert: false,
    firstTimer: true,
    kidsFriendly: false,
    energyBoost: true,
    creamy: true,
    tags: ['Strong', 'Local Favorite', 'Energizing'],
    isBestSeller: true,
    rating: 4.9,
    pairings: []
  },

  // NON-MILK TEAS
  {
    id: 'p-lemon-tea',
    name: 'Lemon Tea',
    category: 'Non-Milk Teas',
    sweetness: 4,
    milk: false,
    fruity: true,
    chocolate: false,
    coffee: false,
    healthy: true,
    refreshing: true,
    dessert: false,
    firstTimer: true,
    kidsFriendly: true,
    energyBoost: false,
    creamy: false,
    tags: ['Citrus', 'Zesty', 'Thirst Quencher'],
    rating: 4.5,
    pairings: []
  },
  {
    id: 'p-yuzu-berry-tea',
    name: 'Yuzu Berry Tea',
    category: 'Non-Milk Teas',
    sweetness: 5,
    milk: false,
    fruity: true,
    chocolate: false,
    coffee: false,
    healthy: true,
    refreshing: true,
    dessert: false,
    firstTimer: false,
    kidsFriendly: false,
    energyBoost: true,
    creamy: false,
    tags: ['Exotic', 'Tangy', 'Vibrant'],
    isTrending: true,
    rating: 4.8,
    pairings: []
  }
];
