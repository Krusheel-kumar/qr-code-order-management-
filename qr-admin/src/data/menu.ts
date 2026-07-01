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

export const CATEGORIES = [
  'Milk Teas',
  'Boba Iced Tea',
  'Milk Shakes',
  'Cold Coffees',
  'Chillers'
];

export const MENU: MenuItem[] = [
{
  id: 'p-authentic-milk-tea',
  name: 'Authentic Milk Tea',
  category: 'Milk Teas',
  subcategory: 'Classics',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/authentic.png',
  story: 'Experience the rich taste of our Authentic Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Classics'
  ],
  mood: 'Happy Mood',
  rating: 4.6,
  calories: 302,
  flavorProfile: {
    sweetness: 2,
    creaminess: 4,
    refreshment: 2,
    energy: 3
  },
  pairings: []
},
{
  id: 'p-hong-kong-milk-tea',
  name: 'Hong Kong Milk Tea',
  category: 'Milk Teas',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/hongkong.png',
  story: 'Experience the rich taste of our Hong Kong Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Classics'
  ],
  mood: 'Happy Mood',
  rating: 4.6,
  calories: 508,
  flavorProfile: {
    sweetness: 5,
    creaminess: 2,
    refreshment: 1,
    energy: 2
  },
  pairings: [],
  subcategory: 'Classics'
},
{
  id: 'p-matcha-green-tea',
  name: 'Matcha Green Tea',
  category: 'Milk Teas',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/matcha.png',
  story: 'Experience the rich taste of our Matcha Green Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Classics'
  ],
  mood: 'Happy Mood',
  rating: 4.8,
  calories: 253,
  flavorProfile: {
    sweetness: 3,
    creaminess: 5,
    refreshment: 2,
    energy: 5
  },
  pairings: [],
  subcategory: 'Classics'
},
{
  id: 'p-taro-milk-tea',
  name: 'Taro Milk Tea',
  category: 'Milk Teas',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/taro.png',
  story: 'Experience the rich taste of our Taro Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Classics'
  ],
  mood: 'Sweet Cravings',
  rating: 4.6,
  calories: 422,
  flavorProfile: {
    sweetness: 5,
    creaminess: 4,
    refreshment: 3,
    energy: 3
  },
  pairings: [],
  subcategory: 'Classics'
},
{
  id: 'p-brown-sugar-boba',
  name: 'Brown Sugar Boba',
  category: 'Milk Teas',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/brownsugar.png',
  story: 'Experience the rich taste of our Brown Sugar Boba, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Classics'
  ],
  mood: 'Happy Mood',
  rating: 4.9,
  calories: 385,
  flavorProfile: {
    sweetness: 2,
    creaminess: 5,
    refreshment: 1,
    energy: 4
  },
  pairings: [],
  subcategory: 'Classics'
},
{
  id: 'p-strawberry-milk-tea',
  name: 'Strawberry Milk Tea',
  category: 'Milk Teas',
  price: 269,
  largePriceAddOn: 69,
  image: '/assets/strawberryboba.png',
  story: 'Experience the rich taste of our Strawberry Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Fruit'
  ],
  mood: 'Happy Mood',
  rating: 4.8,
  calories: 435,
  flavorProfile: {
    sweetness: 5,
    creaminess: 2,
    refreshment: 4,
    energy: 2
  },
  pairings: [],
  subcategory: 'Fruit'
},
{
  id: 'p-mango-milk-tea',
  name: 'Mango Milk Tea',
  category: 'Milk Teas',
  price: 269,
  largePriceAddOn: 69,
  image: '/assets/mangoboba.png',
  story: 'Experience the rich taste of our Mango Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Fruit'
  ],
  mood: 'Sweet Cravings',
  rating: 5.0,
  calories: 369,
  flavorProfile: {
    sweetness: 2,
    creaminess: 2,
    refreshment: 2,
    energy: 4
  },
  pairings: [],
  subcategory: 'Fruit'
},
{
  id: 'p-lychee-milk-tea',
  name: 'Lychee Milk Tea',
  category: 'Milk Teas',
  price: 269,
  largePriceAddOn: 69,
  image: '/assets/lycheeboba.png',
  story: 'Experience the rich taste of our Lychee Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Fruit'
  ],
  mood: 'Happy Mood',
  rating: 4.6,
  calories: 431,
  flavorProfile: {
    sweetness: 5,
    creaminess: 4,
    refreshment: 4,
    energy: 4
  },
  pairings: [],
  subcategory: 'Fruit'
},
{
  id: 'p-blueberry-milk-tea',
  name: 'Blueberry Milk Tea',
  category: 'Milk Teas',
  price: 269,
  largePriceAddOn: 69,
  image: '/assets/blueberryboba.png',
  story: 'Experience the rich taste of our Blueberry Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Fruit'
  ],
  mood: 'Sweet Cravings',
  rating: 4.6,
  calories: 444,
  flavorProfile: {
    sweetness: 4,
    creaminess: 2,
    refreshment: 2,
    energy: 3
  },
  pairings: [],
  subcategory: 'Fruit'
},
{
  id: 'p-honeydew-milk-tea',
  name: 'Honeydew Milk Tea',
  category: 'Milk Teas',
  price: 269,
  largePriceAddOn: 69,
  image: '/assets/matcha.png',
  story: 'Experience the rich taste of our Honeydew Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Fruit'
  ],
  mood: 'Need Energy',
  rating: 4.9,
  calories: 411,
  flavorProfile: {
    sweetness: 3,
    creaminess: 4,
    refreshment: 1,
    energy: 3
  },
  pairings: [],
  subcategory: 'Fruit'
},
{
  id: 'p-chocolate-boba-tea',
  name: 'Chocolate Boba Tea',
  category: 'Milk Teas',
  price: 289,
  largePriceAddOn: 69,
  image: '/assets/chocolateboba.png',
  story: 'Experience the rich taste of our Chocolate Boba Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Chocolate Classics'
  ],
  mood: 'Beat The Heat',
  rating: 4.6,
  calories: 505,
  flavorProfile: {
    sweetness: 4,
    creaminess: 2,
    refreshment: 2,
    energy: 4
  },
  pairings: [],
  subcategory: 'Chocolate Classics'
},
{
  id: 'p-choco-fantasy-boba-tea',
  name: 'Choco Fantasy Boba Tea',
  category: 'Milk Teas',
  price: 289,
  largePriceAddOn: 69,
  image: '/assets/chocofantasyboba.png',
  story: 'Experience the rich taste of our Choco Fantasy Boba Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Chocolate Classics'
  ],
  mood: 'Beat The Heat',
  rating: 4.6,
  calories: 537,
  flavorProfile: {
    sweetness: 5,
    creaminess: 3,
    refreshment: 3,
    energy: 3
  },
  pairings: [],
  subcategory: 'Chocolate Classics'
},
{
  id: 'p-dark-cocoa-boba-tea',
  name: 'Dark Cocoa Boba Tea',
  category: 'Milk Teas',
  price: 289,
  largePriceAddOn: 69,
  image: '/assets/darkcocoaboba.png',
  story: 'Experience the rich taste of our Dark Cocoa Boba Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Chocolate Classics'
  ],
  mood: 'Need Energy',
  rating: 5.0,
  calories: 320,
  flavorProfile: {
    sweetness: 5,
    creaminess: 5,
    refreshment: 3,
    energy: 3
  },
  pairings: [],
  subcategory: 'Chocolate Classics'
},
{
  id: 'p-choco-caramel',
  name: 'Choco Caramel',
  category: 'Milk Teas',
  price: 289,
  largePriceAddOn: 69,
  image: '/assets/chococaramelboba.png',
  story: 'Experience the rich taste of our Choco Caramel, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Chocolate Classics'
  ],
  mood: 'Beat The Heat',
  rating: 4.8,
  calories: 466,
  flavorProfile: {
    sweetness: 2,
    creaminess: 2,
    refreshment: 1,
    energy: 3
  },
  pairings: [],
  subcategory: 'Chocolate Classics'
},
{
  id: 'p-nutella-boba-tea',
  name: 'Nutella Boba Tea',
  category: 'Milk Teas',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/nutellaboba.png',
  story: 'Experience the rich taste of our Nutella Boba Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Chocolate Signatures'
  ],
  mood: 'Happy Mood',
  rating: 5.0,
  calories: 255,
  flavorProfile: {
    sweetness: 5,
    creaminess: 5,
    refreshment: 4,
    energy: 4
  },
  pairings: [],
  subcategory: 'Chocolate Signatures'
},
{
  id: 'p-ferrero-rocher-boba-tea',
  name: 'Ferrero Rocher Boba Tea',
  category: 'Milk Teas',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/ferrerorocherboba.png',
  story: 'Experience the rich taste of our Ferrero Rocher Boba Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Chocolate Signatures'
  ],
  mood: 'Happy Mood',
  rating: 4.7,
  calories: 482,
  flavorProfile: {
    sweetness: 4,
    creaminess: 4,
    refreshment: 1,
    energy: 4
  },
  pairings: [],
  subcategory: 'Chocolate Signatures'
},
{
  id: 'p-oreo-oreo-boba-tea',
  name: 'Oreo Oreo Boba Tea',
  category: 'Milk Teas',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/oreoboba.png',
  story: 'Experience the rich taste of our Oreo Oreo Boba Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Chocolate Signatures'
  ],
  mood: 'Happy Mood',
  rating: 4.9,
  calories: 509,
  flavorProfile: {
    sweetness: 4,
    creaminess: 3,
    refreshment: 1,
    energy: 4
  },
  pairings: [],
  subcategory: 'Chocolate Signatures'
},
{
  id: 'p-lotus-biscoff-boba-tea',
  name: 'Lotus Biscoff Boba Tea',
  category: 'Milk Teas',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/lotusbiscoffboba.png',
  story: 'Experience the rich taste of our Lotus Biscoff Boba Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Chocolate Signatures'
  ],
  mood: 'Sweet Cravings',
  rating: 4.8,
  calories: 500,
  flavorProfile: {
    sweetness: 3,
    creaminess: 4,
    refreshment: 2,
    energy: 2
  },
  pairings: [],
  subcategory: 'Chocolate Signatures'
},
{
  id: 'p-hazelnut-milk-tea',
  name: 'Hazelnut Milk Tea',
  category: 'Milk Teas',
  price: 279,
  largePriceAddOn: 69,
  image: '/assets/hazelnutboba.png',
  story: 'Experience the rich taste of our Hazelnut Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Coffee'
  ],
  mood: 'Happy Mood',
  rating: 4.5,
  calories: 540,
  flavorProfile: {
    sweetness: 2,
    creaminess: 4,
    refreshment: 3,
    energy: 3
  },
  pairings: [],
  subcategory: 'Coffee'
},
{
  id: 'p-mocha-milk-tea',
  name: 'Mocha Milk Tea',
  category: 'Milk Teas',
  price: 279,
  largePriceAddOn: 69,
  image: '/assets/mochaboba.png',
  story: 'Experience the rich taste of our Mocha Milk Tea, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Coffee'
  ],
  mood: 'Happy Mood',
  rating: 4.6,
  calories: 493,
  flavorProfile: {
    sweetness: 2,
    creaminess: 5,
    refreshment: 1,
    energy: 3
  },
  pairings: [],
  subcategory: 'Coffee'
},
{
  id: 'p-desi-coffee',
  name: 'Desi Coffee',
  category: 'Milk Teas',
  price: 279,
  largePriceAddOn: 69,
  image: '/assets/desicoffeeboba.png',
  story: 'Experience the rich taste of our Desi Coffee, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Coffee'
  ],
  mood: 'Sweet Cravings',
  rating: 4.9,
  calories: 454,
  flavorProfile: {
    sweetness: 4,
    creaminess: 5,
    refreshment: 2,
    energy: 3
  },
  pairings: [],
  subcategory: 'Coffee'
},
{
  id: 'p-caramel-coffee',
  name: 'Caramel Coffee',
  category: 'Milk Teas',
  price: 279,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Caramel Coffee, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Coffee'
  ],
  mood: 'Need Energy',
  rating: 4.6,
  calories: 423,
  flavorProfile: {
    sweetness: 5,
    creaminess: 5,
    refreshment: 1,
    energy: 3
  },
  pairings: [],
  subcategory: 'Coffee'
},
{
  id: 'p-sea-salt-biscoff',
  name: 'Sea Salt Biscoff',
  category: 'Milk Teas',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/seasaltbiscoffboba.png',
  story: 'Experience the rich taste of our Sea Salt Biscoff, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Signatures'
  ],
  mood: 'Happy Mood',
  rating: 4.9,
  calories: 280,
  flavorProfile: {
    sweetness: 3,
    creaminess: 3,
    refreshment: 1,
    energy: 2
  },
  pairings: [],
  subcategory: 'Signatures'
},
{
  id: 'p-caramel-popcorn',
  name: 'Caramel Popcorn',
  category: 'Milk Teas',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/caramelpopcornboba.png',
  story: 'Experience the rich taste of our Caramel Popcorn, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Signatures'
  ],
  mood: 'Sweet Cravings',
  rating: 4.8,
  calories: 392,
  flavorProfile: {
    sweetness: 2,
    creaminess: 2,
    refreshment: 3,
    energy: 2
  },
  pairings: [],
  subcategory: 'Signatures'
},
{
  id: 'p-pistachio-latte',
  name: 'Pistachio Latte',
  category: 'Milk Teas',
  price: 299,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Pistachio Latte, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Signatures'
  ],
  mood: 'Beat The Heat',
  rating: 4.9,
  calories: 458,
  flavorProfile: {
    sweetness: 3,
    creaminess: 3,
    refreshment: 4,
    energy: 3
  },
  pairings: [],
  subcategory: 'Signatures'
},
{
  id: 'p-mango-pulp',
  name: 'Mango Pulp',
  category: 'Milk Teas',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/mangopulpboba.png',
  story: 'Experience the rich taste of our Mango Pulp, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Signatures'
  ],
  mood: 'Sweet Cravings',
  rating: 4.7,
  calories: 489,
  flavorProfile: {
    sweetness: 2,
    creaminess: 2,
    refreshment: 4,
    energy: 4
  },
  pairings: [],
  subcategory: 'Signatures'
},
{
  id: 'p-tender-coconut-boba',
  name: 'Tender Coconut Boba',
  category: 'Milk Teas',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/tendercoconutboba.png',
  story: 'Experience the rich taste of our Tender Coconut Boba, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Milk Teas',
    'Signatures'
  ],
  mood: 'Happy Mood',
  rating: 4.9,
  calories: 305,
  flavorProfile: {
    sweetness: 2,
    creaminess: 2,
    refreshment: 4,
    energy: 4
  },
  pairings: [],
  subcategory: 'Signatures'
},
{
  id: 'p-vanilla-milkshake',
  name: 'Vanilla Milkshake',
  category: 'Boba Shakes',
  price: 249,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Vanilla Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'All Time Boba Milkshakes'
  ],
  mood: 'Sweet Cravings',
  rating: 4.7,
  calories: 392,
  flavorProfile: {
    sweetness: 3,
    creaminess: 3,
    refreshment: 4,
    energy: 3
  },
  pairings: [],
  subcategory: 'All Time Boba Milkshakes'
},
{
  id: 'p-chocolate-milkshake',
  name: 'Chocolate Milkshake',
  category: 'Boba Shakes',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/chocolateboba.png',
  story: 'Experience the rich taste of our Chocolate Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'All Time Boba Milkshakes'
  ],
  mood: 'Beat The Heat',
  rating: 4.5,
  calories: 526,
  flavorProfile: {
    sweetness: 3,
    creaminess: 2,
    refreshment: 4,
    energy: 2
  },
  pairings: [],
  subcategory: 'All Time Boba Milkshakes'
},
{
  id: 'p-strawberry-milkshake',
  name: 'Strawberry Milkshake',
  category: 'Boba Shakes',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/strawberryboba.png',
  story: 'Experience the rich taste of our Strawberry Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'All Time Boba Milkshakes'
  ],
  mood: 'Happy Mood',
  rating: 4.7,
  calories: 359,
  flavorProfile: {
    sweetness: 2,
    creaminess: 3,
    refreshment: 2,
    energy: 5
  },
  pairings: [],
  subcategory: 'All Time Boba Milkshakes'
},
{
  id: 'p-blueberry-milkshake',
  name: 'Blueberry Milkshake',
  category: 'Boba Shakes',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/blueberryboba.png',
  story: 'Experience the rich taste of our Blueberry Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'All Time Boba Milkshakes'
  ],
  mood: 'Beat The Heat',
  rating: 5.0,
  calories: 385,
  flavorProfile: {
    sweetness: 2,
    creaminess: 3,
    refreshment: 4,
    energy: 2
  },
  pairings: [],
  subcategory: 'All Time Boba Milkshakes'
},
{
  id: 'p-lychee-milkshake',
  name: 'Lychee Milkshake',
  category: 'Boba Shakes',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/lycheeboba.png',
  story: 'Experience the rich taste of our Lychee Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'All Time Boba Milkshakes'
  ],
  mood: 'Beat The Heat',
  rating: 4.6,
  calories: 361,
  flavorProfile: {
    sweetness: 4,
    creaminess: 5,
    refreshment: 4,
    energy: 3
  },
  pairings: [],
  subcategory: 'All Time Boba Milkshakes'
},
{
  id: 'p-mango-milkshake',
  name: 'Mango Milkshake',
  category: 'Boba Shakes',
  price: 249,
  largePriceAddOn: 69,
  image: '/assets/mangoboba.png',
  story: 'Experience the rich taste of our Mango Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'All Time Boba Milkshakes'
  ],
  mood: 'Happy Mood',
  rating: 4.8,
  calories: 507,
  flavorProfile: {
    sweetness: 2,
    creaminess: 4,
    refreshment: 1,
    energy: 2
  },
  pairings: [],
  subcategory: 'All Time Boba Milkshakes'
},
{
  id: 'p-ferrero-rocher-milkshake',
  name: 'Ferrero Rocher Milkshake',
  category: 'Boba Shakes',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/ferrerorocherboba.png',
  story: 'Experience the rich taste of our Ferrero Rocher Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'Signature Boba Milkshakes'
  ],
  mood: 'Sweet Cravings',
  rating: 4.8,
  calories: 370,
  flavorProfile: {
    sweetness: 2,
    creaminess: 2,
    refreshment: 2,
    energy: 2
  },
  pairings: [],
  subcategory: 'Signature Boba Milkshakes'
},
{
  id: 'p-chocolate-milkshake',
  name: 'Chocolate Milkshake',
  category: 'Boba Shakes',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/chocolateboba.png',
  story: 'Experience the rich taste of our Chocolate Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'Signature Boba Milkshakes'
  ],
  mood: 'Beat The Heat',
  rating: 4.7,
  calories: 548,
  flavorProfile: {
    sweetness: 2,
    creaminess: 3,
    refreshment: 1,
    energy: 2
  },
  pairings: [],
  subcategory: 'Signature Boba Milkshakes'
},
{
  id: 'p-caramel-popcorn-milkshake',
  name: 'Caramel Popcorn Milkshake',
  category: 'Boba Shakes',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/caramelpopcornboba.png',
  story: 'Experience the rich taste of our Caramel Popcorn Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'Signature Boba Milkshakes'
  ],
  mood: 'Need Energy',
  rating: 4.6,
  calories: 317,
  flavorProfile: {
    sweetness: 4,
    creaminess: 3,
    refreshment: 3,
    energy: 3
  },
  pairings: [],
  subcategory: 'Signature Boba Milkshakes'
},
{
  id: 'p-oreo-milkshake',
  name: 'Oreo Milkshake',
  category: 'Boba Shakes',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/oreoboba.png',
  story: 'Experience the rich taste of our Oreo Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'Signature Boba Milkshakes'
  ],
  mood: 'Need Energy',
  rating: 4.7,
  calories: 538,
  flavorProfile: {
    sweetness: 5,
    creaminess: 4,
    refreshment: 1,
    energy: 2
  },
  pairings: [],
  subcategory: 'Signature Boba Milkshakes'
},
{
  id: 'p-sea-salt-biscoff-milkshake',
  name: 'Sea Salt Biscoff Milkshake',
  category: 'Boba Shakes',
  price: 299,
  largePriceAddOn: 69,
  image: '/assets/seasaltbiscoffboba.png',
  story: 'Experience the rich taste of our Sea Salt Biscoff Milkshake, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Boba Shakes',
    'Signature Boba Milkshakes'
  ],
  mood: 'Happy Mood',
  rating: 5.0,
  calories: 285,
  flavorProfile: {
    sweetness: 2,
    creaminess: 3,
    refreshment: 3,
    energy: 3
  },
  pairings: [],
  subcategory: 'Signature Boba Milkshakes'
},
{
  id: 'p-cafe-frappe',
  name: 'Cafe Frappe',
  category: 'Cold Coffee',
  price: 279,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Cafe Frappe, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Cold Coffee'
  ],
  mood: 'Sweet Cravings',
  rating: 4.9,
  calories: 404,
  flavorProfile: {
    sweetness: 4,
    creaminess: 4,
    refreshment: 2,
    energy: 5
  },
  pairings: []
},
{
  id: 'p-almond-frappe',
  name: 'Almond Frappe',
  category: 'Cold Coffee',
  price: 279,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Almond Frappe, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Cold Coffee'
  ],
  mood: 'Happy Mood',
  rating: 4.6,
  calories: 304,
  flavorProfile: {
    sweetness: 4,
    creaminess: 2,
    refreshment: 2,
    energy: 4
  },
  pairings: []
},
{
  id: 'p-caramel-frappe',
  name: 'Caramel Frappe',
  category: 'Cold Coffee',
  price: 279,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Caramel Frappe, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Cold Coffee'
  ],
  mood: 'Sweet Cravings',
  rating: 4.6,
  calories: 385,
  flavorProfile: {
    sweetness: 4,
    creaminess: 4,
    refreshment: 2,
    energy: 4
  },
  pairings: []
},
{
  id: 'p-mocha-frappe',
  name: 'Mocha Frappe',
  category: 'Cold Coffee',
  price: 279,
  largePriceAddOn: 69,
  image: '/assets/mochaboba.png',
  story: 'Experience the rich taste of our Mocha Frappe, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Cold Coffee'
  ],
  mood: 'Beat The Heat',
  rating: 4.9,
  calories: 272,
  flavorProfile: {
    sweetness: 4,
    creaminess: 2,
    refreshment: 1,
    energy: 5
  },
  pairings: []
},
{
  id: 'p-cookie-and-cream-frappe',
  name: 'Cookie and Cream Frappe',
  category: 'Cold Coffee',
  price: 279,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Cookie and Cream Frappe, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Cold Coffee'
  ],
  mood: 'Happy Mood',
  rating: 4.9,
  calories: 532,
  flavorProfile: {
    sweetness: 4,
    creaminess: 3,
    refreshment: 3,
    energy: 3
  },
  pairings: []
},
{
  id: 'p-hazelnut-frappe',
  name: 'Hazelnut Frappe',
  category: 'Cold Coffee',
  price: 279,
  largePriceAddOn: 69,
  image: '/assets/hazelnutboba.png',
  story: 'Experience the rich taste of our Hazelnut Frappe, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Cold Coffee'
  ],
  mood: 'Beat The Heat',
  rating: 4.8,
  calories: 439,
  flavorProfile: {
    sweetness: 2,
    creaminess: 2,
    refreshment: 1,
    energy: 3
  },
  pairings: []
},
{
  id: 'p-ferrero-rocher-frappe',
  name: 'Ferrero Rocher Frappe',
  category: 'Cold Coffee',
  price: 279,
  largePriceAddOn: 69,
  image: '/assets/ferrerorocherboba.png',
  story: 'Experience the rich taste of our Ferrero Rocher Frappe, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Cold Coffee'
  ],
  mood: 'Sweet Cravings',
  rating: 4.7,
  calories: 270,
  flavorProfile: {
    sweetness: 5,
    creaminess: 3,
    refreshment: 1,
    energy: 4
  },
  pairings: []
},
{
  id: 'p-biscoff-frappe',
  name: 'Biscoff Frappe',
  category: 'Cold Coffee',
  price: 279,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Biscoff Frappe, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Cold Coffee'
  ],
  mood: 'Need Energy',
  rating: 4.9,
  calories: 458,
  flavorProfile: {
    sweetness: 3,
    creaminess: 3,
    refreshment: 1,
    energy: 4
  },
  pairings: []
},
{
  id: 'p-classic-lemonade',
  name: 'Classic Lemonade',
  category: 'Chillers',
  price: 199,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Classic Lemonade, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Chillers',
    'Lemonades'
  ],
  mood: 'Sweet Cravings',
  rating: 4.5,
  calories: 420,
  flavorProfile: {
    sweetness: 3,
    creaminess: 3,
    refreshment: 2,
    energy: 5
  },
  pairings: [],
  subcategory: 'Lemonades'
},
{
  id: 'p-sweet-and-salt-lemonade',
  name: 'Sweet and Salt Lemonade',
  category: 'Chillers',
  price: 199,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Sweet and Salt Lemonade, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Chillers',
    'Lemonades'
  ],
  mood: 'Beat The Heat',
  rating: 4.7,
  calories: 269,
  flavorProfile: {
    sweetness: 3,
    creaminess: 4,
    refreshment: 2,
    energy: 2
  },
  pairings: [],
  subcategory: 'Lemonades'
},
{
  id: 'p-nannari',
  name: 'Nannari',
  category: 'Chillers',
  price: 199,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Nannari, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Chillers',
    'Lemonades'
  ],
  mood: 'Beat The Heat',
  rating: 4.7,
  calories: 366,
  flavorProfile: {
    sweetness: 3,
    creaminess: 3,
    refreshment: 4,
    energy: 4
  },
  pairings: [],
  subcategory: 'Lemonades'
},
{
  id: 'p-yuzu-orange-lemonade',
  name: 'Yuzu Orange Lemonade',
  category: 'Chillers',
  price: 199,
  largePriceAddOn: 69,
  image: '/assets/yuzunewarrival.png',
  story: 'Experience the rich taste of our Yuzu Orange Lemonade, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Chillers',
    'Lemonades'
  ],
  mood: 'Sweet Cravings',
  rating: 4.6,
  calories: 285,
  flavorProfile: {
    sweetness: 2,
    creaminess: 3,
    refreshment: 4,
    energy: 4
  },
  pairings: [],
  subcategory: 'Lemonades'
},
{
  id: 'p-classic-mojito',
  name: 'Classic Mojito',
  category: 'Chillers',
  price: 219,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Classic Mojito, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Chillers',
    'Virgin Mojitos'
  ],
  mood: 'Need Energy',
  rating: 4.6,
  calories: 383,
  flavorProfile: {
    sweetness: 4,
    creaminess: 5,
    refreshment: 3,
    energy: 2
  },
  pairings: [],
  subcategory: 'Virgin Mojitos'
},
{
  id: 'p-blue-coral-mojito',
  name: 'Blue Coral Mojito',
  category: 'Chillers',
  price: 219,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Blue Coral Mojito, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Chillers',
    'Virgin Mojitos'
  ],
  mood: 'Sweet Cravings',
  rating: 4.7,
  calories: 410,
  flavorProfile: {
    sweetness: 4,
    creaminess: 2,
    refreshment: 1,
    energy: 5
  },
  pairings: [],
  subcategory: 'Virgin Mojitos'
},
{
  id: 'p-yuzu-melon-mojito',
  name: 'Yuzu Melon Mojito',
  category: 'Chillers',
  price: 219,
  largePriceAddOn: 69,
  image: '/assets/yuzunewarrival.png',
  story: 'Experience the rich taste of our Yuzu Melon Mojito, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Chillers',
    'Virgin Mojitos'
  ],
  mood: 'Beat The Heat',
  rating: 4.5,
  calories: 473,
  flavorProfile: {
    sweetness: 2,
    creaminess: 5,
    refreshment: 2,
    energy: 4
  },
  pairings: [],
  subcategory: 'Virgin Mojitos'
},
{
  id: 'p-apple-mojito',
  name: 'Apple Mojito',
  category: 'Chillers',
  price: 219,
  largePriceAddOn: 69,
  image: '',
  story: 'Experience the rich taste of our Apple Mojito, made with premium ingredients.',
  flavorNotes: [
    'Premium',
    'Rich',
    'Chillers',
    'Virgin Mojitos'
  ],
  mood: 'Happy Mood',
  rating: 5.0,
  calories: 419,
  flavorProfile: {
    sweetness: 3,
    creaminess: 4,
    refreshment: 4,
    energy: 2
  },
  pairings: [],
  subcategory: 'Virgin Mojitos'
},
{
  id: 'p-french-fries',
  name: 'French Fries',
  category: 'Quick Bites',
  price: 120,
  image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
  story: 'Crispy golden fries tossed in our secret seasoning. The perfect salty companion to a sweet boba.',
  flavorNotes: [
    'Salty',
    'Crispy',
    'Savory'
  ],
  mood: 'Happy Mood',
  rating: 4.5,
  calories: 365,
  flavorProfile: {
    sweetness: 0,
    creaminess: 1,
    refreshment: 0,
    energy: 3
  },
  pairings: [
    'p-brown-sugar-boba'
  ]
},
{
  id: 'p-cheese-shots',
  name: 'Cheese Shots',
  category: 'Quick Bites',
  price: 150,
  image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=800',
  story: 'Bite-sized spheres of melted cheese with a crunchy golden exterior.',
  flavorNotes: [
    'Cheesy',
    'Crunchy',
    'Salty'
  ],
  mood: 'Sweet Cravings',
  rating: 4.8,
  calories: 450,
  flavorProfile: {
    sweetness: 0,
    creaminess: 4,
    refreshment: 0,
    energy: 3
  },
  pairings: [
    'p-ferrero-rocher-boba-tea'
  ]
},
{
  id: 'p-hashbrowns',
  name: 'Hashbrowns',
  category: 'Quick Bites',
  price: 130,
  image: 'https://images.unsplash.com/photo-1526230427044-d092040d48dc?auto=format&fit=crop&q=80&w=800',
  story: 'Golden and crispy shredded potatoes.',
  flavorNotes: [
    'Salty',
    'Crispy',
    'Potato'
  ],
  mood: 'Happy Mood',
  rating: 4.6,
  calories: 320,
  flavorProfile: {
    sweetness: 0,
    creaminess: 1,
    refreshment: 0,
    energy: 3
  },
  pairings: []
},
{
  id: 'p-potato-wedges',
  name: 'Potato Wedges',
  category: 'Quick Bites',
  price: 140,
  image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
  story: 'Thick-cut potato wedges seasoned to perfection.',
  flavorNotes: [
    'Savory',
    'Spiced',
    'Crispy'
  ],
  mood: 'Need Energy',
  rating: 4.7,
  calories: 380,
  flavorProfile: {
    sweetness: 0,
    creaminess: 1,
    refreshment: 0,
    energy: 3
  },
  pairings: []
},
{
  id: 'p-sweet-corn',
  name: 'Sweet Corn',
  category: 'Quick Bites',
  price: 100,
  image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800',
  story: 'Warm, buttery sweet corn kernels with a hint of spice.',
  flavorNotes: [
    'Sweet',
    'Buttery',
    'Warm'
  ],
  mood: 'Sweet Cravings',
  rating: 4.6,
  calories: 200,
  flavorProfile: {
    sweetness: 4,
    creaminess: 2,
    refreshment: 3,
    energy: 2
  },
  pairings: []
}
,
{
  id: 'p-sunrise-americano',
  name: 'Sunrise Americano',
  category: 'Barista',
  price: 160,
  image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&q=80&w=800',
  story: 'Bright and refreshing Americano to start your day.',
  flavorNotes: ['Bold', 'Refreshing'],
  mood: 'Need Energy',
  rating: 4.7,
  calories: 15,
  flavorProfile: { sweetness: 0, creaminess: 0, refreshment: 4, energy: 5 },
  pairings: []
},
{
  id: 'p-spanish-latte',
  name: 'Spanish Latte',
  category: 'Barista',
  price: 220,
  image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800',
  story: 'Rich espresso mixed with sweet condensed milk.',
  flavorNotes: ['Sweet', 'Creamy'],
  mood: 'Happy Mood',
  rating: 4.9,
  calories: 280,
  flavorProfile: { sweetness: 4, creaminess: 4, refreshment: 1, energy: 4 },
  pairings: []
},
{
  id: 'p-americano',
  name: 'Americano',
  category: 'Barista',
  price: 150,
  image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&q=80&w=800',
  story: 'Classic black coffee, strong and bold.',
  flavorNotes: ['Bold', 'Strong'],
  mood: 'Need Energy',
  rating: 4.6,
  calories: 10,
  flavorProfile: { sweetness: 0, creaminess: 0, refreshment: 3, energy: 5 },
  pairings: []
},
{
  id: 'p-mocha-cappuccino',
  name: 'Mocha Cappuccino',
  category: 'Barista',
  price: 240,
  image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=800',
  story: 'Perfect blend of rich chocolate and strong espresso.',
  flavorNotes: ['Chocolate', 'Coffee'],
  mood: 'Sweet Cravings',
  rating: 4.8,
  calories: 310,
  flavorProfile: { sweetness: 3, creaminess: 4, refreshment: 1, energy: 4 },
  pairings: []
},
{
  id: 'p-biscoff-latte',
  name: 'Biscoff Latte',
  category: 'Barista',
  price: 260,
  image: 'https://images.unsplash.com/photo-1620083328004-972147ea4182?auto=format&fit=crop&q=80&w=800',
  story: 'Creamy latte infused with caramelized Biscoff spread.',
  flavorNotes: ['Caramel', 'Creamy'],
  mood: 'Sweet Cravings',
  rating: 5.0,
  calories: 380,
  flavorProfile: { sweetness: 5, creaminess: 5, refreshment: 1, energy: 3 },
  pairings: []
},
{
  id: 'bh-banana-loaf',
  name: 'Banana Loaf',
  category: 'Bake House',
  price: 180,
  image: '/src/assets/bananaloaf.png',
  story: 'Freshly baked soft banana loaf cake.',
  flavorNotes: ['Sweet', 'Soft'],
  mood: 'Sweet Cravings',
  rating: 4.8,
  calories: 320,
  flavorProfile: { sweetness: 4, creaminess: 3, refreshment: 1, energy: 3 },
  pairings: []
},
{
  id: 'bh-mango-cheesecake',
  name: 'Mango Cheesecake',
  category: 'Bake House',
  price: 240,
  image: '/src/assets/mangocheesecake.png',
  story: 'Rich and creamy cheesecake with a fresh mango glaze.',
  flavorNotes: ['Fruity', 'Creamy'],
  mood: 'Sweet Cravings',
  rating: 4.9,
  calories: 450,
  flavorProfile: { sweetness: 5, creaminess: 5, refreshment: 3, energy: 2 },
  pairings: []
},
{
  id: 'bh-mango-croissant',
  name: 'Mango Croissant',
  category: 'Bake House',
  price: 190,
  image: '/src/assets/mangocroissant.png',
  story: 'Flaky, buttery croissant filled with sweet mango cream.',
  flavorNotes: ['Buttery', 'Fruity'],
  mood: 'Happy Mood',
  rating: 4.7,
  calories: 380,
  flavorProfile: { sweetness: 4, creaminess: 3, refreshment: 2, energy: 3 },
  pairings: []
},
{
  id: 'bh-mango-tres-leches',
  name: 'Mango Tres Leches',
  category: 'Bake House',
  price: 260,
  image: '/src/assets/mangotresleches.png',
  story: 'Classic three-milk sponge cake topped with fresh mango.',
  flavorNotes: ['Rich', 'Fruity'],
  mood: 'Sweet Cravings',
  rating: 5.0,
  calories: 410,
  flavorProfile: { sweetness: 5, creaminess: 5, refreshment: 3, energy: 2 },
  pairings: []
},
{
  id: 'bh-marble-loaf',
  name: 'Marble Loaf',
  category: 'Bake House',
  price: 180,
  image: '/src/assets/marbleloaf.png',
  story: 'A perfectly swirled vanilla and chocolate pound cake.',
  flavorNotes: ['Chocolate', 'Vanilla'],
  mood: 'Sweet Cravings',
  rating: 4.6,
  calories: 340,
  flavorProfile: { sweetness: 4, creaminess: 3, refreshment: 1, energy: 3 },
  pairings: []
},
{
  id: 'bh-multigrain-bagel',
  name: 'Multigrain Bagel',
  category: 'Bake House',
  price: 150,
  image: '/src/assets/multigrainbagel.png',
  story: 'Healthy, chewy multigrain bagel perfect for a quick bite.',
  flavorNotes: ['Savory', 'Healthy'],
  mood: 'Morning Focus',
  rating: 4.5,
  calories: 280,
  flavorProfile: { sweetness: 1, creaminess: 1, refreshment: 1, energy: 4 },
  pairings: []
}
];

export const getFeaturedProducts = () => MENU.slice(0, 6);
export const getBestSellers = () => MENU.slice(3, 8);
export const getNewLaunches = () => MENU.slice(10, 15);
export const getStaffPicks = () => MENU.slice(6, 11);
export const getByMood = (mood: string) => MENU.filter(p => p.mood === mood && p.category !== 'Quick Bites');
export const getPopularCombos = () => {
  return MENU.filter(p => p.pairings.length > 0).slice(0, 4);
};
export const getRecommendedToppings = (product: MenuItem): string[] => {
  return product.recommendedToppings || ['t1'];
};

export const getBakeHouseItems = () => MENU.filter(p => p.category === "Bake House");
export const getBaristaItems = () => MENU.filter(p => p.category === "Barista");
