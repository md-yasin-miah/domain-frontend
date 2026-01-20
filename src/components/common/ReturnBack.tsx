import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export const ReturnBack = ({ label = 'Back' }: { label?: string }) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      type="button"
        >
          <ArrowLeft className="w-4 h-4" />
          {label}
        </button>
  )
}
