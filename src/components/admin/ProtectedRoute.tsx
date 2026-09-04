import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authenticated, loading } = useAuth()
  const location = useLocation()
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#F2E9D3] font-display text-2xl uppercase">
        Abrindo o portal...
      </div>
    )
  if (!authenticated)
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return children
}
