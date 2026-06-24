const axios = require('axios');

async function wipeAndSeed() {
  const products = await axios.get('http://localhost:8080/api/menu/admin/products');
  console.log(`Found ${products.data.length} products. Deleting all...`);
  
  for (const p of products.data) {
    try {
      await axios.delete(`http://localhost:8080/api/menu/products/${p.id}`);
    } catch (e) {
      console.log('Failed to delete', p.id);
    }
  }
  console.log('Done wiping.');
}
wipeAndSeed();
