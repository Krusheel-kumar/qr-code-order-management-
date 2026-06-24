const axios = require('axios');

async function test() {
  const products = await axios.get('http://localhost:8080/api/menu/admin/products');
  console.log('Total products:', products.data.length);
  
  if (products.data.length > 0) {
    const p = products.data[0];
    console.log('Testing product:', p.name, 'isAvailable:', p.isAvailable);
    
    // Toggle
    p.isAvailable = false;
    await axios.post('http://localhost:8080/api/menu/products', p);
    
    const productsAfter = await axios.get('http://localhost:8080/api/menu/admin/products');
    const pAfter = productsAfter.data.find(x => x.id === p.id);
    console.log('After update:', pAfter.name, 'isAvailable:', pAfter.isAvailable);
    
    const availableProducts = await axios.get('http://localhost:8080/api/menu/products');
    console.log('Total available products:', availableProducts.data.length);
  }
}
test();
