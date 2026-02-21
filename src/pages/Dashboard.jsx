// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Newspaper, BookOpen, ShoppingBag, Tag, PlusCircle, TrendingUp } from 'lucide-react'
import { getArticles } from '../api/articles'
import { getPublications } from '../api/publications'
import { getBoutiqueItems } from '../api/boutique'
import { getCategories } from '../api/categories'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

const StatCard = ({ icon: Icon, label, value, sublabel, color, to }) => (
  <Link to={to} className="card p-6 hover:border-surface-200/20 transition-all duration-200 group block">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <TrendingUp className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value ?? '—'}</p>
    <p className="text-sm font-semibold text-slate-300">{label}</p>
    {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
  </Link>
)

const QuickAction = ({ icon: Icon, label, to, color }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-4 card hover:border-surface-200/20 transition-all duration-200 group"
  >
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
      {label}
    </span>
    <PlusCircle className="w-4 h-4 text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" />
  </Link>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    articles: null, articlesDraft: null,
    publications: null,
    boutique: null, boutiqueOutOfStock: null,
    categories: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [art, pub, bou, cats] = await Promise.all([
          getArticles({ per_page: 1 }),
          getPublications({ per_page: 1 }),
          getBoutiqueItems({ per_page: 100 }),
          getCategories(),
        ])
        const artDraft = await getArticles({ per_page: 1, status: 'draft' })
        setStats({
          articles:           art.total,
          articlesDraft:      artDraft.total,
          publications:       pub.total,
          boutique:           bou.total,
          boutiqueOutOfStock: bou.items.filter(i => !i.in_stock).length,
          categories:         cats.length,
        })
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div className="animate-fade-in">
      <Header
        title={`${greeting}, ${user?.username} 👋`}
        subtitle="Voici un aperçu de votre contenu"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Newspaper}
          label="Actualités"
          value={loading ? null : stats.articles}
          sublabel={stats.articlesDraft ? `${stats.articlesDraft} brouillon(s)` : 'Tout publié'}
          color="bg-blue-500/10 text-blue-400"
          to="/articles"
        />
        <StatCard
          icon={BookOpen}
          label="Publications"
          value={loading ? null : stats.publications}
          sublabel="articles officiels"
          color="bg-purple-500/10 text-purple-400"
          to="/publications"
        />
        <StatCard
          icon={ShoppingBag}
          label="Produits boutique"
          value={loading ? null : stats.boutique}
          sublabel={stats.boutiqueOutOfStock ? `${stats.boutiqueOutOfStock} épuisé(s)` : 'Tout en stock'}
          color="bg-emerald-500/10 text-emerald-400"
          to="/boutique"
        />
        <StatCard
          icon={Tag}
          label="Catégories"
          value={loading ? null : stats.categories}
          sublabel="toutes rubriques"
          color="bg-amber-500/10 text-amber-400"
          to="/categories"
        />
      </div>

      {/* Actions rapides */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction icon={Newspaper}  label="Nouvel article"     to="/articles/new"     color="bg-blue-500/10 text-blue-400" />
          <QuickAction icon={BookOpen}   label="Nouvelle publication" to="/publications/new" color="bg-purple-500/10 text-purple-400" />
          <QuickAction icon={ShoppingBag} label="Nouveau produit"   to="/boutique/new"     color="bg-emerald-500/10 text-emerald-400" />
        </div>
      </div>
    </div>
  )
}