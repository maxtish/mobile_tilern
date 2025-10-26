// app/api/client.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.example.com',
});

api.interceptors.response.use(
  res => res,
  err => {
    console.error('API error:', err.response?.status, err.response?.data);
    return Promise.reject(err);
  },
);
