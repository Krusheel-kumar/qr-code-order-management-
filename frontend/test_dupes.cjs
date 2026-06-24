const http = require('http');

http.get('http://localhost:8080/api/menu/admin/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const products = JSON.parse(data);
    const idCount = {};
    products.forEach(p => {
      idCount[p.id] = (idCount[p.id] || 0) + 1;
    });
    
    let dupes = false;
    for (const [id, count] of Object.entries(idCount)) {
      if (count > 1) {
        console.log(`DUPLICATE FOUND: ${id} x${count}`);
        dupes = true;
      }
    }
    if (!dupes) console.log("No duplicates found. Total unique IDs:", Object.keys(idCount).length);
  });
});
