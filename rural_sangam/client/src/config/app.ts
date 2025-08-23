// client/src/config/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ruralsangam.com/api'  // Same domain, /api prefix
  : 'http://localhost:5000/api';   // Local server with /api

export const apiClient = {
  baseURL: API_BASE_URL,
  // Your API methods here
  get: (endpoint: string) => fetch(`${API_BASE_URL}${endpoint}`),
  post: (endpoint: string, data: any) => 
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include' // For cookies
    })
};