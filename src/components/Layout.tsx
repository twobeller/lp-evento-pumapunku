import { useEffect, useState, type ReactNode } from 'react'
import { Instagram, Menu, MessageCircle, Ticket, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { listLinks } from '@/services/festival'
import type { FestivalLink } from '@/types/festival'
import { useSiteContent } from '@/contexts/SiteContentContext'
import { Pattern } from './BrandArt'

const nav = [
  ['O Festival', 'festival'],
  ['Edições', 'edicoes'],
  ['Galeria', 'galeria'],
  ['Contato', 'contato'],
]

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [links, setLinks] = useState<FestivalLink[]>([])
  const location = useLocation()
  const { getText } = useSiteContent()

  const footerTagline = getText(
    'footer_tagline',
    'Música, natureza e ancestralidade em uma experiência além da pista.',
  )
  const footerDates = getText('footer_dates', '04 & 05 JULHO')
  const footerPlace = getText('footer_place', 'São Thomé das Letras · MG')
  const footerCopyright = getText(
    'footer_copyright',
    'Puma Punku Festival · 04 & 05 Julho 2026 · São Thomé das Letras – MG',
  )

  useEffect(() => {
    listLinks()
      .then(setLinks)
      .catch(() => undefined)
  }, [])
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])

  const go = (anchor: string) => (location.pathname === '/' ? `#${anchor}` : `/#${anchor}`)
  const whatsapp = links.find((link) => link.icon === 'whatsapp')
  return (
    <div className="min-h-screen bg-[#F2E9D3] text-[#181410]">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-[#181410]/10 bg-[#F2E9D3]/90 shadow-sm backdrop-blur-xl' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="font-display text-xl uppercase leading-[.8] tracking-[-.06em]">
            Puma
            <br />
            Punku
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map(([label, anchor]) => (
              <a
                key={anchor}
                href={go(anchor)}
                className="text-xs font-bold uppercase tracking-widest transition hover:text-[#E8622C]"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            {whatsapp && (
              <Button
                asChild
                size="icon"
                variant="outline"
                className="rounded-full border-[#181410]/30 bg-transparent"
              >
                <a href={whatsapp.url} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <MessageCircle />
                </a>
              </Button>
            )}
            <Button
              asChild
              className="rounded-full bg-[#E8622C] px-6 font-bold uppercase tracking-wider hover:bg-[#C94F1E]"
            >
              <a href={go('contato')}>Garantir ingresso</a>
            </Button>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full sm:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu />
          </Button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] animate-drawer bg-[#F2E9D3] p-6 sm:hidden">
          <Pattern className="text-[#181410] opacity-[0.04]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl uppercase leading-[.8]">
                Puma
                <br />
                Punku
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
              >
                <X />
              </Button>
            </div>
            <nav className="my-auto flex flex-col gap-7">
              {nav.map(([label, anchor], index) => (
                <a
                  key={anchor}
                  href={go(anchor)}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl uppercase"
                >
                  <span className="mr-3 text-base text-[#E8622C]">0{index + 1}</span>
                  {label}
                </a>
              ))}
            </nav>
            <Button
              asChild
              className="h-14 rounded-full bg-[#E8622C] text-base font-bold uppercase hover:bg-[#C94F1E]"
            >
              <a href={go('contato')} onClick={() => setOpen(false)}>
                Garantir meu lugar
              </a>
            </Button>
          </div>
        </div>
      )}

      <main>{children}</main>
      <footer className="relative overflow-hidden bg-[#12100D] px-5 py-16 text-[#F2E9D3]">
        <Pattern className="text-[#F2E9D3] opacity-[0.025]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-5xl uppercase leading-[.78] tracking-[-.07em]">
              Puma
              <br />
              Punku
            </div>
            <p className="mt-6 max-w-sm text-sm text-[#F2E9D3]/60">{footerTagline}</p>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#E8622C]">
              Nos encontramos
            </p>
            <p className="text-2xl font-bold">{footerDates}</p>
            <p className="mt-1 text-[#F2E9D3]/60">{footerPlace}</p>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#E8622C]">
              Siga a tribo
            </p>
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold hover:text-[#E8622C]"
                >
                  {link.icon === 'instagram' ? (
                    <Instagram className="size-4" />
                  ) : link.icon === 'ticket' ? (
                    <Ticket className="size-4" />
                  ) : (
                    <MessageCircle className="size-4" />
                  )}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="relative mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/45">
          {footerCopyright}
        </div>
      </footer>
    </div>
  )
}
