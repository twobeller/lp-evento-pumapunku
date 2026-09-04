import type { ReactNode } from 'react'
import { BarChart3, ExternalLink, Images, Link2, LogOut, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const menu = [
  { to: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  { to: '/admin/edicoes', label: 'Edições', icon: Images },
  { to: '/admin/links', label: 'Links', icon: Link2 },
]

export function AdminShell({
  children,
  title,
  description,
  actions,
}: {
  children: ReactNode
  title: string
  description?: string
  actions?: ReactNode
}) {
  const { name, logout } = useAuth()
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#F6F0E2] text-[#181410]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#181410] p-5 text-[#F2E9D3] transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-2xl uppercase leading-[.8] tracking-[-.06em]">
            Puma
            <br />
            Punku
          </Link>
          <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </div>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[.3em] text-[#E8622C]">
          Central da tribo
        </p>
        <nav className="mt-12 space-y-2">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  isActive
                    ? 'bg-[#E8622C] text-white'
                    : 'text-white/65 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="truncate text-sm font-bold">{name}</p>
          <p className="text-xs text-white/45">Administrador</p>
          <div className="mt-4 flex gap-2">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="justify-start text-white/60 hover:bg-white/10 hover:text-white"
            >
              <Link to="/" target="_blank">
                <ExternalLink /> Ver site
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={logout}
              className="text-white/60 hover:bg-white/10 hover:text-white"
            >
              <LogOut /> Sair
            </Button>
          </div>
        </div>
      </aside>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar navegação"
        />
      )}
      <main className="min-h-screen lg:pl-72">
        <header className="border-b border-[#181410]/10 bg-[#F2E9D3]/80 px-5 py-5 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="lg:hidden"
                onClick={() => setOpen(true)}
              >
                <Menu />
              </Button>
              <div>
                <h1 className="font-display text-2xl uppercase sm:text-3xl">{title}</h1>
                {description && (
                  <p className="mt-1 text-xs text-[#6d6559] sm:text-sm">{description}</p>
                )}
              </div>
            </div>
            {actions}
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-5 md:p-8">{children}</div>
      </main>
    </div>
  )
}
