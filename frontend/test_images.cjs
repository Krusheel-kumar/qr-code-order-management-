async function run() {
  try {
    const res = await fetch('http://localhost:8080/api/menu/products');
    const data = await res.json();
    console.log('Sample product:', data[0].name, { image: data[0].image, imageUrl: data[0].imageUrl });
  } catch (e) {
    console.error(e.message);
  }
}
run();
