const http = require('http');

http.get('http://localhost:8080/api/menu/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      console.log('Total products returned to customer:', prods.length);
      console.log('Sample IDs:', prods.map(p => p.id).slice(0, 5).join(', '));
      const auth = prods.find(p => p.id === 'p-authentic-milk-tea');
      if (auth) console.log('Authentic Milk Tea is PRESENT (isAvailable=' + auth.isAvailable + ')');
      else console.log('Authentic Milk Tea is NOT returned.');
    } catch (e) {
      console.error('Error parsing', e);
    }
  });
});

http.get('http://localhost:8080/api/menu/admin/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      console.log('Total products in admin:', prods.length);
      const auth = prods.find(p => p.id === 'p-authentic-milk-tea');
      if (auth) console.log('Admin Authentic Milk Tea: isAvailable=' + auth.isAvailable);
    } catch (e) {
      console.error('Error parsing admin', e);
    }
  });
});
