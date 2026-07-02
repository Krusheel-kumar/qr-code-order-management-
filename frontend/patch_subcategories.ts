import axios from 'axios';

const API_BASE = 'https://qr-code-order-management-production.up.railway.app/api';

const SUBCATEGORIES: Record<string, string[]> = {
  'Milk Teas': ['Classics', 'Fruit Series', 'Chocolate', 'Coffee', 'Signatures'],
  'Boba Iced Tea': ['Classic', 'Signature'],
  'Milk Shakes': ['All Time Milkshakes', 'Signature Milkshakes'],
  'Cold Coffees': ['All Time Cold Coffees', 'Signature Cold Coffees'],
  'Chillers': ['Lemonades', 'Virgin Mojitos']
};

const resolveCategory = (catStr: string) => {
  return { id: catStr.toLowerCase().replace(/\s+/g, '-'), name: catStr };
};

const patch = async () => {
  try {
    for (const [catName, subcategories] of Object.entries(SUBCATEGORIES)) {
      const cat = resolveCategory(catName);
      const payload = {
        id: cat.id,
        name: cat.name,
        description: '',
        subcategories: subcategories
      };
      
      console.log(`Patching ${catName}...`);
      await axios.post(`${API_BASE}/menu/categories`, payload);
    }
    console.log('DONE!');
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

patch();
