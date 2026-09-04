import { useEffect, useState, type FormEvent } from 'react'
import { Edit3, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { MediaPlaceholder } from '@/components/BrandArt'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { getFileUrl, listEditions, pb } from '@/services/festival'
import type { Edition } from '@/types/festival'

const blank = { title: '', year: '2026', description: '', stats_public: '' }
export default function Editions() {
  const [items, setItems] = useState<Edition[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Edition | null>(null)
  const [deleting, setDeleting] = useState<Edition | null>(null)
  const [form, setForm] = useState(blank)
  const [cover, setCover] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const refresh = () => listEditions().then(setItems)
  useEffect(() => {
    refresh()
  }, [])
  function start(item?: Edition) {
    setEditing(item || null)
    setForm(
      item
        ? {
            title: item.title,
            year: String(item.year),
            description: item.description,
            stats_public: item.stats_public || '',
          }
        : blank,
    )
    setCover(null)
    setError('')
    setOpen(true)
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = new FormData()
      data.set('title', form.title)
      data.set('year', form.year)
      data.set('description', form.description)
      data.set('stats_public', form.stats_public)
      if (cover) data.set('cover', cover)
      if (editing) await pb.collection('editions').update(editing.id, data)
      else await pb.collection('editions').create(data)
      await refresh()
      setOpen(false)
      toast.success(editing ? 'Edição atualizada.' : 'Edição criada.')
    } catch (err: unknown) {
      const response = (err as { response?: { data?: Record<string, { message: string }> } })
        .response?.data
      setError(response ? Object.values(response)[0]?.message : 'Não foi possível salvar a edição.')
    } finally {
      setLoading(false)
    }
  }
  async function remove() {
    if (!deleting) return
    await pb.collection('editions').delete(deleting.id)
    setDeleting(null)
    await refresh()
    toast.success('Edição excluída.')
  }
  return (
    <AdminShell
      title="Edições"
      description="Organize a história e os capítulos do festival."
      actions={
        <Button onClick={() => start()} className="rounded-full bg-[#E8622C] hover:bg-[#C94F1E]">
          <Plus /> Nova edição
        </Button>
      }
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-3xl border border-[#181410]/8 bg-white shadow-sm"
          >
            <div className="h-48">
              {item.cover ? (
                <img
                  src={getFileUrl(item, item.cover, '480x320')}
                  alt={`Capa ${item.title}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <MediaPlaceholder year={item.year} className="h-full min-h-0" />
              )}
            </div>
            <div className="p-5">
              <span className="text-xs font-black text-[#E8622C]">{item.year}</span>
              <h2 className="font-display text-2xl uppercase">{item.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-[#70675b]">{item.description}</p>
              <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
                <Button asChild className="bg-[#2E6B4F] hover:bg-[#24523D]">
                  <Link to={`/admin/edicoes/${item.id}/midias`}>
                    <ImagePlus /> Mídias
                  </Link>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => start(item)}
                  aria-label={`Editar ${item.title}`}
                >
                  <Edit3 />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="text-[#D14328]"
                  onClick={() => setDeleting(item)}
                  aria-label={`Excluir ${item.title}`}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!items.length && (
        <div className="rounded-3xl border border-dashed border-[#181410]/20 p-14 text-center">
          <ImagePlus className="mx-auto mb-4 text-[#2E6B4F]" />
          <h2 className="font-display text-2xl uppercase">Comece uma nova história</h2>
          <p className="mt-2 text-sm text-[#70675b]">
            Crie a primeira edição e adicione seus registros.
          </p>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#F2E9D3] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl uppercase">
              {editing ? 'Editar edição' : 'Nova edição'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações que serão exibidas no site.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_130px]">
              <Field label="Título">
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  minLength={2}
                />
              </Field>
              <Field label="Ano">
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  required
                />
              </Field>
            </div>
            <Field label="Descrição completa">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={6}
                required
                minLength={10}
              />
            </Field>
            <Field label="Números públicos">
              <Input
                value={form.stats_public}
                onChange={(e) => setForm({ ...form, stats_public: e.target.value })}
                placeholder="24h de música · 3 palcos · 2.000 pessoas"
              />
            </Field>
            <Field label="Imagem de capa">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
              />
            </Field>
            {error && <p className="text-sm font-semibold text-[#D14328]">{error}</p>}
            <Button
              disabled={loading}
              className="w-full rounded-full bg-[#E8622C] hover:bg-[#C94F1E]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Salvando...
                </>
              ) : (
                'Salvar edição'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleting} onOpenChange={(value) => !value && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {deleting?.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              A edição e todas as mídias relacionadas serão removidas definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-[#D14328]">
              Excluir edição
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
