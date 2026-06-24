const axios = require('axios');

const API_URL = 'https://popobob-backend-production.up.railway.app/api';

async function seedFlags() {
  try {
    const res = await axios.get(`${API_URL}/menu/products`);
    const prods = res.data;
    console.log('Total products:', prods.length);

    if (prods.length === 0) return;

    // Assign flags to the first few products
    const toUpdate = [];
    if (prods[0]) toUpdate.push({ ...prods[0], isFeatured: true, isBestseller: true });
    if (prods[1]) toUpdate.push({ ...prods[1], isBestseller: true });
    if (prods[2]) toUpdate.push({ ...prods[2], isBestseller: true, isNewLaunch: true });
    if (prods[3]) toUpdate.push({ ...prods[3], isBestseller: true });
    if (prods[4]) toUpdate.push({ ...prods[4], isBestseller: true });
    if (prods[5]) toUpdate.push({ ...prods[5], isNewLaunch: true });
    if (prods[6]) toUpdate.push({ ...prods[6], isNewLaunch: true });

    for (let i = 0; i < toUpdate.length; i++) {
      const p = toUpdate[i];
      try {
        await axios.post(`${API_URL}/menu/products`, p);
        console.log(`Updated flags for: ${p.name} (${i + 1}/${toUpdate.length})`);
      } catch (e) {
        console.log('Error updating', p.id, e.message);
      }
    }
    console.log('Done seeding flags!');
  } catch (e) {
    console.error('Failed to get products', e.message);
  }
}

seedFlags();
