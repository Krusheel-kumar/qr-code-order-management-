const http = require('http');
http.get('http://localhost:8080/api/menu/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      console.log('Total available products:', prods.length);
      if (prods.length > 0) {
        const sample = prods[0];
        console.log('Sample product keys:', Object.keys(sample));
        console.log('isFeatured:', sample.isFeatured);
        console.log('isBestseller:', sample.isBestseller);
      }
    } catch (e) {
      console.error('Failed to parse:', data.substring(0, 100));
    }
  });
}).on('error', e => console.error('Connection failed:', e.message));
