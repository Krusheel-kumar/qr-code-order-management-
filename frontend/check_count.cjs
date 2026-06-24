const http = require('http');
http.get('http://localhost:8080/api/menu/admin/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      console.log('Total products:', prods.length);
      const auth = prods.filter(p => p.id === 'p-authentic-milk-tea' || p.name === 'Authentic Milk Tea');
      console.log('Authentic Milk Teas:', auth.length);
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', e => console.error('Server down?', e.message));
