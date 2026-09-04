import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Edit3,
  ImagePlus,
  Loader2,
  Play,
  Trash2,
  Upload,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getEdition, getFileUrl, listMedia, pb } from '@/services/festival'
import type { Edition, FestivalMedia } from '@/types/festival'

export default function MediaManager() {
  const { id = '' } = useParams()
  const [edition, setEdition] = useState<Edition | null>(null)
  const [items, setItems] = useState<FestivalMedia[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<FestivalMedia | null>(null)
  const [deleting, setDeleting] = useState<FestivalMedia | null>(null)
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const refresh = () => listMedia(id).then(setItems)
  useEffect(() => {
    getEdition(id).then(setEdition)
    refresh()
  }, [id])
  function start(item?: FestivalMedia) {
    setEditing(item || null)
    setCaption(item?.caption || '')
    setFile(null)
    setProgress(0)
    setOpen(true)
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!editing && !file) return
    if (file && file.size > 50 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 50 MB.')
      return
    }
    setLoading(true)
    setProgress(15)
    try {
      const data = new FormData()
      data.set('caption', caption)
      data.set('edition', id)
      data.set('sort_order', String(editing?.sort_order ?? items.length))
      if (file) {
        data.set('file', file)
        data.set('type', file.type.startsWith('video/') ? 'video' : 'image')
      } else if (editing) data.set('type', editing.type)
      setProgress(55)
      if (editing) await pb.collection('media').update(editing.id, data)
      else await pb.collection('media').create(data)
      setProgress(100)
      await refresh()
      setTimeout(() => setOpen(false), 250)
      toast.success(editing ? 'Mídia atualizada.' : 'Mídia adicionada.')
    } catch {
      toast.error('Não foi possível enviar esta mídia.')
    } finally {
      setLoading(false)
    }
  }
  async function move(index: number, direction: number) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const first = items[index],
      second = items[target]
    await Promise.all([
      pb.collection('media').update(first.id, { sort_order: target }),
      pb.collection('media').update(second.id, { sort_order: index }),
    ])
    await refresh()
  }
  async function remove() {
    if (!deleting) return
    await pb.collection('media').delete(deleting.id)
    setDeleting(null)
    await refresh()
    toast.success('Mídia excluída.')
  }
  return (
    <AdminShell
      title={edition?.title || 'Galeria da edição'}
      description="Adicione, edite e organize fotos e vídeos."
      actions={
        <Button onClick={() => start()} className="rounded-full bg-[#E8622C] hover:bg-[#C94F1E]">
          <Upload /> Adicionar mídia
        </Button>
      }
    >
      <Button asChild variant="ghost" className="mb-5 -ml-3">
        <Link to="/admin/edicoes">
          <ArrowLeft /> Voltar às edições
        </Link>
      </Button>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => {
          const url = getFileUrl(item, item.file, item.type === 'image' ? '480x320' : undefined)
          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-[#181410]/8 bg-white"
            >
              <div className="relative aspect-square bg-[#181410]">
                {item.type === 'video' ? (
                  <>
                    <video
                      src={url}
                      muted
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                    <Play className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-white text-white" />
                  </>
                ) : (
                  <img
                    src={url}
                    alt={item.caption || 'Mídia do festival'}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 min-h-8 text-xs text-[#6f675c]">
                  {item.caption || 'Sem legenda'}
                </p>
                <div className="mt-3 flex justify-between">
                  <div>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      aria-label="Mover para cima"
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={index === items.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label="Mover para baixo"
                    >
                      <ArrowDown />
                    </Button>
                  </div>
                  <div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => start(item)}
                      aria-label="Editar"
                    >
                      <Edit3 />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-[#D14328]"
                      onClick={() => setDeleting(item)}
                      aria-label="Excluir"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {!items.length && (
        <div className="rounded-3xl border border-dashed p-14 text-center">
          <ImagePlus className="mx-auto mb-3 text-[#2E6B4F]" />
          <h2 className="font-display text-2xl uppercase">
            A galeria está pronta para ganhar vida
          </h2>
          <p className="mt-2 text-sm text-[#6f675c]">Envie fotos e vídeos de até 50 MB.</p>
        </div>
      )}
      <Dialog open={open} onOpenChange={(value) => !loading && setOpen(value)}>
        <DialogContent className="bg-[#F2E9D3]">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl uppercase">
              {editing ? 'Editar mídia' : 'Adicionar foto ou vídeo'}
            </DialogTitle>
            <DialogDescription>
              Imagens e vídeos aparecem imediatamente na página pública.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label>Arquivo {editing && '(opcional para manter o atual)'}</Label>
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required={!editing}
              />
            </div>
            <div className="space-y-2">
              <Label>Legenda</Label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                placeholder="Conte o que estava acontecendo neste registro..."
              />
            </div>
            {(loading || progress > 0) && (
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Enviando arquivo</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            <Button
              disabled={loading}
              className="w-full rounded-full bg-[#E8622C] hover:bg-[#C94F1E]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Enviando...
                </>
              ) : (
                'Salvar mídia'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleting} onOpenChange={(value) => !value && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta mídia?</AlertDialogTitle>
            <AlertDialogDescription>
              O arquivo será removido da galeria pública definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-[#D14328]">
              Excluir mídia
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}
