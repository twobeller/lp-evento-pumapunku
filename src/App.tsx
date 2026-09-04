import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import Index from '@/pages/Index'
import EditionPage from '@/pages/EditionPage'
import AdminLogin from '@/pages/admin/Login'
import Reports from '@/pages/admin/Reports'
import Editions from '@/pages/admin/Editions'
import MediaManager from '@/pages/admin/MediaManager'
import Links from '@/pages/admin/Links'
import NotFound from '@/pages/NotFound'

function Protected({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/edicoes/:id" element={<EditionPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/relatorios"
            element={
              <Protected>
                <Reports />
              </Protected>
            }
          />
          <Route
            path="/admin/edicoes"
            element={
              <Protected>
                <Editions />
              </Protected>
            }
          />
          <Route
            path="/admin/edicoes/:id/midias"
            element={
              <Protected>
                <MediaManager />
              </Protected>
            }
          />
          <Route
            path="/admin/links"
            element={
              <Protected>
                <Links />
              </Protected>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </BrowserRouter>
  )
}
