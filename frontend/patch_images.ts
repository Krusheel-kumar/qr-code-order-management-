import axios from 'axios';
import { MENU } from './src/data/menu.js';

const API_BASE = 'https://qr-code-order-management-production.up.railway.app/api';

const resolveCategory = (catStr: string) => {
  return { id: catStr.toLowerCase().replace(/\s+/g, '-'), name: catStr };
};

const patchImages = async () => {
  try {
    console.log('Patching product images...');
    for (const p of MENU) {
      const payload = {
        ...p,
        image: p.image, // Fix: explicitly map to 'image' for Spring Boot @JsonProperty("image")
        category: resolveCategory(p.category as string)
      };
      await axios.post(`${API_BASE}/menu/products`, payload);
      console.log(`Patched ${p.name}`);
    }
    console.log('DONE!');
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

patchImages();
