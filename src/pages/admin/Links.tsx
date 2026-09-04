import { useEffect, useState, type FormEvent } from 'react'
import {
  Edit3,
  ExternalLink,
  Instagram,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Plus,
  Ticket,
  Trash2,
} from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
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
import { listLinks, pb } from '@/services/festival'
import type { FestivalLink } from '@/types/festival'

const blank = {
  label: '',
  url: '',
  icon: 'whatsapp',
  highlight: false,
  active: true,
  sort_order: '0',
}
const icons = {
  whatsapp: MessageCircle,
  instagram: Instagram,
  ticket: Ticket,
  map: MapPin,
  email: Mail,
}
export default function Links() {
  const [items, setItems] = useState<FestivalLink[]>([]),
    [open, setOpen] = useState(false),
    [editing, setEditing] = useState<FestivalLink | null>(null),
    [deleting, setDeleting] = useState<FestivalLink | null>(null)
  const [form, setForm] = useState(blank)
  const refresh = () => listLinks(true).then(setItems)
  useEffect(() => {
    refresh()
  }, [])
  function start(item?: FestivalLink) {
    setEditing(item || null)
    setForm(
      item
        ? {
            label: item.label,
            url: item.url,
            icon: item.icon,
            highlight: item.highlight,
            active: item.active,
            sort_order: String(item.sort_order),
          }
        : blank,
    )
    setOpen(true)
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    const data = { ...form, sort_order: Number(form.sort_order) }
    if (editing) await pb.collection('links').update(editing.id, data)
    else await pb.collection('links').create(data)
    await refresh()
    setOpen(false)
    toast.success(editing ? 'Link atualizado.' : 'Link adicionado.')
  }
  async function toggle(item: FestivalLink, field: 'active' | 'highlight') {
    await pb.collection('links').update(item.id, { [field]: !item[field] })
    await refresh()
  }
  async function remove() {
    if (!deleting) return
    await pb.collection('links').delete(deleting.id)
    setDeleting(null)
    await refresh()
    toast.success('Link excluído.')
  }
  return (
    <AdminShell
      title="Links"
      description="Controle os caminhos de WhatsApp, Instagram, ingressos e mapa."
      actions={
        <Button onClick={() => start()} className="rounded-full bg-[#E8622C] hover:bg-[#C94F1E]">
          <Plus /> Novo link
        </Button>
      }
    >
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = icons[item.icon] || Link2
          return (
            <article
              key={item.id}
              className={`flex flex-col gap-4 rounded-3xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center ${item.active ? 'border-[#181410]/8' : 'border-dashed opacity-60'}`}
            >
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl text-white ${item.highlight ? 'bg-[#E8622C]' : 'bg-[#2E6B4F]'}`}
              >
                <Icon />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold">{item.label}</h2>
                  {item.highlight && (
                    <span className="rounded-full bg-[#E8622C]/10 px-2 py-0.5 text-[10px] font-black uppercase text-[#C94F1E]">
                      Destaque
                    </span>
                  )}
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block truncate text-xs text-[#70675b] hover:text-[#E8622C]"
                >
                  {item.url}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <Switch checked={item.active} onCheckedChange={() => toggle(item, 'active')} />{' '}
                  Ativo
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <Switch
                    checked={item.highlight}
                    onCheckedChange={() => toggle(item, 'highlight')}
                  />{' '}
                  Destaque
                </label>
                <Button asChild size="icon" variant="ghost">
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <ExternalLink />
                  </a>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => start(item)}>
                  <Edit3 />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-[#D14328]"
                  onClick={() => setDeleting(item)}
                >
                  <Trash2 />
                </Button>
              </div>
            </article>
          )
        })}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#F2E9D3]">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl uppercase">
              {editing ? 'Editar link' : 'Novo link'}
            </DialogTitle>
            <DialogDescription>Este conteúdo será refletido no site público.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Rótulo">
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                required
              />
            </Field>
            <Field label="URL">
              <Input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ícone">
                <Select value={form.icon} onValueChange={(icon) => setForm({ ...form, icon })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="ticket">Ingresso</SelectItem>
                    <SelectItem value="map">Mapa</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Ordem">
                <Input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                />
              </Field>
            </div>
            <div className="flex gap-8 rounded-2xl bg-[#EDE2C6] p-4">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Switch
                  checked={form.active}
                  onCheckedChange={(active) => setForm({ ...form, active })}
                />{' '}
                Ativo
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Switch
                  checked={form.highlight}
                  onCheckedChange={(highlight) => setForm({ ...form, highlight })}
                />{' '}
                Destaque
              </label>
            </div>
            <Button className="w-full rounded-full bg-[#E8622C] hover:bg-[#C94F1E]">
              Salvar link
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleting} onOpenChange={(value) => !value && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {deleting?.label}?</AlertDialogTitle>
            <AlertDialogDescription>
              O link deixará de aparecer no site público.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-[#D14328]">
              Excluir link
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
