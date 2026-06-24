const http = require('http');

http.get('http://127.0.0.1:8080/api/menu/products', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Array length:', data.length);
      if (data.length > 0) {
        console.log('First item keys:', Object.keys(data[0]));
        console.log('isFeatured:', data[0].isFeatured);
        console.log('isBestseller:', data[0].isBestseller);
        console.log('bestseller:', data[0].bestseller);
      }
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
    process.exit(0);
  });
}).on('error', e => {
  console.error('HTTP Error:', e.message);
  process.exit(1);
});
