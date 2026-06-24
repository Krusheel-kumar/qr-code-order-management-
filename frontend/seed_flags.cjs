const http = require('http');

http.get('http://localhost:8080/api/menu/admin/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      console.log('Total products:', prods.length);
      
      if (prods.length === 0) return;

      // Assign flags to the first few products
      const toUpdate = [];
      if (prods[0]) toUpdate.push({ ...prods[0], isFeatured: true, isBestseller: true });
      if (prods[1]) toUpdate.push({ ...prods[1], isBestseller: true });
      if (prods[2]) toUpdate.push({ ...prods[2], isBestseller: true, isNewLaunch: true });
      if (prods[3]) toUpdate.push({ ...prods[3], isBestseller: true });
      if (prods[4]) toUpdate.push({ ...prods[4], isBestseller: true });
      if (prods[5]) toUpdate.push({ ...prods[5], isNewLaunch: true });
      if (prods[6]) toUpdate.push({ ...prods[6], isNewLaunch: true });

      const updateNext = (index) => {
        if (index >= toUpdate.length) {
          console.log('Done seeding flags!');
          return;
        }
        const p = toUpdate[index];
        const payload = JSON.stringify(p);
        
        const req = http.request(`http://localhost:8080/api/menu/products`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        }, (r) => {
          r.on('data', () => {});
          r.on('end', () => {
            console.log(`Updated flags for: ${p.name} (${index + 1}/${toUpdate.length})`);
            updateNext(index + 1);
          });
        });
        req.on('error', (e) => console.log('Error updating', p.id, e.message));
        req.write(payload);
        req.end();
      };
      
      updateNext(0);
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', e => console.error('Server down?', e.message));
