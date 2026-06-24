async function run() {
  const res = await fetch('http://localhost:8080/api/menu/categories');
  const data = await res.json();
  console.log(data);
}
run();
