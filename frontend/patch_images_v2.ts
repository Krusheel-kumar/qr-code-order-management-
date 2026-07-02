import axios from 'axios';
import { MENU } from './src/data/menu.js';

const API_BASE = 'https://qr-code-order-management-production.up.railway.app/api';

const patchImagesV2 = async () => {
  try {
    console.log('Fetching all products from DB...');
    const { data: dbProducts } = await axios.get(`${API_BASE}/menu/admin/products`);
    
    console.log(`Found ${dbProducts.length} products. Patching images...`);
    
    for (const dbProduct of dbProducts) {
      // Find the matching product in MENU by ID
      const localProduct = MENU.find(p => p.id === dbProduct.id);
      
      if (localProduct && localProduct.image) {
        // Update the image field
        const payload = {
          ...dbProduct,
          image: localProduct.image
        };
        
        await axios.post(`${API_BASE}/menu/products`, payload);
        console.log(`Patched image for ${dbProduct.name}`);
      }
    }
    
    console.log('DONE!');
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

patchImagesV2();
