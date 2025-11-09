// Create a file: test-api.js and run: node test-api.js
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001';

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test menu endpoint
    const menuResponse = await axios.get(`${API_BASE_URL}/api/menu/items`);
    console.log('✅ Menu endpoint:', menuResponse.status);
    console.log('📦 Menu data:', menuResponse.data);
    
    // Test categories endpoint
    const categoriesResponse = await axios.get(`${API_BASE_URL}/api/menu/categories`);
    console.log('✅ Categories endpoint:', categoriesResponse.status);
    console.log('📋 Categories data:', categoriesResponse.data);
    
  } catch (error) {
    console.log('❌ API Test Failed:');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testAPI();