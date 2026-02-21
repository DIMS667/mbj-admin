// src/api/articles.js
import client from './client'

export const getArticles = (params) =>
  client.get('/api/articles/admin/all', { params }).then(r => r.data)

export const getArticle = (id) =>
  client.get(`/api/articles/admin/${id}`).then(r => r.data)

export const createArticle = (data) =>
  client.post('/api/articles', data).then(r => r.data)

export const updateArticle = (id, data) =>
  client.put(`/api/articles/${id}`, data).then(r => r.data)

export const deleteArticle = (id) =>
  client.delete(`/api/articles/${id}`)