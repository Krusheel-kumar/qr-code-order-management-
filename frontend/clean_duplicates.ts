import axios from 'axios';
import { MENU } from './src/data/menu.js';

const API_BASE = 'https://qr-code-order-management-production.up.railway.app/api';

const cleanDuplicates = async () => {
  try {
    console.log('Fetching all products from DB...');
    const { data: dbProducts } = await axios.get(`${API_BASE}/menu/admin/products`);
    
    console.log(`Found ${dbProducts.length} products total.`);
    
    // Valid IDs from our code
    const validIds = new Set(MENU.map(p => p.id));
    
    let deleted = 0;
    for (const dbProduct of dbProducts) {
      if (!validIds.has(dbProduct.id)) {
        console.log(`Deleting unauthorized/duplicate item: ${dbProduct.name} (${dbProduct.id})`);
        await axios.delete(`${API_BASE}/menu/products/${dbProduct.id}`);
        deleted++;
      }
    }
    
    console.log(`Cleaned up ${deleted} items. DONE!`);
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

cleanDuplicates();
