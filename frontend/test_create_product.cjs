async function run() {
  try {
    const res = await fetch('http://localhost:8080/api/menu/products', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: 'test-milk-tea-123',
        name: 'Test Milk Tea',
        price: 5.99,
        imageUrl: 'https://example.com/test.jpg',
        isAvailable: true,
        category: { id: 'milk-teas' }
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    const data = await res.json();
    console.log('Created product:', data);
  } catch (e) {
    console.error(e.message);
  }
}
run();
