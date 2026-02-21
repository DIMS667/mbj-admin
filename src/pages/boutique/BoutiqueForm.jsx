// src/pages/boutique/BoutiqueForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Save, ArrowLeft, Eye, EyeOff, Star } from 'lucide-react'
import { createBoutiqueItem, updateBoutiqueItem, getBoutiqueItem } from '../../api/boutique'
import { getCategories } from '../../api/categories'
import Header from '../../components/Header'
import RichEditor from '../../components/RichEditor'
import ImageUpload from '../../components/ImageUpload'

export default function BoutiqueForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', description: '', price: '', status: 'draft', category_id: '', in_stock: true, featured: false }
  })

  const [content, setContent]         = useState('')
  const [imageUrl, setImageUrl]       = useState('')
  const [categories, setCategories]   = useState([])
  const [loading, setLoading]         = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [error, setError]             = useState(null)

  useEffect(() => {
    getCategories('boutique').then(setCategories)

    if (isEdit) {
      getBoutiqueItem(Number(id))
        .then((item) => {
          setValue('name', item.name)
          setValue('description', item.description || '')
          setValue('price', item.price)
          setValue('status', item.status)
          setValue('category_id', item.category_id || '')
          setValue('in_stock', item.in_stock)
          setValue('featured', item.featured)
          setContent(item.content || '')
          setImageUrl(item.image_url || '')
        })
        .catch(() => navigate('/boutique'))
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
        price: parseFloat(formData.price) || 0,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        in_stock: Boolean(formData.in_stock),
        featured: Boolean(formData.featured),
      }
      if (isEdit) {
        await updateBoutiqueItem(Number(id), payload)
      } else {
        await createBoutiqueItem(payload)
      }
      navigate('/boutique')
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

  const currentStatus   = watch('status')
  const currentStock    = watch('in_stock')
  const currentFeatured = watch('featured')

  return (
    <div className="animate-fade-in">
      <Header
        title={isEdit ? 'Modifier le produit' : 'Nouveau produit'}
        subtitle={isEdit ? 'Édition en cours' : 'Ajouter un produit à la boutique'}
        actions={
          <button onClick={() => navigate('/boutique')} className="btn-secondary">
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
                <label className="label">Nom du produit <span className="text-red-400">*</span></label>
                <input
                  {...register('name', { required: 'Le nom est obligatoire' })}
                  placeholder="Nom du produit..."
                  className="input text-lg font-semibold"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Description courte</label>
                <textarea {...register('description')} placeholder="Description affichée dans la liste..." rows={3} className="input resize-none" />
              </div>
            </div>
            <div className="card p-6">
              <label className="label mb-4">Description détaillée</label>
              <RichEditor value={content} onChange={setContent} placeholder="Description complète du produit..." />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Vente</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Prix (FCFA) <span className="text-red-400">*</span></label>
                  <input {...register('price', { required: 'Le prix est obligatoire' })} type="number" step="1" placeholder="10000" className="input font-mono" />
                  {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price.message}</p>}
                </div>

                {/* Statut */}
                <div
                  onClick={() => setValue('status', currentStatus === 'published' ? 'draft' : 'published')}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${currentStatus === 'published' ? 'bg-emerald-500/10 border-emerald-500/30' : 'border-white/10'}`}
                  style={{ backgroundColor: currentStatus !== 'published' ? '#1e293b' : undefined }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: currentStatus === 'published' ? 'rgba(16,185,129,0.2)' : '#0f172a' }}>
                    {currentStatus === 'published' ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${currentStatus === 'published' ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {currentStatus === 'published' ? 'Publié' : 'Brouillon'}
                    </p>
                    <p className="text-xs text-slate-500">{currentStatus === 'published' ? 'Visible sur le site' : 'Non visible'}</p>
                  </div>
                </div>

                {/* Stock */}
                <div
                  onClick={() => setValue('in_stock', !currentStock)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200`}
                  style={{
                    backgroundColor: currentStock ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)',
                    border: currentStock ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(239,68,68,0.3)'
                  }}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: currentStock ? '#60a5fa' : '#f87171' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: currentStock ? '#60a5fa' : '#f87171' }}>
                      {currentStock ? 'En stock' : 'Épuisé'}
                    </p>
                    <p className="text-xs text-slate-500">Cliquez pour changer</p>
                  </div>
                </div>

                {/* Mis en avant */}
                <div
                  onClick={() => setValue('featured', !currentFeatured)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200`}
                  style={{
                    backgroundColor: currentFeatured ? 'rgba(245,158,11,0.1)' : '#1e293b',
                    border: currentFeatured ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(226,232,240,0.1)'
                  }}
                >
                  <Star className="w-4 h-4 flex-shrink-0" style={{ color: currentFeatured ? '#fbbf24' : '#64748b', fill: currentFeatured ? '#fbbf24' : 'none' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: currentFeatured ? '#fbbf24' : '#94a3b8' }}>
                      {currentFeatured ? 'Mis en avant' : 'Produit standard'}
                    </p>
                    <p className="text-xs text-slate-500">Affiché en priorité</p>
                  </div>
                </div>

                <div>
                  <label className="label">Catégorie</label>
                  <select {...register('category_id')} className="input">
                    <option value="">Sans catégorie</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Photo du produit</h3>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-400"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Ajouter le produit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}