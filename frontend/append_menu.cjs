const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, 'src/data/menu.ts');
let content = fs.readFileSync(menuPath, 'utf-8');

// Add to CATEGORIES if not present
if (!content.includes("'Bake House'")) {
    content = content.replace("'Quick Bites'", "'Quick Bites',\n  'Bake House',\n  'Barista'");
}

const newItems = `
,{
  id: 'p-mango-croissant',
  name: 'Mango Croissant',
  category: 'Bake House',
  price: 150,
  image: 'https://images.unsplash.com/photo-1549996647-190b679b33d7?auto=format&fit=crop&q=80&w=800',
  story: 'Flaky butter croissant filled with sweet mango cream.',
  flavorNotes: ['Fruity', 'Buttery'],
  mood: 'Sweet Cravings',
  rating: 4.8,
  calories: 320,
  flavorProfile: { sweetness: 4, creaminess: 3, refreshment: 1, energy: 2 },
  pairings: []
},
{
  id: 'p-mango-cheesecake',
  name: 'Mango Cheese Cake',
  category: 'Bake House',
  price: 180,
  image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800',
  story: 'Classic New York cheesecake topped with fresh mango glaze.',
  flavorNotes: ['Fruity', 'Creamy'],
  mood: 'Sweet Cravings',
  rating: 4.9,
  calories: 450,
  flavorProfile: { sweetness: 5, creaminess: 5, refreshment: 1, energy: 2 },
  pairings: []
},
{
  id: 'p-marble-loaf',
  name: 'Marble Loaf',
  category: 'Bake House',
  price: 120,
  image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800',
  story: 'Soft and moist loaf swirled with rich chocolate and vanilla.',
  flavorNotes: ['Chocolate', 'Vanilla'],
  mood: 'Happy Mood',
  rating: 4.7,
  calories: 350,
  flavorProfile: { sweetness: 4, creaminess: 2, refreshment: 0, energy: 3 },
  pairings: []
},
{
  id: 'p-multigrain-bagel',
  name: 'Multigrain Bagel',
  category: 'Bake House',
  price: 140,
  image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
  story: 'Healthy multigrain bagel, perfect for a quick snack.',
  flavorNotes: ['Healthy', 'Savoury'],
  mood: 'Need Energy',
  rating: 4.5,
  calories: 280,
  flavorProfile: { sweetness: 1, creaminess: 1, refreshment: 0, energy: 4 },
  pairings: []
},
{
  id: 'p-mango-tresleches',
  name: 'Mango Tresleches',
  category: 'Bake House',
  price: 190,
  image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800',
  story: 'Soft sponge cake soaked in three milks and topped with mango.',
  flavorNotes: ['Fruity', 'Creamy', 'Rich'],
  mood: 'Sweet Cravings',
  rating: 4.9,
  calories: 410,
  flavorProfile: { sweetness: 5, creaminess: 5, refreshment: 2, energy: 2 },
  pairings: []
},
{
  id: 'p-banana-loaf',
  name: 'Banana Loaf',
  category: 'Bake House',
  price: 130,
  image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800',
  story: 'Moist banana bread made with ripe bananas and walnuts.',
  flavorNotes: ['Fruity', 'Nutty'],
  mood: 'Happy Mood',
  rating: 4.8,
  calories: 340,
  flavorProfile: { sweetness: 3, creaminess: 2, refreshment: 0, energy: 3 },
  pairings: []
},
{
  id: 'p-butter-croissant',
  name: 'Butter Croissant',
  category: 'Bake House',
  price: 110,
  image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
  story: 'Classic French butter croissant, flaky and golden.',
  flavorNotes: ['Buttery', 'Flaky'],
  mood: 'Need Energy',
  rating: 4.9,
  calories: 290,
  flavorProfile: { sweetness: 1, creaminess: 3, refreshment: 0, energy: 3 },
  pairings: []
},
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
}
];`;

if (!content.includes("'p-mango-croissant'")) {
    content = content.replace('];\n\nexport const getFeaturedProducts', newItems + '\n\nexport const getFeaturedProducts');
}

// Add getter functions
if (!content.includes('export const getBakeHouseItems')) {
    content += '\nexport const getBakeHouseItems = () => MENU.filter(p => p.category === "Bake House");';
    content += '\nexport const getBaristaItems = () => MENU.filter(p => p.category === "Barista");\n';
}

fs.writeFileSync(menuPath, content, 'utf-8');
console.log('Appended menu items.');
