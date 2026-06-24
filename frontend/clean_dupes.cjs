const http = require('http');
const { MENU } = require('./src/data/menu.js');

const validIds = new Set(MENU.map(m => m.id));

http.get('http://localhost:8080/api/menu/admin/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(data);
      console.log('Total products:', prods.length);
      const invalidProds = prods.filter(p => !validIds.has(p.id));
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
            console.log(`Deleted ${p.id} (${index + 1}/${invalidProds.length})`);
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
