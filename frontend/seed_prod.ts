import axios from 'axios';
import { MENU, CATEGORIES } from './src/data/menu.js';

const API_URL = 'https://qr-code-order-management-production.up.railway.app/api';

async function seed() {
  console.log('Fetching existing products...');
  try {
    const existing = await axios.get(`${API_URL}/menu/products`);
    console.log(`Found ${existing.data.length} existing products.`);
    // We could delete them, but since DataSeeder might have created them without flags, 
    // wiping them first might be safer to avoid duplicate IDs with different names or missing flags.
    // However, POSTing to /menu/products in Spring Data JPA with an existing ID will perform an UPSERT (update).
    // So we can just POST all items from MENU and they will overwrite existing ones with the same ID,
    // or create new ones!
  } catch (e) {
    console.error('Could not fetch existing:', e.message);
  }

  console.log('Seeding categories...');
  for (const cat of CATEGORIES) {
    try {
      await axios.post(`${API_URL}/menu/categories`, {
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
        imageUrl: item.image,
        isAvailable: true,
        category: { id: item.category.toLowerCase().replace(/\s+/g, '-') }
      };
      await axios.post(`${API_URL}/menu/products`, payload);
      console.log('Saved', item.name);
    } catch(e) { 
      console.error('Failed product', item.name, e.response?.data || e.message); 
    }
  }
  console.log('Done seeding production db!');
}

seed();
