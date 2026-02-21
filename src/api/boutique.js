// src/api/boutique.js
import client from './client'

export const getBoutiqueItems = (params) =>
  client.get('/api/boutique/admin/all', { params }).then(r => r.data)

export const getBoutiqueItem = (id) =>
  client.get(`/api/boutique/admin/${id}`).then(r => r.data)

export const createBoutiqueItem = (data) =>
  client.post('/api/boutique', data).then(r => r.data)

export const updateBoutiqueItem = (id, data) =>
  client.put(`/api/boutique/${id}`, data).then(r => r.data)

export const deleteBoutiqueItem = (id) =>
  client.delete(`/api/boutique/${id}`)