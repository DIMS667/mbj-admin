// src/api/categories.js
import client from './client'

export const getCategories = (type) =>
  client.get('/api/categories', { params: type ? { type } : {} }).then(r => r.data)

export const createCategory = (data) =>
  client.post('/api/categories', data).then(r => r.data)

export const updateCategory = (id, data) =>
  client.put(`/api/categories/${id}`, data).then(r => r.data)

export const deleteCategory = (id) =>
  client.delete(`/api/categories/${id}`)