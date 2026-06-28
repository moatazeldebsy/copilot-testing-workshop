import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTestData = async () => {
  const response = await apiClient.get('/tests');
  return response.data;
};

export const submitTestRequest = async (testRequest: any) => {
  const response = await apiClient.post('/tests', testRequest);
  return response.data;
};

export default apiClient;