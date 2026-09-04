import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

type AuthContextValue = {
  authenticated: boolean
  loading: boolean
  name: string
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const remove = pb.authStore.onChange(() => setAuthenticated(pb.authStore.isValid), true)
    setLoading(false)
    return remove
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      authenticated,
      loading,
      name: (pb.authStore.record?.name as string) || 'Admin Puma Punku',
      login: async (email, password) => {
        await pb.collection('users').authWithPassword(email, password)
        setAuthenticated(true)
      },
      logout: () => {
        pb.authStore.clear()
        setAuthenticated(false)
      },
    }),
    [authenticated, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
