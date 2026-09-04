import { useEffect, useMemo, useState } from 'react'
import {
  Download,
  MessageCircle,
  Search,
  Trash2,
  TrendingUp,
  Users,
  UserCheck,
  Clock3,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { listLeads, pb } from '@/services/festival'
import type { Lead } from '@/types/festival'

const sourceLabels: Record<string, string> = {
  landing: 'Landing',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  tickets: 'Ingressos',
}
const interestLabels: Record<string, string> = {
  ingresso: 'Ingresso',
  lineup: 'Lineup',
  experiencia: 'Experiência',
  parceria: 'Parceria',
}
const colors = ['#E8622C', '#2E6B4F', '#C9962E', '#8C7A62']

export default function Reports() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('all')
  const [period, setPeriod] = useState('all')
  const [deleting, setDeleting] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listLeads()
      .then(setLeads)
      .finally(() => setLoading(false))
    pb.collection('leads')
      .subscribe('*', (event) => {
        if (event.action === 'create') {
          const lead = event.record as unknown as Lead
          setLeads((current) => [lead, ...current.filter((item) => item.id !== lead.id)])
          toast.success(`Novo lead: ${lead.name}`)
        }
        if (event.action === 'delete')
          setLeads((current) => current.filter((item) => item.id !== event.record.id))
      })
      .catch(() => undefined)
    return () => {
      pb.collection('leads')
        .unsubscribe('*')
        .catch(() => undefined)
    }
  }, [])

  const filtered = useMemo(
    () =>
      leads.filter((lead) => {
        const text = `${lead.name} ${lead.email} ${lead.phone}`.toLowerCase()
        const days = period === 'all' ? Infinity : Number(period)
        const recent =
          days === Infinity || Date.now() - new Date(lead.created).getTime() <= days * 86400000
        return (
          text.includes(query.toLowerCase()) &&
          (source === 'all' || lead.source === source) &&
          recent
        )
      }),
    [leads, query, source, period],
  )

  const now = Date.now()
  const last7 = leads.filter((l) => now - new Date(l.created).getTime() <= 7 * 86400000).length
  const prior7 = leads.filter((l) => {
    const diff = now - new Date(l.created).getTime()
    return diff > 7 * 86400000 && diff <= 14 * 86400000
  }).length
  const variation = prior7 ? Math.round(((last7 - prior7) / prior7) * 100) : last7 ? 100 : 0
  const consent = leads.length
    ? Math.round((leads.filter((lead) => lead.consent).length / leads.length) * 100)
    : 0
  const daily = Array.from({ length: 30 }, (_, index) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (29 - index))
    const key = date.toISOString().slice(0, 10)
    return {
      day: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      total: leads.filter((lead) => lead.created.slice(0, 10) === key).length,
    }
  })
  const bySource = Object.keys(sourceLabels)
    .map((key) => ({
      name: sourceLabels[key],
      value: leads.filter((lead) => lead.source === key).length,
    }))
    .filter((item) => item.value)
  const byInterest = Object.keys(interestLabels).map((key) => ({
    name: interestLabels[key],
    total: leads.filter((lead) => lead.interest === key).length,
  }))

  function exportCsv() {
    const rows = [
      ['Nome', 'E-mail', 'WhatsApp', 'Origem', 'Interesse', 'Consentimento', 'Data'],
      ...filtered.map((lead) => [
        lead.name,
        lead.email,
        lead.phone,
        sourceLabels[lead.source],
        interestLabels[lead.interest || ''] || '',
        lead.consent ? 'Sim' : 'Não',
        new Date(lead.created).toLocaleString('pt-BR'),
      ]),
    ]
    const csv =
      '\uFEFF' +
      rows
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
        .join('\n')
    const href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = `leads-puma-punku-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(href)
  }

  async function remove() {
    if (!deleting) return
    await pb.collection('leads').delete(deleting.id)
    setLeads((current) => current.filter((item) => item.id !== deleting.id))
    toast.success('Lead excluído.')
    setDeleting(null)
  }

  return (
    <AdminShell
      title="Relatórios de leads"
      description="Acompanhe a movimentação da sua tribo em tempo real."
      actions={
        <Button onClick={exportCsv} className="rounded-full bg-[#2E6B4F] hover:bg-[#24523D]">
          <Download /> <span className="hidden sm:inline">Exportar CSV</span>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(
          [
            ['Total de leads', leads.length, 'Base completa', Users, '#E8622C'],
            [
              'Últimos 7 dias',
              last7,
              `${variation >= 0 ? '+' : ''}${variation}% vs. semana anterior`,
              TrendingUp,
              '#2E6B4F',
            ],
            ['Consentimento', `${consent}%`, 'Aceitaram novidades', UserCheck, '#C9962E'],
            [
              'Lead mais recente',
              leads[0]
                ? new Date(leads[0].created).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })
                : '—',
              leads[0]?.name || 'Nenhum lead',
              Clock3,
              '#181410',
            ],
          ] as const
        ).map(([label, value, helper, Icon, color]) => (
          <div
            key={String(label)}
            className="rounded-3xl border border-[#181410]/8 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-[#756c60]">
                {String(label)}
              </p>
              <span
                className="grid size-10 place-items-center rounded-xl text-white"
                style={{ background: String(color) }}
              >
                <Icon className="size-5" />
              </span>
            </div>
            <p className="mt-5 font-display text-4xl">{String(value)}</p>
            <p className="mt-1 text-xs text-[#756c60]">{String(helper)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <ChartCard title="Leads por dia · últimos 30 dias" className="xl:col-span-7">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={daily}>
              <defs>
                <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#E8622C" />
                  <stop offset="1" stopColor="#C9962E" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#18141012" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                interval={4}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#181410',
                  color: '#F2E9D3',
                  border: 0,
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="total" name="Leads" fill="url(#leadGradient)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Leads por origem" className="xl:col-span-5">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={bySource}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
              >
                {bySource.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#181410',
                  color: '#F2E9D3',
                  border: 0,
                  borderRadius: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3">
            {bySource.map((item, i) => (
              <span key={item.name} className="flex items-center gap-1 text-xs">
                <i className="size-2 rounded-full" style={{ background: colors[i] }} />
                {item.name} ({item.value})
              </span>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Interesses da tribo" className="xl:col-span-12">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={byInterest} layout="vertical">
              <CartesianGrid stroke="#18141012" horizontal={false} />
              <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#181410',
                  color: '#F2E9D3',
                  border: 0,
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="total" name="Leads" fill="#2E6B4F" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-[#181410]/8 bg-white">
        <div className="flex flex-col gap-3 border-b border-[#181410]/8 p-5 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#756c60]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, e-mail ou telefone"
              className="pl-10"
            />
          </div>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as origens</SelectItem>
              {Object.entries(sourceLabels).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo o período</SelectItem>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {loading ? (
          <p className="p-10 text-center text-sm text-[#756c60]">Carregando leads...</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F2E9D3]/60 text-xs uppercase tracking-wider text-[#756c60]">
                  <tr>
                    {['Lead', 'WhatsApp', 'Origem', 'Interesse', 'Consentimento', 'Data', ''].map(
                      (title) => (
                        <th key={title} className="px-5 py-3">
                          {title}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="border-t border-[#181410]/7">
                      <td className="px-5 py-4">
                        <strong className="block">{lead.name}</strong>
                        <span className="text-xs text-[#756c60]">{lead.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <a
                          className="flex items-center gap-1 text-[#2E6B4F] hover:underline"
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="size-4" />
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <SourceBadge source={lead.source} />
                      </td>
                      <td className="px-5 py-4">{interestLabels[lead.interest || ''] || '—'}</td>
                      <td className="px-5 py-4">{lead.consent ? 'Sim' : 'Não'}</td>
                      <td className="px-5 py-4 text-xs">
                        {new Date(lead.created).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-[#D14328]"
                          onClick={() => setDeleting(lead)}
                          aria-label={`Excluir ${lead.name}`}
                        >
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 p-4 md:hidden">
              {filtered.map((lead) => (
                <div key={lead.id} className="rounded-2xl border p-4">
                  <div className="flex justify-between gap-2">
                    <div>
                      <strong>{lead.name}</strong>
                      <p className="text-xs text-[#756c60]">{lead.email}</p>
                    </div>
                    <SourceBadge source={lead.source} />
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div className="text-xs text-[#756c60]">
                      <p>{lead.phone}</p>
                      <p>
                        {interestLabels[lead.interest || ''] || 'Sem interesse definido'} ·{' '}
                        {new Date(lead.created).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-[#D14328]"
                      onClick={() => setDeleting(lead)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {!filtered.length && (
              <p className="p-10 text-center text-sm text-[#756c60]">
                Nenhum lead encontrado com esses filtros.
              </p>
            )}
          </>
        )}
      </div>
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados de {deleting?.name} serão removidos definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-[#D14328] hover:bg-[#b53621]">
              Excluir lead
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}

function ChartCard({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-3xl border border-[#181410]/8 bg-white p-5 shadow-sm ${className}`}>
      <h2 className="mb-5 font-bold">{title}</h2>
      {children}
    </div>
  )
}
function SourceBadge({ source }: { source: string }) {
  const style: Record<string, string> = {
    landing: 'bg-[#E8622C]/10 text-[#C94F1E]',
    whatsapp: 'bg-[#2E6B4F]/10 text-[#2E6B4F]',
    instagram: 'bg-purple-100 text-purple-700',
    tickets: 'bg-[#C9962E]/15 text-[#8a6415]',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${style[source]}`}
    >
      {sourceLabels[source]}
    </span>
  )
}
