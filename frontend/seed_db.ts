import axios from 'axios';
import { MENU, CATEGORIES } from './src/data/menu.js'; // Note: Node might not like .ts imports directly without tsx

// This script expects to be run with tsx or esbuild-register
async function seed() {
  console.log('Seeding categories...');
  for (const cat of CATEGORIES) {
    try {
      await axios.post('http://localhost:8080/api/menu/categories', {
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        name: cat,
        description: cat + ' Category'
      });
    } catch(e) { console.error('Failed category', cat); }
  }

  console.log('Seeding products...');
  for (const item of MENU) {
    try {
      const payload = {
        ...item,
        isAvailable: true,
        category: { id: item.category.toLowerCase().replace(/\s+/g, '-') }
      };
      await axios.post('http://localhost:8080/api/menu/products', payload);
      console.log('Saved', item.name);
    } catch(e) { 
      console.error('Failed product', item.name, e.response?.data || e.message); 
    }
  }
  console.log('Done!');
}

seed();
