import { ArrowDown, CalendarDays, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JungleCorner, Pattern } from './BrandArt'

import { useSiteContent } from '@/contexts/SiteContentContext'

export function BrandHero() {
  const { getText, getImageUrl } = useSiteContent()

  const badge = getText('hero_badge', '04 & 05 Julho · São Thomé das Letras – MG')
  const title1 = getText('hero_title_line1', 'Puma Punku')
  const title2 = getText('hero_title_line2', 'Festival 2026')
  const subtitle = getText(
    'hero_subtitle',
    'Dois dias entre montanhas, música e mistério. Atravesse o portal para uma experiência que pulsa além da pista.',
  )
  const btn1Label = getText('hero_btn_primary_label', 'Garantir meu lugar')
  const btn1Url = getText('hero_btn_primary_url', '#contato')
  const btn2Label = getText('hero_btn_secondary_label', 'Ver edições passadas')
  const btn2Url = getText('hero_btn_secondary_url', '#edicoes')
  const banner = getImageUrl('hero_bg_banner')

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pb-16 pt-28 text-center"
      style={{
        backgroundColor: 'var(--color-site-bg, #F2E9D3)',
        color: 'var(--color-site-text, #181410)',
        backgroundImage: banner
          ? `linear-gradient(rgba(242, 233, 211, 0.88), rgba(242, 233, 211, 0.94)), url(${banner})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Pattern className="text-[#181410] opacity-[0.035]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.5),transparent_55%)]" />
      <JungleCorner className="hero-leaf -left-12 sm:left-0" />
      <JungleCorner side="right" className="hero-leaf -right-12 sm:right-0" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div
          className="poster-reveal mb-7 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black uppercase tracking-[.16em] text-white shadow-lg sm:text-sm"
          style={{ backgroundColor: 'var(--color-site-secondary, #2E6B4F)' }}
        >
          <CalendarDays className="size-4" />
          <span>{badge}</span>
        </div>
        <h1 className="font-display uppercase leading-[.76] tracking-[-.075em]">
          <span className="poster-reveal block text-[clamp(4rem,13vw,10rem)]">{title1}</span>
          <span
            className="poster-reveal block pt-4 text-[clamp(2.5rem,7vw,5.5rem)]"
            style={{ color: 'var(--color-site-primary, #E8622C)' }}
          >
            {title2}
          </span>
        </h1>
        <div
          className="rich-text-content mx-auto mt-8 max-w-xl text-base font-medium leading-7 text-[#5f574c] sm:text-lg"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="h-14 rounded-full px-8 font-bold uppercase tracking-wider text-white hover:scale-[1.03]"
            style={{ backgroundColor: 'var(--color-site-primary, #E8622C)' }}
          >
            <a href={btn1Url}>{btn1Label}</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-14 rounded-full border-2 border-current bg-transparent px-8 font-bold uppercase tracking-wider hover:bg-[#181410] hover:text-[#F2E9D3]"
          >
            <a href={btn2Url}>{btn2Label}</a>
          </Button>
        </div>
      </div>
      <a
        href="#festival"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 animate-bounce text-[#181410]"
        aria-label="Rolar para o festival"
      >
        <ArrowDown />
      </a>
    </section>
  )
}
