import axios from 'axios';

const API_BASE = 'https://qr-code-order-management-production.up.railway.app/api';

const getCategories = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/menu/categories`);
    console.log(data);
  } catch (error: any) {
    console.error(error.message);
  }
};

getCategories();
