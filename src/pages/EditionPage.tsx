import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Ticket } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Layout from '@/components/Layout'
import { MediaGallery } from '@/components/MediaGallery'
import { LeadForm } from '@/components/LeadForm'
import { MediaPlaceholder } from '@/components/BrandArt'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getEdition, getFileUrl, listEditions, listMedia } from '@/services/festival'
import type { Edition, FestivalMedia } from '@/types/festival'

export default function EditionPage() {
  const { id = '' } = useParams()
  const [edition, setEdition] = useState<Edition | null>(null)
  const [editions, setEditions] = useState<Edition[]>([])
  const [media, setMedia] = useState<FestivalMedia[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
    Promise.all([getEdition(id), listEditions(), listMedia(id)])
      .then(([current, all, gallery]) => {
        setEdition(current)
        setEditions(all)
        setMedia(gallery)
      })
      .catch(() => setEdition(null))
  }, [id])
  if (!edition)
    return (
      <Layout>
        <div className="grid min-h-screen place-items-center pt-20">
          <p className="font-display text-3xl uppercase">Carregando edição...</p>
        </div>
      </Layout>
    )
  const ascending = [...editions].sort((a, b) => a.year - b.year)
  const index = ascending.findIndex((item) => item.id === edition.id)
  const previous = ascending[index - 1]
  const next = ascending[index + 1]
  const stats = (edition.stats_public || '')
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <Layout>
      <section className="relative min-h-[78vh] overflow-hidden bg-[#181410] pt-20 text-[#F2E9D3]">
        {edition.cover ? (
          <img
            src={getFileUrl(edition, edition.cover, '1200x800')}
            alt={`Capa ${edition.title}`}
            className="absolute inset-0 h-[110%] w-full object-cover opacity-70"
          />
        ) : (
          <MediaPlaceholder year={edition.year} className="absolute inset-0 h-full opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181410] via-[#181410]/30 to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(78vh-5rem)] max-w-7xl flex-col justify-end px-5 pb-14 lg:px-8">
          <span className="mb-5 w-fit rounded-full bg-[#E8622C] px-5 py-2 text-sm font-black">
            EDIÇÃO {edition.year}
          </span>
          <h1 className="max-w-5xl font-display text-5xl uppercase leading-[.88] sm:text-7xl lg:text-8xl">
            {edition.title}
          </h1>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {stats.map((stat) => (
              <span key={stat} className="font-bold uppercase tracking-wider text-[#F2E9D3]/85">
                {stat}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section-shell">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.4fr_1fr]">
          <div>
            <p className="eyebrow">O capítulo</p>
            <h2 className="section-title">Uma memória viva.</h2>
          </div>
          <p className="text-xl leading-9 text-[#585046]">{edition.description}</p>
        </div>
      </section>
      <section className="section-shell bg-[#181410] text-[#F2E9D3]">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-[#E8622C]">Registros da edição</p>
          <h2 className="section-title mb-10 text-[#F2E9D3]">Galeria completa</h2>
          <MediaGallery items={media} emptyYear={edition.year} />
        </div>
      </section>
      <section className="section-shell">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t border-[#181410]/15 pt-10">
          <Button asChild variant="outline" className="rounded-full border-[#181410]">
            <Link to="/#edicoes">
              <ArrowLeft /> Todas as edições
            </Link>
          </Button>
          <div className="flex gap-3">
            {previous && (
              <Button asChild variant="ghost">
                <Link to={`/edicoes/${previous.id}`}>
                  <ArrowLeft /> {previous.year}
                </Link>
              </Button>
            )}
            {next && (
              <Button asChild variant="ghost">
                <Link to={`/edicoes/${next.id}`}>
                  {next.year} <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-5 right-5 z-40 h-14 rounded-full bg-[#E8622C] px-7 font-bold uppercase shadow-2xl hover:bg-[#C94F1E]">
            <Ticket /> Garantir ingresso
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-none bg-[#F2E9D3] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl uppercase">Entre na tribo</DialogTitle>
          </DialogHeader>
          <p className="mb-3 text-sm text-[#625a50]">
            Receba condições especiais para o Puma Punku 2026.
          </p>
          <LeadForm compact />
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
