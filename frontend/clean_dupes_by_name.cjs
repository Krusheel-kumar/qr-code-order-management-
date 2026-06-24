const http = require('http');

http.get('http://localhost:8080/api/menu/admin/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      console.log('Total products:', prods.length);
      
      const seenNames = new Set();
      const invalidProds = [];
      
      for (const p of prods) {
        if (seenNames.has(p.name)) {
          invalidProds.push(p);
        } else {
          seenNames.add(p.name);
        }
      }
      
      console.log('Unique names:', seenNames.size);
      console.log('Invalid products to delete:', invalidProds.length);

      if (invalidProds.length === 0) {
        console.log('No duplicates to delete.');
        return;
      }
      
      const deleteNext = (index) => {
        if (index >= invalidProds.length) {
          console.log('Done deleting duplicates!');
          return;
        }
        const p = invalidProds[index];
        const req = http.request(`http://localhost:8080/api/menu/products/${p.id}`, { method: 'DELETE' }, (r) => {
          r.on('data', () => {});
          r.on('end', () => {
            console.log(`Deleted duplicate: ${p.name} (ID: ${p.id}) (${index + 1}/${invalidProds.length})`);
            deleteNext(index + 1);
          });
        });
        req.on('error', (e) => console.log('Error deleting', p.id, e.message));
        req.end();
      };
      
      deleteNext(0);
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', e => console.error('Server down?', e.message));
