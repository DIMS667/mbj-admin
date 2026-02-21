// src/pages/articles/ArticlesList.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Pencil, Trash2, Search, RefreshCw } from 'lucide-react'
import { getArticles, deleteArticle } from '../../api/articles'
import Header from '../../components/Header'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import Pagination from '../../components/Pagination'

export default function ArticlesList() {
  const [data, setData]         = useState({ items: [], total: 0, total_pages: 1 })
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getArticles({ page, per_page: 15, search: search || undefined })
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, search])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteArticle(toDelete.id)
      setToDelete(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div className="animate-fade-in">
      <Header
        title="Actualités"
        subtitle={`${data.total} article(s) au total`}
        actions={
          <Link to="/articles/new" className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            Nouvel article
          </Link>
        }
      />

      {/* Filtres */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-slate-500 animate-spin" />
          </div>
        ) : data.items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm">Aucun article trouvé</p>
            <Link to="/articles/new" className="btn-primary mt-4 inline-flex">
              <PlusCircle className="w-4 h-4" />
              Créer le premier article
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200/10">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Titre</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Catégorie</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Statut</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200/10">
              {data.items.map((article) => (
                <tr key={article.id} className="hover:bg-surface-800/50 transition-colors duration-150 group">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white line-clamp-1">{article.title}</p>
                    {article.excerpt && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{article.excerpt}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {article.category
                      ? <span className="text-xs text-slate-400 bg-surface-800 px-2.5 py-1 rounded-lg">{article.category.name}</span>
                      : <span className="text-xs text-slate-600">—</span>
                    }
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500 font-mono">{formatDate(article.published_at || article.created_at)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <Link
                        to={`/articles/${article.id}/edit`}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setToDelete(article)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />

      <ConfirmModal
        isOpen={!!toDelete}
        title="Supprimer l'article"
        message={`Voulez-vous vraiment supprimer "${toDelete?.title}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}