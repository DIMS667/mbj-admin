// src/pages/articles/ArticleForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { createArticle, updateArticle, getArticle } from '../../api/articles'
import { getCategories } from '../../api/categories'
import Header from '../../components/Header'
import RichEditor from '../../components/RichEditor'
import ImageUpload from '../../components/ImageUpload'

export default function ArticleForm() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const isEdit    = Boolean(id)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { title: '', excerpt: '', status: 'draft', category_id: '' }
  })

  const [content, setContent]         = useState('')
  const [imageUrl, setImageUrl]       = useState('')
  const [categories, setCategories]   = useState([])
  const [loading, setLoading]         = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [error, setError]             = useState(null)

  useEffect(() => {
    getCategories('article').then(setCategories)

    if (isEdit) {
      getArticle(Number(id))
        .then((article) => {
          setValue('title', article.title)
          setValue('excerpt', article.excerpt || '')
          setValue('status', article.status)
          setValue('category_id', article.category_id || '')
          setContent(article.content || '')
          setImageUrl(article.image_url || '')
        })
        .catch(() => navigate('/articles'))
        .finally(() => setLoadingData(false))
    }
  }, [id])

  const onSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...formData,
        content,
        image_url: imageUrl || null,
        category_id: formData.category_id ? Number(formData.category_id) : null,
      }
      if (isEdit) {
        await updateArticle(Number(id), payload)
      } else {
        await createArticle(payload)
      }
      navigate('/articles')
    } catch (err) {
      setError(err.response?.data?.detail || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentStatus = watch('status')

  return (
    <div className="animate-fade-in">
      <Header
        title={isEdit ? "Modifier l'article" : 'Nouvel article'}
        subtitle={isEdit ? 'Édition en cours' : 'Créer un nouvel article'}
        actions={
          <button onClick={() => navigate('/articles')} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 space-y-4">
              <div>
                <label className="label">Titre <span className="text-red-400">*</span></label>
                <input
                  {...register('title', { required: 'Le titre est obligatoire' })}
                  placeholder="Titre de l'article..."
                  className="input text-lg font-semibold"
                />
                {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="label">Résumé</label>
                <textarea
                  {...register('excerpt')}
                  placeholder="Courte description affichée dans les listes..."
                  rows={3}
                  className="input resize-none"
                />
              </div>
            </div>
            <div className="card p-6">
              <label className="label mb-4">Contenu</label>
              <RichEditor value={content} onChange={setContent} placeholder="Rédigez le contenu..." />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Publication</h3>
              <div className="space-y-4">
                <div
                  onClick={() => setValue('status', currentStatus === 'published' ? 'draft' : 'published')}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                    currentStatus === 'published'
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{ backgroundColor: currentStatus !== 'published' ? '#1e293b' : undefined }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    currentStatus === 'published' ? 'bg-emerald-500/20' : ''
                  }`} style={{ backgroundColor: currentStatus !== 'published' ? '#0f172a' : undefined }}>
                    {currentStatus === 'published'
                      ? <Eye className="w-4 h-4 text-emerald-400" />
                      : <EyeOff className="w-4 h-4 text-slate-500" />
                    }
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${currentStatus === 'published' ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {currentStatus === 'published' ? 'Publié' : 'Brouillon'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {currentStatus === 'published' ? 'Visible sur le site' : 'Non visible'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="label">Catégorie</label>
                  <select {...register('category_id')} className="input">
                    <option value="">Sans catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Image à la une</h3>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-400" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}