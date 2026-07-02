import axios from 'axios';
import { MENU } from './src/data/menu.js'; 

async function fixImages() {
  try {
    const { data: dbProducts } = await axios.get('https://qr-code-order-management-production.up.railway.app/api/menu/admin/products');
    console.log(`Found ${dbProducts.length} products in DB.`);

    let updatedCount = 0;
    for (const p of dbProducts) {
      if (!p.image || p.image.trim() === '') {
        // Find matching item in menu.ts by name (case-insensitive)
        const match = MENU.find(m => m.name.toLowerCase() === p.name.toLowerCase());
        if (match && match.image) {
          console.log(`Updating ${p.name} with image ${match.image}`);
          await axios.post('https://qr-code-order-management-production.up.railway.app/api/menu/products', {
            ...p,
            image: match.image
          });
          updatedCount++;
        }
      }
    }
    console.log(`Successfully updated images for ${updatedCount} products.`);
  } catch (error) {
    console.error('Error fixing images:', error.response?.data || error.message);
  }
}

fixImages();
