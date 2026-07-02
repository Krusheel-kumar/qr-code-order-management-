import axios from 'axios';

const API_BASE = 'https://qr-code-order-management-production.up.railway.app/api';

const testFullFlow = async () => {
  try {
    // 1. Create a category like the frontend does
    const newCat = {
      id: 'test-category',
      name: 'Test Category',
      description: '',
      subcategories: []
    };
    console.log('Creating category:', newCat);
    await axios.post(`${API_BASE}/menu/categories`, newCat);

    // 2. Create a product like the frontend does
    const product = {
      id: `p-test-${Date.now()}`,
      name: 'Test Product',
      price: 199,
      imageUrl: '',
      story: '',
      category: {
        id: 'test-category',
        name: 'Test Category'
      }
    };
    console.log('Creating product:', product);
    const { data } = await axios.post(`${API_BASE}/menu/products`, product);
    console.log('Success:', data);
  } catch (error: any) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Msg:', error.message);
  }
};

testFullFlow();
