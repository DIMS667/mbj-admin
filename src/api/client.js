// src/api/client.js
import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
})

// Injecter le token JWT dans chaque requête
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('mbj_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Rediriger vers /login si le token expire
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mbj_token')
      localStorage.removeItem('mbj_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client