import { ArrowDown, CalendarDays, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JungleCorner, Pattern } from './BrandArt'

export function BrandHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F2E9D3] px-5 pb-16 pt-28 text-center">
      <Pattern className="text-[#181410] opacity-[0.035]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.5),transparent_55%)]" />
      <JungleCorner className="hero-leaf -left-12 sm:left-0" />
      <JungleCorner side="right" className="hero-leaf -right-12 sm:right-0" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="poster-reveal mb-7 inline-flex items-center gap-2 rounded-full bg-[#2E6B4F] px-5 py-2 text-xs font-black uppercase tracking-[.16em] text-white shadow-lg sm:text-sm">
          <CalendarDays className="size-4" /> 04 & 05 Julho · <MapPin className="size-4" /> São
          Thomé das Letras – MG
        </div>
        <h1 className="font-display uppercase leading-[.76] tracking-[-.075em]">
          <span className="poster-reveal block text-[clamp(4rem,13vw,10rem)]">Puma Punku</span>
          <span className="poster-reveal block pt-4 text-[clamp(2.5rem,7vw,5.5rem)] text-[#E8622C]">
            Festival 2026
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base font-medium leading-7 text-[#5f574c] sm:text-lg">
          Dois dias entre montanhas, música e mistério. Atravesse o portal para uma experiência que
          pulsa além da pista.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="h-14 rounded-full bg-[#E8622C] px-8 font-bold uppercase tracking-wider hover:scale-[1.03] hover:bg-[#C94F1E]"
          >
            <a href="#contato">Garantir meu lugar</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-14 rounded-full border-2 border-[#181410] bg-transparent px-8 font-bold uppercase tracking-wider hover:bg-[#181410] hover:text-[#F2E9D3]"
          >
            <a href="#edicoes">Ver edições passadas</a>
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
