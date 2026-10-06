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

import { useSiteContent } from '@/contexts/SiteContentContext'

export default function Index() {
  const [editions, setEditions] = useState<Edition[]>([])
  const [media, setMedia] = useState<FestivalMedia[]>([])
  const [links, setLinks] = useState<FestivalLink[]>([])
  const { getText, getImageUrl } = useSiteContent()

  useEffect(() => {
    Promise.all([listEditions(), listMedia(undefined, 12), listLinks()])
      .then(([editionData, mediaData, linkData]) => {
        setEditions(editionData)
        setMedia(mediaData)
        setLinks(linkData)
      })
      .catch(() => undefined)
  }, [])

  const marqueeText = getText(
    'marquee_text',
    'PUMA PUNKU FESTIVAL ✦ 04 & 05 JULHO 2026 ✦ SÃO THOMÉ DAS LETRAS ✦',
  )
  const festivalEyebrow = getText('festival_eyebrow', 'O festival')
  const festivalTitle = getText('festival_title', 'Onde a pista encontra o extraordinário.')
  const festivalDesc = getText(
    'festival_description',
    'No alto das montanhas de São Thomé, o Puma Punku abre um portal para dois dias de música eletrônica, arte, natureza e conexão. Uma celebração que nasce da terra, atravessa a madrugada e fica para sempre.',
  )
  const festivalPill1 = getText('festival_pill_1', 'Imersão na natureza')
  const festivalPill2 = getText('festival_pill_2', 'Arte & ancestralidade')
  const stat1Num = getText('festival_stat1_number', '24')
  const stat1Label = getText('festival_stat1_label', 'horas de música')
  const stat2Num = getText('festival_stat2_number', '03')
  const stat2Label = getText('festival_stat2_label', 'palcos vivos')
  const stat3Num = getText('festival_stat3_number', '04')
  const stat3Label = getText('festival_stat3_label', 'edições realizadas')

  const editionsEyebrow = getText('editions_eyebrow', 'Nossa história')
  const editionsTitle = getText('editions_title', 'Edições anteriores')
  const editionsSubtitle = getText(
    'editions_subtitle',
    'Cada edição, um novo portal.\nReviva os capítulos da nossa história.',
  )

  const galleryEyebrow = getText('gallery_eyebrow', 'Memórias da pista')
  const galleryTitle = getText('gallery_title', 'Você precisa sentir.')

  const triboEyebrow = getText('tribo_eyebrow', 'Faça parte desde agora')
  const triboTitle = getText('tribo_title', 'Entre na tribo')
  const triboDesc = getText(
    'tribo_description',
    'Receba primeiro o lineup, pré-venda exclusiva e condições especiais de ingresso.',
  )
  const triboBanner = getImageUrl('tribo_banner')

  const connectEyebrow = getText('connect_eyebrow', 'Conecte-se')
  const connectTitle = getText('connect_title', 'Siga os sinais')

  const locationEyebrow = getText('location_eyebrow', 'O destino')
  const locationTitle = getText('location_title', 'São Thomé das Letras · MG')
  const locationDesc = getText(
    'location_description',
    'Montanhas, misticismo e uma vista inesquecível.',
  )
  const locationMapsUrl = getText(
    'location_maps_url',
    'https://maps.google.com/?q=São+Thomé+das+Letras+MG',
  )
  const locationBtnLabel = getText('location_btn_label', 'Abrir no Google Maps')

  return (
    <Layout>
      <BrandHero />
      <div className="overflow-hidden bg-[#181410] py-4 text-[#F2E9D3]">
        <div className="marquee whitespace-nowrap font-bold uppercase tracking-[.15em]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="inline-flex items-center">
              <span>{marqueeText}</span>
              <b className="mx-5 text-[#E8622C]">✦</b>
            </span>
          ))}
        </div>
      </div>

      <section
        id="festival"
        className="section-shell"
        style={{ backgroundColor: 'var(--color-site-bg, #F2E9D3)' }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="eyebrow" style={{ color: 'var(--color-site-secondary, #2E6B4F)' }}>
              {festivalEyebrow}
            </p>
            <h2 className="section-title">{festivalTitle}</h2>
            <div
              className="rich-text-content mt-7 max-w-2xl text-lg leading-8 text-[#5b544a]"
              dangerouslySetInnerHTML={{ __html: festivalDesc }}
            />
            <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold">
              <span className="flex items-center gap-2">
                <Trees style={{ color: 'var(--color-site-secondary, #2E6B4F)' }} />
                <span>{festivalPill1}</span>
              </span>
              <span className="flex items-center gap-2">
                <Sparkles style={{ color: 'var(--color-site-primary, #E8622C)' }} />
                <span>{festivalPill2}</span>
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {(
              [
                [stat1Num, stat1Label, Music2],
                [stat2Num, stat2Label, Trees],
                [stat3Num, stat3Label, Sparkles],
              ] as const
            ).map(([number, label, Icon], i) => (
              <div
                key={String(label) + i}
                className="animate-germinar flex items-center gap-5 rounded-3xl border border-[#181410]/10 bg-[#EDE2C6] p-6 shadow-warm"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-[#181410] text-[#F2E9D3]">
                  <Icon />
                </span>
                <div>
                  <strong className="font-display text-4xl">{String(number)}</strong>
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
              <p className="eyebrow" style={{ color: 'var(--color-site-secondary, #2E6B4F)' }}>
                {editionsEyebrow}
              </p>
              <h2 className="section-title">{editionsTitle}</h2>
            </div>
            <div
              className="hidden max-w-sm text-right text-sm text-[#685f52] md:block whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: editionsSubtitle }}
            />
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
                  <span
                    className="absolute left-5 top-5 rounded-full px-4 py-1.5 text-xs font-black text-white"
                    style={{ backgroundColor: 'var(--color-site-primary, #E8622C)' }}
                  >
                    {edition.year}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl uppercase">{edition.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#675f54]">
                    {edition.description}
                  </p>
                  <span
                    className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-wider"
                    style={{ color: 'var(--color-site-secondary, #2E6B4F)' }}
                  >
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
              <p className="eyebrow" style={{ color: 'var(--color-site-primary, #E8622C)' }}>
                {galleryEyebrow}
              </p>
              <h2 className="section-title text-[#F2E9D3]">{galleryTitle}</h2>
            </div>
            {editions[0] && (
              <Button
                asChild
                variant="outline"
                className="hidden rounded-full border-[#F2E9D3]/40 bg-transparent text-[#F2E9D3] hover:bg-[#F2E9D3] hover:text-[#181410] md:flex"
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
        className="relative overflow-hidden px-5 py-24 text-[#F2E9D3] lg:py-32"
        style={{
          backgroundColor: '#24523D',
          backgroundImage: triboBanner
            ? `linear-gradient(rgba(36, 82, 61, 0.88), rgba(36, 82, 61, 0.94)), url(${triboBanner})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Pattern className="text-[#F2E9D3] opacity-[0.035]" />
        <JungleCorner className="hidden opacity-40 lg:block" />
        <JungleCorner side="right" className="hidden opacity-40 lg:block" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow" style={{ color: 'var(--color-site-gold, #C9962E)' }}>
            {triboEyebrow}
          </p>
          <h2 className="font-display text-5xl uppercase leading-[.9] sm:text-7xl">{triboTitle}</h2>
          <div
            className="rich-text-content mx-auto mt-5 max-w-xl text-[#F2E9D3]/85"
            dangerouslySetInnerHTML={{ __html: triboDesc }}
          />
          <div className="mx-auto mt-10 max-w-xl rounded-3xl bg-[#F2E9D3] p-6 text-left text-[#181410] shadow-2xl sm:p-9">
            <LeadForm />
          </div>
        </div>
      </section>

      <section
        className="section-shell"
        style={{ backgroundColor: 'var(--color-site-bg, #F2E9D3)' }}
      >
        <div className="mx-auto max-w-7xl text-center">
          <p className="eyebrow" style={{ color: 'var(--color-site-secondary, #2E6B4F)' }}>
            {connectEyebrow}
          </p>
          <h2 className="section-title">{connectTitle}</h2>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            {links.map((link) => (
              <Button
                key={link.id}
                asChild
                className={`h-14 rounded-full px-7 font-bold uppercase tracking-wider ${
                  link.icon === 'instagram'
                    ? 'bg-[#793d73] hover:bg-[#62315d]'
                    : link.icon === 'ticket'
                      ? 'bg-[#E8622C] hover:bg-[#C94F1E]'
                      : 'bg-[#2E6B4F] hover:bg-[#24523D]'
                } ${link.highlight ? 'ring-4 ring-[#C9962E]/25' : ''}`}
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
            <span
              className="grid size-12 place-items-center rounded-full text-white"
              style={{ backgroundColor: 'var(--color-site-secondary, #2E6B4F)' }}
            >
              <MapPin />
            </span>
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-site-primary, #E8622C)' }}
              >
                {locationEyebrow}
              </p>
              <h3 className="font-display text-2xl uppercase">{locationTitle}</h3>
              <p className="mt-1 text-sm text-[#675f54]">{locationDesc}</p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#181410] bg-transparent"
          >
            <a href={locationMapsUrl} target="_blank" rel="noreferrer">
              {locationBtnLabel} <ArrowRight />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  )
}
