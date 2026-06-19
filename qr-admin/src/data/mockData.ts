import type { Campaign, Category, Combo, Offer, Product, Story } from './models';
// Imports removed, using public strings instead.

// Using placeholder images for now until the real assets are provided
const placeholderImg = (text: string) => `https://placehold.co/600x600/FFD54F/111111?text=${text}`;

export const campaigns: Campaign[] = [
  {
    id: 'c1',
    title: 'NEW DESSERTS',
    subtitle: 'Newly Introduced Desserts',
    image: '/assets/herobanner1.jpeg',
    ctaText: 'Order Now',
    link: '/menu?category=dessert',
  },
  {
    id: 'c2',
    title: 'BARISTA SPECIAL',
    subtitle: 'Try our new crafted signature drinks!',
    image: '/assets/herobanner2.jpeg',
    ctaText: 'Explore Now',
    link: '/menu?category=classic',
  },
  {
    id: 'c3',
    title: 'PERFECT PAIR',
    subtitle: 'Add any dessert for just ₹150',
    image: '/assets/herobanner3.jpeg',
    ctaText: 'Grab Offer',
    link: '/menu?category=combo',
  }
];

export const stories: Story[] = [
  { id: 's1', title: 'Newly Introduced', image: '/assets/storynew1.jpeg', slides: ['/assets/storynew1.jpeg', '/assets/storynew2.jpeg'], badge: 'NEW' },
  { id: 's2', title: 'Trending', image: '/assets/trending1.png', slides: ['/assets/trending1.png', '/assets/trending2.png', '/assets/trending3.png'], badge: 'HOT' },
  { id: 's3', title: 'Offers', image: '/assets/offers1.png', slides: ['/assets/offers1.png'] },
  { id: 's5', title: 'Best Sellers', image: '/assets/bestseller1.png', slides: ['/assets/bestseller1.png', '/assets/bestseller2.png', '/assets/bestseller3.png', '/assets/bestseller4.png'] },
];

export const categories: Category[] = [
  { id: 'cat_classic', name: 'Classic', icon: '🧋' },
  { id: 'cat_fruit', name: 'Fruit Tea', icon: '🍓' },
  { id: 'cat_choco', name: 'Chocolate', icon: '🍫' },
  { id: 'cat_coffee', name: 'Coffee', icon: '☕' },
  { id: 'cat_nonmilk', name: 'Non-Milk Tea', icon: '🍵' },
  { id: 'cat_dessert', name: 'Desserts', icon: '🍰' },
  { id: 'cat_snack', name: 'Snacks', icon: '🍟' },
  { id: 'cat_combo', name: 'Combos', icon: '🍱' },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Brown Sugar Boba',
    price: 189,
    rating: 4.8,
    reviewsCount: 1200,
    image: '/assets/brownsugartrending.png',
    category: 'cat_classic',
    isTrending: true,
    isBestSeller: true,
    description: 'Our signature brown sugar syrup with fresh milk and chewy tapioca pearls.',
    customizable: true,
  },
  {
    id: 'p2',
    name: 'Ferrero Boba',
    price: 219,
    rating: 4.9,
    reviewsCount: 890,
    image: '/assets/ferrerotrending.png',
    category: 'cat_choco',
    isTrending: true,
    description: 'Rich, Chocolatey, Absolutely addictive. Premium chocolate mixed with creamy milk.',
    customizable: true,
  },
  {
    id: 'p3',
    name: 'Matcha Boba',
    price: 199,
    rating: 4.7,
    reviewsCount: 710,
    image: '/assets/matchatrending.png',
    category: 'cat_classic',
    isTrending: true,
    description: 'Authentic Japanese matcha blended with smooth milk and pearls.',
    customizable: true,
  },
  {
    id: 'p4',
    name: 'Mango Fruit Tea',
    price: 189,
    rating: 4.8,
    reviewsCount: 950,
    image: '/assets/mangotrending.png',
    category: 'cat_fruit',
    isTrending: true,
    tags: ['Refreshing', 'Fruity', 'Non-Milk'],
    description: 'A refreshing tropical blend of mango with real fruit bits and popping boba.',
    customizable: true,
  },
  {
    id: 'p5',
    name: 'Yuzu Iced Boba Tea',
    price: 199,
    rating: 4.7,
    reviewsCount: 320,
    image: '/assets/yuzunewarrival.png',
    category: 'cat_fruit',
    isNew: true,
    description: 'Sparkling yuzu paired with refreshing iced tea.',
    customizable: true,
  },
  {
    id: 'p6',
    name: 'Elderflower Iced Boba Tea',
    price: 189,
    rating: 4.8,
    reviewsCount: 410,
    image: '/assets/elderflowernewarrival.avif',
    category: 'cat_fruit',
    isNew: true,
    description: 'Delicate elderflower infused with sweet iced tea.',
    customizable: true,
  },
  {
    id: 'p7',
    name: 'Pink Grapefruit Iced Boba Tea',
    price: 219,
    rating: 4.7,
    reviewsCount: 150,
    image: '/assets/pinkgrapefruitnewarrival.png',
    category: 'cat_fruit',
    isNew: true,
    description: 'Tangy pink grapefruit blended with our refreshing iced tea.',
    customizable: true,
  },
  {
    id: 'p8',
    name: 'Lotus Biscoff Boba Tea',
    price: 179,
    rating: 4.6,
    reviewsCount: 220,
    image: '/assets/lotusbiscoffnewarrival.png',
    category: 'cat_classic',
    isNew: true,
    description: 'Premium milk tea blended with rich Lotus Biscoff flavor.',
    customizable: true,
  },
  {
    id: 'p9',
    name: 'Sea Salt Biscoff Boba Tea',
    price: 189,
    rating: 4.8,
    reviewsCount: 560,
    image: '/assets/seasaltbiscoffnewarrival.png',
    category: 'cat_classic',
    isNew: true,
    description: 'Creamy biscoff tea topped with our signature sea salt cream.',
    customizable: true,
  }
];

export const offers: Offer[] = [
  {
    id: 'o1',
    title: 'SWEET DEAL',
    description: 'Get any dessert for ₹150 with a Boba Tea purchase!',
    image: placeholderImg('Sweet+Deal'),
    code: 'BOBA150',
    validUntil: 'Today 5:00 PM',
    ctaText: 'Order Now',
  },
  {
    id: 'o2',
    title: 'BUY 1 GET 1',
    description: 'On Fruit Teas. Limited Time Only!',
    image: placeholderImg('BOGO'),
    code: 'BOGOF',
    validUntil: 'This Weekend',
    ctaText: 'Order Now',
  },
  {
    id: 'o3',
    title: 'STUDENT COMBO',
    description: 'Show your ID & get 15% OFF',
    image: placeholderImg('Student'),
    code: 'STUDENT15',
    validUntil: 'Always Valid',
    ctaText: 'Order Now',
  }
];

export const combos: Combo[] = [
  {
    id: 'cmb1',
    title: 'Boba + Fries Combo',
    items: [products[0], { ...products[0], id: 'snk1', name: 'French Fries', price: 90, category: 'cat_snack' } as Product],
    price: 249,
    originalPrice: 279,
    image: placeholderImg('Boba+Fries'),
  },
  {
    id: 'cmb2',
    title: 'Mango Tea + Cheesecake',
    items: [products[3], { ...products[0], id: 'dsr1', name: 'Cheesecake', price: 150, category: 'cat_dessert' } as Product],
    price: 299,
    originalPrice: 339,
    image: placeholderImg('Mango+Cheese'),
  },
  {
    id: 'cmb3',
    title: 'Taro Boba + Choco Lava Cake',
    items: [products[8], { ...products[0], id: 'dsr2', name: 'Choco Lava Cake', price: 180, category: 'cat_dessert' } as Product],
    price: 329,
    originalPrice: 369,
    image: placeholderImg('Taro+Lava'),
  },
  {
    id: 'cmb4',
    title: 'Classic Boba + Popcorn Chicken',
    items: [products[0], { ...products[0], id: 'snk2', name: 'Popcorn Chicken', price: 120, category: 'cat_snack' } as Product],
    price: 279,
    originalPrice: 309,
    image: placeholderImg('Boba+Chicken'),
  }
];
