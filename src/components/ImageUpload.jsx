// src/components/ImageUpload.jsx
import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadImage } from '../api/upload'

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const apiBase = import.meta.env.VITE_API_URL || ''

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Fichier non supporté. Utilisez JPEG, PNG ou WEBP.')
      return
    }
    try {
      setUploading(true)
      setError(null)
      const { url } = await uploadImage(file)
      onChange(url)
    } catch (err) {
      setError("Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const imgSrc = value
    ? (value.startsWith('http') ? value : `${apiBase}${value}`)
    : null

  return (
    <div className="space-y-3">
      {imgSrc ? (
        <div className="relative group rounded-xl overflow-hidden border border-surface-200/10">
          <img src={imgSrc} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              <Upload className="w-3 h-3" />
              Changer
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="btn-danger text-xs px-3 py-1.5"
            >
              <X className="w-3 h-3" />
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-surface-200/20 hover:border-primary-500/40 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-12 h-12 bg-surface-800 rounded-xl flex items-center justify-center group-hover:bg-primary-600/20 transition-colors duration-200">
                <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-primary-400" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300">
                {uploading ? 'Upload en cours...' : 'Cliquez ou glissez une image'}
              </p>
              <p className="text-xs text-slate-600 mt-1">JPEG, PNG, WEBP — max 5 Mo</p>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}