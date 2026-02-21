// src/components/Sidebar.jsx
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Newspaper, BookOpen, ShoppingBag,
  Tag, LogOut, Heart
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/articles',     icon: Newspaper,       label: 'Actualités'   },
  { to: '/publications', icon: BookOpen,         label: 'Publications' },
  { to: '/boutique',     icon: ShoppingBag,      label: 'Boutique'     },
  { to: '/categories',   icon: Tag,              label: 'Catégories'   },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-surface-900 border-r border-surface-200/10 flex flex-col z-40">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-surface-200/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">MBJ Admin</p>
            <p className="text-xs text-slate-500 leading-tight">Backoffice</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to)

          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-800'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
              {label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-surface-200/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-semibold text-white truncate">{user?.username}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}