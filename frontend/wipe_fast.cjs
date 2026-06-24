const axios = require('axios');

async function wipeAndSeed() {
  const products = await axios.get('http://localhost:8080/api/menu/admin/products');
  console.log(`Found ${products.data.length} products. Deleting all...`);
  
  const chunks = [];
  for (let i = 0; i < products.data.length; i += 20) {
    chunks.push(products.data.slice(i, i + 20));
  }
  
  for (const chunk of chunks) {
    await Promise.all(chunk.map(p => axios.delete(`http://localhost:8080/api/menu/products/${p.id}`).catch(e => console.log('err', p.id))));
  }
  console.log('Done wiping.');
}
wipeAndSeed();
