const http = require('http');
http.get('http://localhost:8080/api/menu/admin/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      console.log('Total products:', prods.length);
      const featured = prods.filter(p => p.isFeatured || p.featured).map(p => p.name);
      const best = prods.filter(p => p.isBestseller || p.bestseller).map(p => p.name);
      console.log('Featured:', featured);
      console.log('Bestsellers:', best);
    } catch (e) {
      console.error(e);
    }
  });
});
