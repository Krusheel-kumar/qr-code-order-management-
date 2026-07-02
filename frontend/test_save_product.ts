import axios from 'axios';

const API_BASE = 'https://qr-code-order-management-production.up.railway.app/api';

const testSave = async () => {
  try {
    const product = {
      id: `p-test-${Date.now()}`,
      name: 'Test Product',
      price: 199,
      imageUrl: 'test.jpg',
      story: 'Test Story',
      category: {
        id: 'milk-teas',
        name: 'Milk Teas'
      }
    };
    console.log('Sending:', product);
    const { data } = await axios.post(`${API_BASE}/menu/products`, product);
    console.log('Success:', data);
  } catch (error: any) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Msg:', error.message);
  }
};

testSave();
