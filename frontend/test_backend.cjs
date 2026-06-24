const http = require('http');

async function testBackend() {
  console.log('1. Fetching all products...');
  const getProducts = () => new Promise((resolve, reject) => {
    http.get('http://localhost:8080/api/menu/products', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) { reject(e); }
      });
    });
  });

  const products = await getProducts();
  if (!products || products.length === 0) {
    console.log('No products found or backend down.');
    return;
  }
  
  const product = products[0];
  console.log('Original product:', { id: product.id, name: product.name, isAvailable: product.isAvailable, isFeatured: product.isFeatured });
  
  console.log('2. Updating product...');
  const updatedProduct = { ...product, isAvailable: !product.isAvailable, isFeatured: !product.isFeatured };
  
  const postData = JSON.stringify(updatedProduct);
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/menu/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const updateProduct = () => new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  const updateRes = await updateProduct();
  console.log('Update response:', updateRes.substring(0, 200));
  
  console.log('3. Fetching products again...');
  const newProducts = await getProducts();
  const newProduct = newProducts.find(p => p.id === product.id);
  console.log('New product:', { id: newProduct.id, name: newProduct.name, isAvailable: newProduct.isAvailable, isFeatured: newProduct.isFeatured });
}

testBackend().catch(console.error);
