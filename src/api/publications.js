// src/api/publications.js
import client from './client'

export const getPublications = (params) =>
  client.get('/api/publications/admin/all', { params }).then(r => r.data)

export const getPublication = (id) =>
  client.get(`/api/publications/admin/${id}`).then(r => r.data)

export const createPublication = (data) =>
  client.post('/api/publications', data).then(r => r.data)

export const updatePublication = (id, data) =>
  client.put(`/api/publications/${id}`, data).then(r => r.data)

export const deletePublication = (id) =>
  client.delete(`/api/publications/${id}`)