import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { getFileUrl } from '@/services/festival'
import type { FestivalMedia } from '@/types/festival'
import { MediaPlaceholder } from './BrandArt'
import { Button } from '@/components/ui/button'

export function MediaGallery({
  items,
  emptyYear,
  limit,
}: {
  items: FestivalMedia[]
  emptyYear?: number
  limit?: number
}) {
  const [active, setActive] = useState<number | null>(null)
  const visible = limit ? items.slice(0, limit) : items

  useEffect(() => {
    if (active === null) return
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight')
        setActive((value) => (value === null ? null : (value + 1) % visible.length))
      if (event.key === 'ArrowLeft')
        setActive((value) =>
          value === null ? null : (value - 1 + visible.length) % visible.length,
        )
    }
    window.addEventListener('keydown', keyboard)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', keyboard)
      document.body.style.overflow = ''
    }
  }, [active, visible.length])

  if (!visible.length) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <MediaPlaceholder
            key={item}
            year={emptyYear}
            className={item % 3 === 0 ? 'min-h-80' : 'min-h-56'}
          />
        ))}
      </div>
    )
  }

  const current = active === null ? null : visible[active]
  return (
    <>
      <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {visible.map((media, index) => {
          const url = getFileUrl(media, media.file, media.type === 'image' ? '480x0' : undefined)
          return (
            <button
              key={media.id}
              onClick={() => setActive(index)}
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-[#EDE2C6] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8622C]"
              aria-label={`Abrir mídia ${index + 1}`}
            >
              {media.type === 'video' ? (
                <video
                  src={url}
                  muted
                  preload="metadata"
                  className="min-h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <img
                  src={url}
                  alt={media.caption || 'Registro do Puma Punku Festival'}
                  loading="lazy"
                  className="min-h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}
              {media.type === 'video' && (
                <span className="absolute inset-0 grid place-items-center bg-black/15">
                  <span className="grid size-14 place-items-center rounded-full bg-[#F2E9D3]/90 text-[#181410]">
                    <Play className="ml-1 fill-current" />
                  </span>
                </span>
              )}
              {media.caption && (
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 text-sm text-white transition group-hover:translate-y-0">
                  {media.caption}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#12100D]/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização da galeria"
          onClick={() => setActive(null)}
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-5 top-5 z-10 rounded-full text-white hover:bg-white/10 hover:text-white"
            onClick={() => setActive(null)}
            aria-label="Fechar"
          >
            <X />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-3 top-1/2 z-10 rounded-full text-white hover:bg-white/10 hover:text-white md:left-8"
            onClick={(e) => {
              e.stopPropagation()
              setActive((active - 1 + visible.length) % visible.length)
            }}
            aria-label="Anterior"
          >
            <ChevronLeft className="size-8" />
          </Button>
          <div className="max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {current.type === 'video' ? (
              <video
                src={getFileUrl(current, current.file)}
                controls
                autoPlay
                muted
                className="max-h-[80vh] max-w-full rounded-xl"
              />
            ) : (
              <img
                src={getFileUrl(current, current.file)}
                alt={current.caption || 'Registro do festival'}
                className="max-h-[80vh] max-w-full rounded-xl object-contain"
              />
            )}
            {current.caption && (
              <p className="mt-3 text-center text-sm text-[#F2E9D3]">{current.caption}</p>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-3 top-1/2 z-10 rounded-full text-white hover:bg-white/10 hover:text-white md:right-8"
            onClick={(e) => {
              e.stopPropagation()
              setActive((active + 1) % visible.length)
            }}
            aria-label="Próxima"
          >
            <ChevronRight className="size-8" />
          </Button>
        </div>
      )}
    </>
  )
}
