// src/components/Header.jsx
export default function Header({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}