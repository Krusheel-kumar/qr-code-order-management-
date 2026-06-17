const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'menu.ts');
let data = fs.readFileSync(filePath, 'utf8');

// The new items to add
const newItems = `
{
  id: 'p-lemon-iced-boba',
  name: 'Lemon Iced Boba Tea',
  category: 'Boba iced teas',
  subcategory: 'classics',
  price: 189,
  image: '',
  story: 'Refreshing classic lemon iced tea with chewy boba.',
  flavorNotes: ['Citrus', 'Refreshing', 'classics'],
  mood: 'Beat The Heat',
  rating: 4.6,
  calories: 210,
  flavorProfile: { sweetness: 3, creaminess: 0, refreshment: 5, energy: 3 },
  pairings: []
},
{
  id: 'p-strawberry-iced-boba',
  name: 'Strawberry Iced Boba Tea',
  category: 'Boba iced teas',
  subcategory: 'classics',
  price: 199,
  image: '',
  story: 'Sweet strawberry puree mixed with refreshing iced tea and boba.',
  flavorNotes: ['Sweet', 'Fruity', 'classics'],
  mood: 'Happy Mood',
  rating: 4.8,
  calories: 230,
  flavorProfile: { sweetness: 4, creaminess: 0, refreshment: 4, energy: 3 },
  pairings: []
},
{
  id: 'p-blueberry-iced-tea',
  name: 'Blueberry Iced Tea',
  category: 'Boba iced teas',
  subcategory: 'classics',
  price: 199,
  image: '',
  story: 'Antioxidant-rich blueberry iced tea.',
  flavorNotes: ['Berry', 'Refreshing', 'classics'],
  mood: 'Beat The Heat',
  rating: 4.5,
  calories: 215,
  flavorProfile: { sweetness: 3, creaminess: 0, refreshment: 4, energy: 3 },
  pairings: []
},
{
  id: 'p-orange-iced-tea',
  name: 'Orange Iced Tea',
  category: 'Boba iced teas',
  subcategory: 'classics',
  price: 189,
  image: '',
  story: 'Zesty orange infused into classic iced tea.',
  flavorNotes: ['Citrus', 'Zesty', 'classics'],
  mood: 'Need Energy',
  rating: 4.4,
  calories: 200,
  flavorProfile: { sweetness: 3, creaminess: 0, refreshment: 4, energy: 4 },
  pairings: []
},
{
  id: 'p-apple-twist-boba',
  name: 'Apple Twist Boba Tea',
  category: 'Boba iced teas',
  subcategory: 'signatures',
  price: 219,
  image: '',
  story: 'A signature blend of crisp apple and premium tea.',
  flavorNotes: ['Crisp', 'Sweet', 'signatures'],
  mood: 'Happy Mood',
  rating: 4.7,
  calories: 225,
  flavorProfile: { sweetness: 3, creaminess: 0, refreshment: 5, energy: 3 },
  pairings: []
},
{
  id: 'p-peach-iced-tea',
  name: 'Peach Iced Tea',
  category: 'Boba iced teas',
  subcategory: 'signatures',
  price: 219,
  image: '',
  story: 'Sweet peach nectar in our signature iced tea blend.',
  flavorNotes: ['Peach', 'Sweet', 'signatures'],
  mood: 'Sweet Cravings',
  rating: 4.9,
  calories: 240,
  flavorProfile: { sweetness: 4, creaminess: 0, refreshment: 4, energy: 2 },
  pairings: []
},
{
  id: 'p-yuzu-iced-boba',
  name: 'Yuzu Iced Boba Tea',
  category: 'Boba iced teas',
  subcategory: 'signatures',
  price: 229,
  image: '',
  story: 'Premium Japanese yuzu citrus iced tea.',
  flavorNotes: ['Yuzu', 'Tangy', 'signatures'],
  mood: 'Beat The Heat',
  rating: 4.8,
  calories: 210,
  flavorProfile: { sweetness: 2, creaminess: 0, refreshment: 5, energy: 4 },
  pairings: []
},
{
  id: 'p-pink-grapefruit-boba',
  name: 'Pink Grapefruit Boba Tea',
  category: 'Boba iced teas',
  subcategory: 'signatures',
  price: 229,
  image: '',
  story: 'Tangy and refreshing pink grapefruit iced tea.',
  flavorNotes: ['Grapefruit', 'Tangy', 'signatures'],
  mood: 'Need Energy',
  rating: 4.6,
  calories: 205,
  flavorProfile: { sweetness: 2, creaminess: 0, refreshment: 5, energy: 4 },
  pairings: []
},
{
  id: 'p-elderflower-iced-boba',
  name: 'Elderflower Iced Boba Tea',
  category: 'Boba iced teas',
  subcategory: 'signatures',
  price: 239,
  image: '',
  story: 'Floral and delicate elderflower iced tea.',
  flavorNotes: ['Floral', 'Delicate', 'signatures'],
  mood: 'Happy Mood',
  rating: 4.9,
  calories: 190,
  flavorProfile: { sweetness: 2, creaminess: 0, refreshment: 4, energy: 2 },
  pairings: []
},`;

// Update CATEGORIES array
data = data.replace(
  /export const CATEGORIES = \[[\s\S]*?\];/,
  "export const CATEGORIES = [\n  'Boba milk teas',\n  'Boba iced teas',\n  'Quick Bites'\n];"
);

// Insert new items before the end of the MENU array
data = data.replace(/];\s*export const getFeaturedProducts/, newItems + "\n];\n\nexport const getFeaturedProducts");

fs.writeFileSync(filePath, data);
console.log('Successfully added iced teas to menu.ts');
