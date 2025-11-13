import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://127.0.0.1:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export default api;