// src/pages/boutique/BoutiqueList.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Pencil, Trash2, Search, RefreshCw, Package } from 'lucide-react'
import { getBoutiqueItems, deleteBoutiqueItem } from '../../api/boutique'
import Header from '../../components/Header'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import Pagination from '../../components/Pagination'

export default function BoutiqueList() {
  const [data, setData]         = useState({ items: [], total: 0, total_pages: 1 })
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getBoutiqueItems({ page, per_page: 15, search: search || undefined })
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, search])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteBoutiqueItem(toDelete.id)
      setToDelete(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  const formatPrice = (p) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(p)

  return (
    <div className="animate-fade-in">
      <Header
        title="Boutique"
        subtitle={`${data.total} produit(s) au total`}
        actions={
          <Link to="/boutique/new" className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            Nouveau produit
          </Link>
        }
      />

      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-slate-500 animate-spin" />
          </div>
        ) : data.items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm">Aucun produit trouvé</p>
            <Link to="/boutique/new" className="btn-primary mt-4 inline-flex">
              <PlusCircle className="w-4 h-4" />
              Créer le premier produit
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200/10">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Produit</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Prix</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Statut</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200/10">
              {data.items.map((item) => (
                <tr key={item.id} className="hover:bg-surface-800/50 transition-colors duration-150 group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL || ''}${item.image_url}`}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-surface-800"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-surface-800 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-slate-600" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                        {item.featured && (
                          <span className="text-xs text-amber-400 font-medium">⭐ Mis en avant</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm font-mono text-emerald-400">{formatPrice(item.price)}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      item.in_stock
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {item.in_stock ? 'En stock' : 'Épuisé'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <Link
                        to={`/boutique/${item.id}/edit`}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setToDelete(item)}
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
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer "${toDelete?.name}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}