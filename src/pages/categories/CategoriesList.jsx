// src/pages/categories/CategoriesList.jsx
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PlusCircle, Pencil, Trash2, Check, X, RefreshCw } from 'lucide-react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories'
import Header from '../../components/Header'
import ConfirmModal from '../../components/ConfirmModal'

const TYPE_LABELS = {
  article:     { label: 'Actualités',   color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  publication: { label: 'Publications', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  boutique:    { label: 'Boutique',     color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}

export default function CategoriesList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [toDelete, setToDelete]     = useState(null)
  const [deleting, setDeleting]     = useState(false)
  const [editingId, setEditingId]   = useState(null)
  const [editName, setEditName]     = useState('')
  const [saving, setSaving]         = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', content_type: 'article' }
  })

  const load = async () => {
    setLoading(true)
    try {
      setCategories(await getCategories())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onCreate = async (data) => {
    setSaving(true)
    try {
      await createCategory(data)
      reset()
      load()
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (cat) => {
    setEditingId(cat.id)
    setEditName(cat.name)
  }

  const saveEdit = async (cat) => {
    if (!editName.trim()) return
    setSaving(true)
    try {
      await updateCategory(cat.id, { name: editName.trim() })
      setEditingId(null)
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteCategory(toDelete.id)
      setToDelete(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  // Grouper par type
  const grouped = { article: [], publication: [], boutique: [] }
  categories.forEach(cat => {
    if (grouped[cat.content_type]) grouped[cat.content_type].push(cat)
  })

  return (
    <div className="animate-fade-in">
      <Header
        title="Catégories"
        subtitle={`${categories.length} catégorie(s) au total`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire création */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <h2 className="text-sm font-semibold text-white mb-5">Nouvelle catégorie</h2>
            <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
              <div>
                <label className="label">Nom <span className="text-red-400">*</span></label>
                <input
                  {...register('name', { required: 'Le nom est obligatoire' })}
                  placeholder="Nom de la catégorie..."
                  className="input"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label">Rubrique <span className="text-red-400">*</span></label>
                <select {...register('content_type')} className="input">
                  <option value="article">Actualités</option>
                  <option value="publication">Publications</option>
                  <option value="boutique">Boutique</option>
                </select>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
                {saving
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <PlusCircle className="w-4 h-4" />
                }
                Ajouter
              </button>
            </form>
          </div>
        </div>

        {/* Liste groupée */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="card flex items-center justify-center py-20">
              <RefreshCw className="w-6 h-6 text-slate-500 animate-spin" />
            </div>
          ) : (
            Object.entries(grouped).map(([type, cats]) => {
              const { label, color } = TYPE_LABELS[type]
              return (
                <div key={type} className="card overflow-hidden">
                  <div className="px-5 py-4 border-b border-surface-200/10 flex items-center justify-between">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${color}`}>
                      {label}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{cats.length} catégorie(s)</span>
                  </div>

                  {cats.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-slate-600">
                      Aucune catégorie pour cette rubrique
                    </div>
                  ) : (
                    <ul className="divide-y divide-surface-200/10">
                      {cats.map((cat) => (
                        <li key={cat.id} className="px-5 py-3 flex items-center gap-3 group hover:bg-surface-800/50 transition-colors">
                          {editingId === cat.id ? (
                            <>
                              <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(cat)}
                                className="input py-1.5 text-sm flex-1"
                                autoFocus
                              />
                              <button
                                onClick={() => saveEdit(cat)}
                                disabled={saving}
                                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-all"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-surface-700 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-sm text-slate-300 flex-1">{cat.name}</span>
                              <span className="text-xs text-slate-600 font-mono hidden group-hover:inline">{cat.slug}</span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEdit(cat)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-all"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setToDelete(cat)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!toDelete}
        title="Supprimer la catégorie"
        message={`Voulez-vous vraiment supprimer "${toDelete?.name}" ? Les contenus associés seront conservés sans catégorie.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}