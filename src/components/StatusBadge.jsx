// src/components/StatusBadge.jsx
import { CheckCircle, Clock } from 'lucide-react'

export default function StatusBadge({ status }) {
  if (status === 'published') {
    return (
      <span className="badge-published">
        <CheckCircle className="w-3 h-3" />
        Publié
      </span>
    )
  }
  return (
    <span className="badge-draft">
      <Clock className="w-3 h-3" />
      Brouillon
    </span>
  )
}