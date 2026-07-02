import axios from 'axios';
import { MENU } from './src/data/menu.js';
import { campaigns, stories } from './src/data/mockData.js';

const API_BASE = 'https://qr-code-order-management-production.up.railway.app/api';

const resolveCategory = (catStr: string) => {
  return { id: catStr.toLowerCase().replace(/\s+/g, '-'), name: catStr };
};

const seed = async () => {
  try {
    console.log('Fetching existing products...');
    const { data: existingProducts } = await axios.get(`${API_BASE}/menu/admin/products`);
    
    console.log(`Deleting ${existingProducts.length} existing products...`);
    for (const p of existingProducts) {
      try {
        await axios.delete(`${API_BASE}/menu/products/${p.id}`);
      } catch (err) {
        console.error(`Failed to delete product ${p.id}`);
      }
    }

    console.log('Fetching existing categories...');
    const { data: existingCategories } = await axios.get(`${API_BASE}/menu/categories`);
    
    console.log(`Deleting ${existingCategories.length} existing categories...`);
    for (const c of existingCategories) {
      try {
        await axios.delete(`${API_BASE}/menu/categories/${c.id}`);
      } catch (err) {
        console.error(`Failed to delete category ${c.id}`);
      }
    }

    console.log('Pushing categories...');
    const uniqueCategories = Array.from(new Set(MENU.map(m => m.category as string)));
    for (const catStr of uniqueCategories) {
      try {
        await axios.post(`${API_BASE}/menu/categories`, resolveCategory(catStr));
      } catch (err) {
        console.error(`Skipping category ${catStr}...`);
      }
    }

    console.log('Pushing products...');
    for (const p of MENU) {
      const payload = {
        ...p,
        imageUrl: p.image,
        category: resolveCategory(p.category as string)
      };
      await axios.post(`${API_BASE}/menu/products`, payload);
    }

    console.log('DONE!');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

seed();
