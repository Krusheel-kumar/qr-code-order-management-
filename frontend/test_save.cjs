const http = require('http');

const req = http.request(`http://localhost:8080/api/menu/admin/products`, { method: 'GET' }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      const target = prods[0];
      if (!target) return console.log('No products found');
      
      console.log('Original product:', target.id, target.name, 'isBestseller:', target.isBestseller);
      
      const payload = JSON.stringify({ ...target, isBestseller: true, isFeatured: true });
      
      const postReq = http.request(`http://localhost:8080/api/menu/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (postRes) => {
        let postData = '';
        postRes.on('data', c => postData += c);
        postRes.on('end', () => {
          console.log('Save response:', postData);
        });
      });
      postReq.write(payload);
      postReq.end();
      
    } catch (e) {
      console.error(e);
    }
  });
});
req.on('error', e => console.log('Server down?', e.message));
req.end();
