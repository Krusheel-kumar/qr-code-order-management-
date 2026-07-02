import axios from 'axios';

const API_BASE = 'https://qr-code-order-management-production.up.railway.app/api';

const check = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/menu/admin/products`);
    data.forEach((p: any) => console.log(`${p.id} | ${p.name} | ${p.price} | img: ${!!p.image}`));
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

check();
