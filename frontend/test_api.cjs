const http = require('http');

http.get('http://localhost:8080/api/menu/admin/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const products = JSON.parse(data);
    const p = products[0];
    console.log(p.id, p.isAvailable);
  });
});
