import json
import re

# Menu categories from user
menu_structure = [
    ("Milk Teas", "Classics", 249, [
        "Authentic Milk Tea",
        "Hong Kong Milk Tea",
        "Matcha Green Tea",
        "Taro Milk Tea",
        "Brown Sugar Boba"
    ]),
    ("Milk Teas", "Fruit", 269, [
        "Strawberry Milk Tea",
        "Mango Milk Tea",
        "Lychee Milk Tea",
        "Blueberry Milk Tea",
        "Honeydew Milk Tea"
    ]),
    ("Milk Teas", "Chocolate Classics", 289, [
        "Chocolate Boba Tea",
        "Choco Fantasy Boba Tea",
        "Dark Cocoa Boba Tea",
        "Choco Caramel"
    ]),
    ("Milk Teas", "Chocolate Signatures", 299, [
        "Nutella Boba Tea",
        "Ferrero Rocher Boba Tea",
        "Oreo Oreo Boba Tea",
        "Lotus Biscoff Boba Tea"
    ]),
    ("Milk Teas", "Coffee", 279, [
        "Hazelnut Milk Tea",
        "Mocha Milk Tea",
        "Desi Coffee",
        "Caramel Coffee"
    ]),
    ("Milk Teas", "Signatures", 299, [
        "Sea Salt Biscoff",
        "Caramel Popcorn",
        "Pistachio Latte",
        "Mango Pulp",
        "Tender Coconut Boba"
    ]),
    ("Boba Shakes", "All Time Boba Milkshakes", 249, [
        "Vanilla Milkshake",
        "Chocolate Milkshake",
        "Strawberry Milkshake",
        "Blueberry Milkshake",
        "Lychee Milkshake",
        "Mango Milkshake"
    ]),
    ("Boba Shakes", "Signature Boba Milkshakes", 299, [
        "Ferrero Rocher Milkshake",
        "Chocolate Milkshake",
        "Caramel Popcorn Milkshake",
        "Oreo Milkshake",
        "Sea Salt Biscoff Milkshake"
    ]),
    ("Cold Coffee", "", 279, [
        "Cafe Frappe",
        "Almond Frappe",
        "Caramel Frappe",
        "Mocha Frappe",
        "Cookie and Cream Frappe",
        "Hazelnut Frappe",
        "Ferrero Rocher Frappe",
        "Biscoff Frappe"
    ]),
    ("Chillers", "Lemonades", 199, [
        "Classic Lemonade",
        "Sweet and Salt Lemonade",
        "Nannari",
        "Yuzu Orange Lemonade"
    ]),
    ("Chillers", "Virgin Mojitos", 219, [
        "Classic Mojito",
        "Blue Coral Mojito",
        "Yuzu Melon Mojito",
        "Apple Mojito"
    ])
]

# Generate MenuItem objects
menu_items = []
import random
random.seed(42)

def to_id(name):
    return 'p-' + name.lower().replace(' ', '-')

for category, subcategory, price, items in menu_structure:
    for item in items:
        # Default empty string for image
        image = ''
        
        # Simple heuristics for flavors/mood
        mood = random.choice(['Happy Mood', 'Sweet Cravings', 'Need Energy', 'Beat The Heat'])
        
        flavorProfile = {
            'sweetness': random.randint(2, 5),
            'creaminess': random.randint(2, 5),
            'refreshment': random.randint(1, 4),
            'energy': random.randint(2, 5)
        }
        
        menu_item = {
            'id': to_id(item),
            'name': item,
            'category': category,
            'price': price,
            'largePriceAddOn': 69,
            'image': image,
            'story': f"Experience the rich taste of our {item}, made with premium ingredients.",
            'flavorNotes': ['Premium', 'Rich', category],
            'mood': mood,
            'rating': round(random.uniform(4.5, 5.0), 1),
            'calories': random.randint(250, 550),
            'flavorProfile': flavorProfile,
            'pairings': []
        }
        if subcategory:
            menu_item['subcategory'] = subcategory
            menu_item['flavorNotes'].append(subcategory)
            
        menu_items.append(menu_item)

# Keep Quick Bites
quick_bites = [
  {
    "id": 'p-french-fries',
    "name": 'French Fries',
    "category": 'Quick Bites',
    "price": 120,
    "image": 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
    "story": 'Crispy golden fries tossed in our secret seasoning. The perfect salty companion to a sweet boba.',
    "flavorNotes": ['Salty', 'Crispy', 'Savory'],
    "mood": 'Happy Mood',
    "rating": 4.5,
    "calories": 365,
    "flavorProfile": { "sweetness": 0, "creaminess": 1, "refreshment": 0, "energy": 3 },
    "pairings": ['p-brown-sugar-boba']
  },
  {
    "id": 'p-cheese-shots',
    "name": 'Cheese Shots',
    "category": 'Quick Bites',
    "price": 150,
    "image": 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=800',
    "story": 'Bite-sized spheres of melted cheese with a crunchy golden exterior.',
    "flavorNotes": ['Cheesy', 'Crunchy', 'Salty'],
    "mood": 'Sweet Cravings',
    "rating": 4.8,
    "calories": 450,
    "flavorProfile": { "sweetness": 0, "creaminess": 4, "refreshment": 0, "energy": 3 },
    "pairings": ['p-ferrero-rocher-boba-tea']
  },
  {
    "id": 'p-hashbrowns',
    "name": 'Hashbrowns',
    "category": 'Quick Bites',
    "price": 130,
    "image": 'https://images.unsplash.com/photo-1526230427044-d092040d48dc?auto=format&fit=crop&q=80&w=800',
    "story": 'Golden and crispy shredded potatoes.',
    "flavorNotes": ['Salty', 'Crispy', 'Potato'],
    "mood": 'Happy Mood',
    "rating": 4.6,
    "calories": 320,
    "flavorProfile": { "sweetness": 0, "creaminess": 1, "refreshment": 0, "energy": 3 },
    "pairings": []
  },
  {
    "id": 'p-potato-wedges',
    "name": 'Potato Wedges',
    "category": 'Quick Bites',
    "price": 140,
    "image": 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
    "story": 'Thick-cut potato wedges seasoned to perfection.',
    "flavorNotes": ['Savory', 'Spiced', 'Crispy'],
    "mood": 'Need Energy',
    "rating": 4.7,
    "calories": 380,
    "flavorProfile": { "sweetness": 0, "creaminess": 1, "refreshment": 0, "energy": 3 },
    "pairings": []
  },
  {
    "id": 'p-sweet-corn',
    "name": 'Sweet Corn',
    "category": 'Quick Bites',
    "price": 100,
    "image": 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800',
    "story": 'Warm, buttery sweet corn kernels with a hint of spice.',
    "flavorNotes": ['Sweet', 'Buttery', 'Warm'],
    "mood": 'Sweet Cravings',
    "rating": 4.6,
    "calories": 200,
    "flavorProfile": { "sweetness": 3, "creaminess": 2, "refreshment": 0, "energy": 2 },
    "pairings": []
  }
]

all_items = menu_items + quick_bites

# Serialize to JS
def dict_to_js(d):
    return json.dumps(d, indent=2).replace('\"', "'")

items_str = ',\n'.join(json.dumps(x, indent=2) for x in all_items)
items_str = items_str.replace('"', "'")
# A bit of regex to fix keys without quotes (not strict JSON but TS valid)
items_str = re.sub(r"'([a-zA-Z0-9_]+)':", r"\1:", items_str)

menu_ts_content = f"""export interface ProductFlavorProfile {{
  sweetness: number; // 0-5
  creaminess: number; // 0-5
  refreshment: number; // 0-5
  energy: number; // 0-5
}}

export interface MenuItem {{
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  largePriceAddOn?: number;
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
  pairings: string[]; // IDs of paired items
}}

export const CATEGORIES = [
  'Milk Teas',
  'Boba Shakes',
  'Cold Coffee',
  'Chillers',
  'Quick Bites'
];

export const MENU: MenuItem[] = [
{items_str}
];

export const getFeaturedProducts = () => MENU.slice(0, 6);
export const getBestSellers = () => MENU.slice(3, 8);
export const getNewLaunches = () => MENU.slice(10, 15);
export const getStaffPicks = () => MENU.slice(6, 11);
export const getByMood = (mood: string) => MENU.filter(p => p.mood === mood && p.category !== 'Quick Bites');
export const getPopularCombos = () => {{
  return MENU.filter(p => p.pairings.length > 0).slice(0, 4);
}};
"""

with open('frontend/src/data/menu.ts', 'w', encoding='utf-8') as f:
    f.write(menu_ts_content)

print("menu.ts updated.")

# Replace $ with ₹ in the TSX files
import glob
files_to_check = glob.glob('frontend/src/**/*.tsx', recursive=True)

for file in files_to_check:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple replacement for typical price display
    new_content = content.replace('+$', '+₹').replace('$', '₹')
    
    # Fix the ProductBuilder 'basePrice' calculation to use `largePriceAddOn`
    if 'ProductBuilder.tsx' in file:
        new_content = re.sub(
            r"const basePrice = size === 'Large' \? product\.price \+ [0-9.]+ : product\.price;",
            r"const basePrice = size === 'Large' ? product.price + (product.largePriceAddOn || 69) : product.price;",
            new_content
        )
        
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated currency in {file}")

