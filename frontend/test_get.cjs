const http = require('http');
http.get('http://localhost:8080/api/menu/admin/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      console.log('Keys of first product:');
      console.log(Object.keys(prods[0]));
      const p = prods.find(p => p.name === 'Taro Milk Tea');
      console.log('Taro Milk Tea:', p);
    } catch (e) {
      console.error(e);
    }
  });
});
