import { useEffect, useState, type FormEvent } from 'react'
import { Check, Instagram, Leaf, Loader2, MessageCircle } from 'lucide-react'
import { createLead, listLinks } from '@/services/festival'
import type { FestivalLink } from '@/types/festival'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const initial = { name: '', email: '', phone: '', interest: '', consent: false }
type Errors = Partial<Record<keyof typeof initial, string>>

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function LeadForm({
  compact = false,
  onSuccess,
}: {
  compact?: boolean
  onSuccess?: () => void
}) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [links, setLinks] = useState<FestivalLink[]>([])

  useEffect(() => {
    listLinks()
      .then(setLinks)
      .catch(() => undefined)
  }, [])

  function validate() {
    const next: Errors = {}
    if (form.name.trim().length < 2) next.name = 'Conte seu nome para a gente.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Digite um e-mail válido.'
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Digite um WhatsApp com DDD.'
    if (!form.interest) next.interest = 'Escolha o que mais te interessa.'
    if (!form.consent) next.consent = 'Precisamos do seu aceite para enviar novidades.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await createLead({
        ...form,
        interest: form.interest as 'ingresso' | 'lineup' | 'experiencia' | 'parceria',
        source: 'landing',
      })
      setSuccess(true)
      onSuccess?.()
    } catch (error: unknown) {
      const data =
        (error as { response?: { data?: Record<string, { message: string }> } }).response?.data ||
        {}
      const mapped: Errors = {}
      for (const [field, detail] of Object.entries(data))
        mapped[field as keyof Errors] = detail.message
      setErrors(
        Object.keys(mapped).length
          ? mapped
          : { email: 'Não foi possível enviar agora. Tente novamente.' },
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    const whatsapp = links.find((link) => link.icon === 'whatsapp')
    const instagram = links.find((link) => link.icon === 'instagram')
    return (
      <div className="animate-germinar py-7 text-center" role="status">
        <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-[#2E6B4F] text-white">
          <svg className="size-11" viewBox="0 0 48 48">
            <path
              className="check-draw"
              d="m10 25 9 9 20-22"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
            />
          </svg>
        </div>
        <h3 className="font-display text-3xl uppercase text-[#181410]">
          Você está dentro da tribo!
        </h3>
        <p className="mt-3 text-[#5e574d]">
          Fique de olho no e-mail. As novidades chegam primeiro para você. 🌿
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {whatsapp && (
            <Button asChild className="rounded-full bg-[#2E6B4F] hover:bg-[#24523D]">
              <a href={whatsapp.url} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
          )}
          {instagram && (
            <Button asChild variant="outline" className="rounded-full border-[#181410]">
              <a href={instagram.url} target="_blank" rel="noreferrer">
                <Instagram /> Instagram
              </a>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className={compact ? 'space-y-4' : 'space-y-5'} noValidate>
      <div className={compact ? 'space-y-4' : 'grid gap-5 sm:grid-cols-2'}>
        <Field label="Nome" error={errors.name}>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Como você se chama?"
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field label="E-mail" error={errors.email}>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="voce@email.com"
            aria-invalid={!!errors.email}
          />
        </Field>
      </div>
      <div className={compact ? 'space-y-4' : 'grid gap-5 sm:grid-cols-2'}>
        <Field label="WhatsApp" error={errors.phone}>
          <Input
            inputMode="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
            placeholder="(35) 99999-9999"
            aria-invalid={!!errors.phone}
          />
        </Field>
        <Field label="Meu interesse" error={errors.interest}>
          <Select
            value={form.interest}
            onValueChange={(value) => setForm({ ...form, interest: value })}
          >
            <SelectTrigger aria-invalid={!!errors.interest}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ingresso">Ingresso</SelectItem>
              <SelectItem value="lineup">Lineup</SelectItem>
              <SelectItem value="experiencia">Experiência</SelectItem>
              <SelectItem value="parceria">Parceria</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-[#4a443c]">
          <Checkbox
            checked={form.consent}
            onCheckedChange={(checked) => setForm({ ...form, consent: checked === true })}
            className="mt-0.5 border-[#2E6B4F] data-[state=checked]:bg-[#2E6B4F]"
          />
          <span>Aceito receber novidades do Puma Punku e conteúdos sobre o festival.</span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-xs font-semibold text-[#D14328]">{errors.consent}</p>
        )}
      </div>
      <Button
        disabled={loading}
        type="submit"
        className="h-13 w-full rounded-full bg-[#E8622C] font-bold uppercase tracking-wider hover:scale-[1.02] hover:bg-[#C94F1E]"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Enviando...
          </>
        ) : (
          <>
            <Leaf /> Quero fazer parte
          </>
        )}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[#777064]">
        <Check className="size-3.5" /> Seus dados estão seguros com a tribo.
      </p>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="font-bold text-[#181410]">{label}</Label>
      {children}
      {error && <p className="text-xs font-semibold text-[#D14328]">{error}</p>}
    </div>
  )
}
