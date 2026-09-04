import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Instagram,
  MapPin,
  MessageCircle,
  Music2,
  Sparkles,
  Ticket,
  Trees,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BrandHero } from '@/components/PublicSections'
import { LeadForm } from '@/components/LeadForm'
import { MediaGallery } from '@/components/MediaGallery'
import { MediaPlaceholder, Pattern, JungleCorner } from '@/components/BrandArt'
import Layout from '@/components/Layout'
import { getFileUrl, listEditions, listLinks, listMedia } from '@/services/festival'
import type { Edition, FestivalLink, FestivalMedia } from '@/types/festival'

export default function Index() {
  const [editions, setEditions] = useState<Edition[]>([])
  const [media, setMedia] = useState<FestivalMedia[]>([])
  const [links, setLinks] = useState<FestivalLink[]>([])

  useEffect(() => {
    Promise.all([listEditions(), listMedia(undefined, 12), listLinks()])
      .then(([editionData, mediaData, linkData]) => {
        setEditions(editionData)
        setMedia(mediaData)
        setLinks(linkData)
      })
      .catch(() => undefined)
  }, [])

  return (
    <Layout>
      <BrandHero />
      <div className="overflow-hidden bg-[#181410] py-4 text-[#F2E9D3]">
        <div className="marquee whitespace-nowrap font-bold uppercase tracking-[.15em]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              PUMA PUNKU FESTIVAL <b className="mx-5 text-[#E8622C]">✦</b> 04 & 05 JULHO 2026{' '}
              <b className="mx-5 text-[#C9962E]">✦</b> SÃO THOMÉ DAS LETRAS{' '}
              <b className="mx-5 text-[#2E6B4F]">✦</b>{' '}
            </span>
          ))}
        </div>
      </div>

      <section id="festival" className="section-shell bg-[#F2E9D3]">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="eyebrow">O festival</p>
            <h2 className="section-title">
              Onde a pista encontra o <span className="text-[#E8622C]">extraordinário.</span>
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5b544a]">
              No alto das montanhas de São Thomé, o Puma Punku abre um portal para dois dias de
              música eletrônica, arte, natureza e conexão. Uma celebração que nasce da terra,
              atravessa a madrugada e fica para sempre.
            </p>
            <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold">
              <span className="flex items-center gap-2">
                <Trees className="text-[#2E6B4F]" /> Imersão na natureza
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="text-[#E8622C]" /> Arte & ancestralidade
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {(
              [
                [24, 'horas de música', Music2],
                [3, 'palcos vivos', Trees],
                [4, 'edições realizadas', Sparkles],
              ] as const
            ).map(([number, label, Icon], i) => (
              <div
                key={String(label)}
                className="animate-germinar flex items-center gap-5 rounded-3xl border border-[#181410]/10 bg-[#EDE2C6] p-6 shadow-warm"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-[#181410] text-[#F2E9D3]">
                  <Icon />
                </span>
                <div>
                  <strong className="font-display text-4xl">
                    {String(number).padStart(2, '0')}
                  </strong>
                  <p className="text-sm text-[#686054]">{String(label)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="edicoes" className="section-shell bg-[#EDE2C6]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">Nossa história</p>
              <h2 className="section-title">Edições anteriores</h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm text-[#685f52] md:block">
              Cada edição, um novo portal.
              <br />
              Reviva os capítulos da nossa história.
            </p>
          </div>
          <div className="flex snap-x gap-5 overflow-x-auto pb-6 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {editions.map((edition, i) => (
              <Link
                key={edition.id}
                to={`/edicoes/${edition.id}`}
                className="group min-w-[82vw] snap-center overflow-hidden rounded-3xl bg-[#F2E9D3] shadow-warm transition duration-300 hover:-translate-y-2 hover:shadow-warm-lg sm:min-w-[45vw] lg:min-w-0"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  {edition.cover ? (
                    <img
                      src={getFileUrl(edition, edition.cover, '480x320')}
                      alt={`Capa ${edition.title}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <MediaPlaceholder year={edition.year} className="h-full" />
                  )}
                  <span className="absolute left-5 top-5 rounded-full bg-[#E8622C] px-4 py-1.5 text-xs font-black text-white">
                    {edition.year}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl uppercase">{edition.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#675f54]">
                    {edition.description}
                  </p>
                  <span className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#2E6B4F]">
                    Explorar edição{' '}
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="galeria" className="section-shell bg-[#181410] text-[#F2E9D3]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow text-[#E8622C]">Memórias da pista</p>
              <h2 className="section-title text-[#F2E9D3]">
                Você precisa <span className="text-[#C9962E]">sentir.</span>
              </h2>
            </div>
            {editions[0] && (
              <Button
                asChild
                variant="outline"
                className="hidden rounded-full border-[#F2E9D3]/40 bg-transparent text-[#F2E9D3] hover:bg-[#F2E9D3] md:flex"
              >
                <Link to={`/edicoes/${editions[0].id}`}>
                  Ver galeria completa <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
          <MediaGallery items={media} emptyYear={2026} limit={12} />
        </div>
      </section>

      <section
        id="contato"
        className="relative overflow-hidden bg-[#24523D] px-5 py-24 text-[#F2E9D3] lg:py-32"
      >
        <Pattern className="text-[#F2E9D3] opacity-[0.035]" />
        <JungleCorner className="hidden opacity-40 lg:block" />
        <JungleCorner side="right" className="hidden opacity-40 lg:block" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow text-[#C9962E]">Faça parte desde agora</p>
          <h2 className="font-display text-5xl uppercase leading-[.9] sm:text-7xl">
            Entre na tribo
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[#F2E9D3]/75">
            Receba primeiro o lineup, pré-venda exclusiva e condições especiais de ingresso.
          </p>
          <div className="mx-auto mt-10 max-w-xl rounded-3xl bg-[#F2E9D3] p-6 text-left text-[#181410] shadow-2xl sm:p-9">
            <LeadForm />
          </div>
        </div>
      </section>

      <section className="section-shell bg-[#F2E9D3]">
        <div className="mx-auto max-w-7xl text-center">
          <p className="eyebrow">Conecte-se</p>
          <h2 className="section-title">Siga os sinais</h2>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            {links.map((link) => (
              <Button
                key={link.id}
                asChild
                className={`h-14 rounded-full px-7 font-bold uppercase tracking-wider ${link.icon === 'instagram' ? 'bg-[#793d73] hover:bg-[#62315d]' : link.icon === 'ticket' ? 'bg-[#E8622C] hover:bg-[#C94F1E]' : 'bg-[#2E6B4F] hover:bg-[#24523D]'} ${link.highlight ? 'ring-4 ring-[#C9962E]/25' : ''}`}
              >
                <a
                  href={`${link.url}${link.url.includes('?') ? '&' : '?'}utm_source=lp`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.icon === 'instagram' ? (
                    <Instagram />
                  ) : link.icon === 'ticket' ? (
                    <Ticket />
                  ) : (
                    <MessageCircle />
                  )}
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-[#EDE2C6] p-8 md:flex-row md:items-center">
          <div className="flex gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-[#2E6B4F] text-white">
              <MapPin />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#E8622C]">O destino</p>
              <h3 className="font-display text-2xl uppercase">São Thomé das Letras · MG</h3>
              <p className="mt-1 text-sm text-[#675f54]">
                Montanhas, misticismo e uma vista inesquecível.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#181410] bg-transparent"
          >
            <a
              href="https://maps.google.com/?q=São+Thomé+das+Letras+MG"
              target="_blank"
              rel="noreferrer"
            >
              Abrir no Google Maps <ArrowRight />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  )
}
