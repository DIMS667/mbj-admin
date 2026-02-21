// src/api/upload.js
import client from './client'

export const uploadImage = async (file) => {
  const form = new FormData()
  form.append('file', file)
  const { data } = await client.post('/api/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data // { url, filename }
}