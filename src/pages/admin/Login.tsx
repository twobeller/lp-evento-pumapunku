import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Pattern } from '@/components/BrandArt'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLogin() {
  const { authenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  if (authenticated) return <Navigate to="/admin/relatorios" replace />

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate((location.state as { from?: string })?.from || '/admin/relatorios', {
        replace: true,
      })
    } catch {
      setError('E-mail ou senha incorretos. Confira os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#F2E9D3] p-5">
      <Pattern className="text-[#181410] opacity-[0.04]" />
      <div className="relative w-full max-w-md rounded-[2rem] border border-[#181410]/10 bg-[#F7F0DE] p-7 shadow-warm-lg sm:p-10">
        <div className="mb-8">
          <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-[#181410] text-[#F2E9D3]">
            <LockKeyhole />
          </div>
          <p className="eyebrow">Central da tribo</p>
          <h1 className="font-display text-4xl uppercase leading-none">Portal administrativo</h1>
          <p className="mt-3 text-sm text-[#6b6256]">
            Entre para cuidar das edições, mídias, links e relatórios.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pumapunku.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12"
                required
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0"
                onClick={() => setShow(!show)}
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {show ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>
          {error && (
            <p className="rounded-xl bg-[#D14328]/10 p-3 text-sm font-semibold text-[#D14328]">
              {error}
            </p>
          )}
          <Button
            className="h-12 w-full rounded-full bg-[#E8622C] font-bold uppercase tracking-wider hover:bg-[#C94F1E]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Entrando...
              </>
            ) : (
              'Entrar no painel'
            )}
          </Button>
        </form>
        <a
          href="/"
          className="mt-6 block text-center text-xs font-semibold text-[#6b6256] hover:text-[#E8622C]"
        >
          ← Voltar ao festival
        </a>
      </div>
    </main>
  )
}
