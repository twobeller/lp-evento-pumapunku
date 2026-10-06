import React, { useState, useEffect } from 'react'
import {
  Save,
  Loader2,
  ExternalLink,
  Eye,
  Type,
  Palette,
  FileText,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Undo2,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { ImageUploader } from '@/components/admin/ImageUploader'
import {
  useSiteContent,
  AVAILABLE_DISPLAY_FONTS,
  DEFAULT_CONTENT,
} from '@/contexts/SiteContentContext'
import {
  listSiteContent,
  updateSiteContent,
  createSiteContent,
  getFileUrl,
} from '@/services/festival'
import type { SiteContentItem } from '@/types/festival'

export default function ContentManager() {
  const { reload: reloadContext } = useSiteContent()
  const [items, setItems] = useState<SiteContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showLivePreview, setShowLivePreview] = useState(false)
  const [activeTab, setActiveTab] = useState('identidade')

  // Estado local das alterações: chave -> valor string
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  // Arquivos pendentes de upload: chave -> File
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({})
  // Imagens a serem limpas: chave -> true
  const [pendingClearFiles, setPendingClearFiles] = useState<Record<string, boolean>>({})

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await listSiteContent()
      setItems(data)
      const values: Record<string, string> = {}
      for (const item of data) {
        values[item.key] = item.value ?? ''
      }
      setFormValues(values)
      setPendingFiles({})
      setPendingClearFiles({})
    } catch (err) {
      toast.error('Erro ao carregar os conteúdos da página')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileSelect = (key: string, file: File) => {
    setPendingFiles((prev) => ({ ...prev, [key]: file }))
    setPendingClearFiles((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleClearImage = (key: string) => {
    setPendingClearFiles((prev) => ({ ...prev, [key]: true }))
    setPendingFiles((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    setFormValues((prev) => ({ ...prev, [key]: '' }))
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      let updatedCount = 0

      // Atualiza cada registro existente ou cria se faltar
      for (const item of items) {
        const val = formValues[item.key]
        const hasNewFile = pendingFiles[item.key]
        const hasClearFile = pendingClearFiles[item.key]

        const isValueChanged = val !== undefined && val !== item.value
        if (isValueChanged || hasNewFile || hasClearFile) {
          if (hasNewFile) {
            const formData = new FormData()
            formData.append('image_file', hasNewFile)
            if (val !== undefined) formData.append('value', val)
            await updateSiteContent(item.id, formData)
          } else if (hasClearFile) {
            const formData = new FormData()
            formData.append('image_file', '')
            formData.append('value', '')
            await updateSiteContent(item.id, formData)
          } else {
            await updateSiteContent(item.id, { value: val })
          }
          updatedCount++
        }
      }

      toast.success(
        updatedCount > 0
          ? `${updatedCount} alterações salvas com sucesso!`
          : 'Conteúdos atualizados!',
      )
      await reloadContext()
      await loadData()
    } catch (err) {
      console.error(err)
      toast.error('Ocorreu um erro ao salvar as alterações.')
    } finally {
      setSaving(false)
    }
  }

  const getItem = (key: string) => items.find((i) => i.key === key)

  const getValue = (key: string) => {
    if (formValues[key] !== undefined) return formValues[key]
    const item = getItem(key)
    return item?.value ?? DEFAULT_CONTENT[key] ?? ''
  }

  const getImgUrl = (key: string) => {
    if (pendingClearFiles[key]) return ''
    const item = getItem(key)
    if (item?.image_file) {
      return getFileUrl(item, item.image_file)
    }
    return getValue(key)
  }

  return (
    <AdminShell
      title="Editor do Site (CMS)"
      description="Personalize todos os textos, títulos, imagens, banners, cores da marca e tipografia da página sem tocar em código."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="hidden sm:inline-flex border-[#181410]/20"
          >
            {showLivePreview ? (
              <>
                <PanelRightClose className="size-4 mr-1.5" /> Ocultar Preview
              </>
            ) : (
              <>
                <PanelRightOpen className="size-4 mr-1.5" /> Pré-visualizar Lado a Lado
              </>
            )}
          </Button>

          <Button asChild variant="outline" size="sm" className="border-[#181410]/20">
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="size-4 mr-1.5" /> Ver Site
            </a>
          </Button>

          <Button
            onClick={handleSaveAll}
            disabled={saving || loading}
            className="bg-[#E8622C] hover:bg-[#C94F1E] font-bold text-white shadow-warm"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" /> Salvando...
              </>
            ) : (
              <>
                <Save className="size-4 mr-1.5" /> Salvar Tudo
              </>
            )}
          </Button>
        </div>
      }
    >
      <div
        className={`grid gap-8 ${showLivePreview ? 'lg:grid-cols-[1.1fr_0.9fr]' : 'grid-cols-1'}`}
      >
        {/* Painel do Editor */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#181410]/10 bg-white p-6 shadow-warm sm:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto gap-1 bg-[#EDE2C6]/60 p-1.5 rounded-2xl">
                <TabsTrigger
                  value="identidade"
                  className="rounded-xl py-2 text-xs font-bold data-[state=active]:bg-[#181410] data-[state=active]:text-white"
                >
                  <Palette className="size-3.5 mr-1.5" /> Identidade
                </TabsTrigger>
                <TabsTrigger
                  value="hero"
                  className="rounded-xl py-2 text-xs font-bold data-[state=active]:bg-[#181410] data-[state=active]:text-white"
                >
                  <Sparkles className="size-3.5 mr-1.5" /> Hero / Capa
                </TabsTrigger>
                <TabsTrigger
                  value="marquee"
                  className="rounded-xl py-2 text-xs font-bold data-[state=active]:bg-[#181410] data-[state=active]:text-white"
                >
                  <Type className="size-3.5 mr-1.5" /> Marquee
                </TabsTrigger>
                <TabsTrigger
                  value="festival"
                  className="rounded-xl py-2 text-xs font-bold data-[state=active]:bg-[#181410] data-[state=active]:text-white"
                >
                  <FileText className="size-3.5 mr-1.5" /> O Festival
                </TabsTrigger>
                <TabsTrigger
                  value="edicoes"
                  className="rounded-xl py-2 text-xs font-bold data-[state=active]:bg-[#181410] data-[state=active]:text-white"
                >
                  Edições & Galeria
                </TabsTrigger>
                <TabsTrigger
                  value="tribo"
                  className="rounded-xl py-2 text-xs font-bold data-[state=active]:bg-[#181410] data-[state=active]:text-white"
                >
                  Tribo (Form)
                </TabsTrigger>
                <TabsTrigger
                  value="rodape"
                  className="rounded-xl py-2 text-xs font-bold data-[state=active]:bg-[#181410] data-[state=active]:text-white"
                >
                  Local & Rodapé
                </TabsTrigger>
              </TabsList>

              {/* ABA 1: IDENTIDADE & TEMA */}
              <TabsContent value="identidade" className="space-y-6">
                <div className="border-b border-[#181410]/10 pb-4">
                  <h3 className="font-display text-xl uppercase">Cores & Tipografia Global</h3>
                  <p className="text-xs text-[#686054]">
                    Altere a paleta do evento e a fonte de títulos. As mudanças são refletidas
                    instantaneamente na página pública.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <ColorField
                    label="Cor de Fundo Principal"
                    help="Fundo clássico do festival (Creme místico)"
                    value={getValue('theme_color_bg')}
                    onChange={(v) => handleChange('theme_color_bg', v)}
                    defaultColor="#F2E9D3"
                  />
                  <ColorField
                    label="Cor de Texto Principal"
                    help="Cor padrão dos textos e contrastes"
                    value={getValue('theme_color_text')}
                    onChange={(v) => handleChange('theme_color_text', v)}
                    defaultColor="#181410"
                  />
                  <ColorField
                    label="Acento Laranja Tropical (Destaque)"
                    help="Botões principais, detalhes vibrantes e palavras de destaque"
                    value={getValue('theme_color_primary')}
                    onChange={(v) => handleChange('theme_color_primary', v)}
                    defaultColor="#E8622C"
                  />
                  <ColorField
                    label="Acento Verde Folha / Floresta"
                    help="Eyebrows, badges, natureza e ícones orgânicos"
                    value={getValue('theme_color_secondary')}
                    onChange={(v) => handleChange('theme_color_secondary', v)}
                    defaultColor="#2E6B4F"
                  />
                  <ColorField
                    label="Acento Dourado / Sol"
                    help="Estrelas do marquee e detalhes energéticos"
                    value={getValue('theme_color_gold')}
                    onChange={(v) => handleChange('theme_color_gold', v)}
                    defaultColor="#C9962E"
                  />

                  <div className="space-y-2">
                    <Label className="font-bold text-[#181410]">Fonte dos Títulos & Display</Label>
                    <Select
                      value={getValue('theme_font_display')}
                      onValueChange={(v) => handleChange('theme_font_display', v)}
                    >
                      <SelectTrigger className="rounded-xl border-[#181410]/20 bg-white">
                        <SelectValue placeholder="Selecione uma fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_DISPLAY_FONTS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-[#686054]">
                      A fonte selecionada será carregada e aplicada em todos os títulos bold da
                      landing page.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#EDE2C6]/50 p-4 border border-[#181410]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-8 rounded-full border border-black/20"
                      style={{ backgroundColor: getValue('theme_color_primary') }}
                    />
                    <div>
                      <p
                        className="font-display text-lg uppercase"
                        style={{
                          fontFamily: `'${getValue('theme_font_display')}', system-ui, sans-serif`,
                        }}
                      >
                        Puma Punku Festival
                      </p>
                      <p className="text-xs text-[#686054]">
                        Prévia da tipografia com a cor primária selecionada
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 2: HERO / CAPA */}
              <TabsContent value="hero" className="space-y-6">
                <div className="border-b border-[#181410]/10 pb-4">
                  <h3 className="font-display text-xl uppercase">Seção Hero (Capa Principal)</h3>
                  <p className="text-xs text-[#686054]">
                    Primeiro impacto que o visitante vê ao abrir a landing page.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Badge Superior (Data e Local)</Label>
                    <Input
                      value={getValue('hero_badge')}
                      onChange={(e) => handleChange('hero_badge', e.target.value)}
                      placeholder="04 & 05 Julho · São Thomé das Letras – MG"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-bold">Título Linha 1</Label>
                      <Input
                        value={getValue('hero_title_line1')}
                        onChange={(e) => handleChange('hero_title_line1', e.target.value)}
                        placeholder="Puma Punku"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Título Linha 2 (Destaque Laranja)</Label>
                      <Input
                        value={getValue('hero_title_line2')}
                        onChange={(e) => handleChange('hero_title_line2', e.target.value)}
                        placeholder="Festival 2026"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">Subtítulo / Texto Descritivo (Editor Rico)</Label>
                    <RichTextEditor
                      value={getValue('hero_subtitle')}
                      onChange={(val) => handleChange('hero_subtitle', val)}
                      placeholder="Subtítulo poético da chamada do festival..."
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-bold">Botão Principal - Texto</Label>
                      <Input
                        value={getValue('hero_btn_primary_label')}
                        onChange={(e) => handleChange('hero_btn_primary_label', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Botão Principal - Link/Âncora</Label>
                      <Input
                        value={getValue('hero_btn_primary_url')}
                        onChange={(e) => handleChange('hero_btn_primary_url', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-bold">Botão Secundário - Texto</Label>
                      <Input
                        value={getValue('hero_btn_secondary_label')}
                        onChange={(e) => handleChange('hero_btn_secondary_label', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Botão Secundário - Link/Âncora</Label>
                      <Input
                        value={getValue('hero_btn_secondary_url')}
                        onChange={(e) => handleChange('hero_btn_secondary_url', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <ImageUploader
                      label="Banner de Fundo do Hero (Opcional)"
                      currentUrl={getImgUrl('hero_bg_banner')}
                      onFileSelect={(file) => handleFileSelect('hero_bg_banner', file)}
                      onClear={() => handleClearImage('hero_bg_banner')}
                      helperText="Se fornecido, será aplicado como fundo atmosférico com overlay suave no Hero."
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ABA 3: MARQUEE */}
              <TabsContent value="marquee" className="space-y-6">
                <div className="border-b border-[#181410]/10 pb-4">
                  <h3 className="font-display text-xl uppercase">Letreiro Rotativo (Marquee)</h3>
                  <p className="text-xs text-[#686054]">
                    Faixa escura animada que corre horizontalmente com as datas e chamada chave.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Texto do Letreiro Rotativo</Label>
                    <Input
                      value={getValue('marquee_text')}
                      onChange={(e) => handleChange('marquee_text', e.target.value)}
                      placeholder="PUMA PUNKU FESTIVAL ✦ 04 & 05 JULHO 2026 ✦ SÃO THOMÉ DAS LETRAS ✦"
                      className="rounded-xl font-bold uppercase"
                    />
                    <p className="text-xs text-[#686054]">
                      Dica: adicione estrelas ou símbolos especiais para separar blocos de texto.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-2xl bg-[#181410] py-3 text-[#F2E9D3]">
                    <div className="marquee whitespace-nowrap text-xs font-bold uppercase tracking-[.15em]">
                      <span>{getValue('marquee_text')}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 4: O FESTIVAL */}
              <TabsContent value="festival" className="space-y-6">
                <div className="border-b border-[#181410]/10 pb-4">
                  <h3 className="font-display text-xl uppercase">Seção "O Festival" & Números</h3>
                  <p className="text-xs text-[#686054]">
                    Manifesto, proposta e os contadores de horas, palcos e edições.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-bold">Eyebrow (Subtítulo superior)</Label>
                      <Input
                        value={getValue('festival_eyebrow')}
                        onChange={(e) => handleChange('festival_eyebrow', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Título da Seção</Label>
                      <Input
                        value={getValue('festival_title')}
                        onChange={(e) => handleChange('festival_title', e.target.value)}
                        className="rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">Descrição da Seção (Editor Rico)</Label>
                    <RichTextEditor
                      value={getValue('festival_description')}
                      onChange={(val) => handleChange('festival_description', val)}
                      placeholder="Texto institucional contando sobre a experiência do festival..."
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    <div className="space-y-2">
                      <Label className="font-bold">Pílula de Destaque 1</Label>
                      <Input
                        value={getValue('festival_pill_1')}
                        onChange={(e) => handleChange('festival_pill_1', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Pílula de Destaque 2</Label>
                      <Input
                        value={getValue('festival_pill_2')}
                        onChange={(e) => handleChange('festival_pill_2', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#181410]/10 pt-4">
                    <h4 className="font-display text-sm uppercase text-[#686054] mb-3">
                      Contadores / Estatísticas
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-[#181410]/10 bg-[#EDE2C6]/40 p-3 space-y-2">
                        <Label className="text-xs font-bold">Contador 1 - Número</Label>
                        <Input
                          value={getValue('festival_stat1_number')}
                          onChange={(e) => handleChange('festival_stat1_number', e.target.value)}
                          className="font-display text-lg"
                        />
                        <Label className="text-xs font-bold">Contador 1 - Texto</Label>
                        <Input
                          value={getValue('festival_stat1_label')}
                          onChange={(e) => handleChange('festival_stat1_label', e.target.value)}
                        />
                      </div>

                      <div className="rounded-2xl border border-[#181410]/10 bg-[#EDE2C6]/40 p-3 space-y-2">
                        <Label className="text-xs font-bold">Contador 2 - Número</Label>
                        <Input
                          value={getValue('festival_stat2_number')}
                          onChange={(e) => handleChange('festival_stat2_number', e.target.value)}
                          className="font-display text-lg"
                        />
                        <Label className="text-xs font-bold">Contador 2 - Texto</Label>
                        <Input
                          value={getValue('festival_stat2_label')}
                          onChange={(e) => handleChange('festival_stat2_label', e.target.value)}
                        />
                      </div>

                      <div className="rounded-2xl border border-[#181410]/10 bg-[#EDE2C6]/40 p-3 space-y-2">
                        <Label className="text-xs font-bold">Contador 3 - Número</Label>
                        <Input
                          value={getValue('festival_stat3_number')}
                          onChange={(e) => handleChange('festival_stat3_number', e.target.value)}
                          className="font-display text-lg"
                        />
                        <Label className="text-xs font-bold">Contador 3 - Texto</Label>
                        <Input
                          value={getValue('festival_stat3_label')}
                          onChange={(e) => handleChange('festival_stat3_label', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 5: EDIÇÕES & GALERIA */}
              <TabsContent value="edicoes" className="space-y-6">
                <div className="border-b border-[#181410]/10 pb-4">
                  <h3 className="font-display text-xl uppercase">Textos de Edições & Galeria</h3>
                  <p className="text-xs text-[#686054]">
                    Títulos e chamadas que introduzem as edições e fotos na landing page.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#181410]/10 bg-[#EDE2C6]/30 p-4 space-y-4">
                    <h4 className="font-display text-sm uppercase text-[#181410]">
                      Seção Edições Anteriores
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-bold">Eyebrow</Label>
                        <Input
                          value={getValue('editions_eyebrow')}
                          onChange={(e) => handleChange('editions_eyebrow', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Título da Seção</Label>
                        <Input
                          value={getValue('editions_title')}
                          onChange={(e) => handleChange('editions_title', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Texto Lateral / Chamada (Editor Rico)</Label>
                      <RichTextEditor
                        value={getValue('editions_subtitle')}
                        onChange={(val) => handleChange('editions_subtitle', val)}
                        minHeight="100px"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#181410]/10 bg-[#EDE2C6]/30 p-4 space-y-4">
                    <h4 className="font-display text-sm uppercase text-[#181410]">
                      Seção Galeria de Memórias
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-bold">Eyebrow</Label>
                        <Input
                          value={getValue('gallery_eyebrow')}
                          onChange={(e) => handleChange('gallery_eyebrow', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Título da Galeria</Label>
                        <Input
                          value={getValue('gallery_title')}
                          onChange={(e) => handleChange('gallery_title', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 6: TRIBO (LEADS) */}
              <TabsContent value="tribo" className="space-y-6">
                <div className="border-b border-[#181410]/10 pb-4">
                  <h3 className="font-display text-xl uppercase">Formulário "Entre na Tribo"</h3>
                  <p className="text-xs text-[#686054]">
                    Chamada de captação de leads para pré-venda e comunidade exclusiva.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-bold">Eyebrow</Label>
                      <Input
                        value={getValue('tribo_eyebrow')}
                        onChange={(e) => handleChange('tribo_eyebrow', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Título da Chamada</Label>
                      <Input
                        value={getValue('tribo_title')}
                        onChange={(e) => handleChange('tribo_title', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">Texto de Apoio / Benefício (Editor Rico)</Label>
                    <RichTextEditor
                      value={getValue('tribo_description')}
                      onChange={(val) => handleChange('tribo_description', val)}
                      placeholder="Receba primeiro o lineup, pré-venda exclusiva..."
                    />
                  </div>

                  <div className="pt-2">
                    <ImageUploader
                      label="Banner de Fundo da Seção Tribo (Opcional)"
                      currentUrl={getImgUrl('tribo_banner')}
                      onFileSelect={(file) => handleFileSelect('tribo_banner', file)}
                      onClear={() => handleClearImage('tribo_banner')}
                      helperText="Substitui ou sobrepõe o verde floresta escuro da seção de cadastro."
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ABA 7: LOCAL & RODAPÉ */}
              <TabsContent value="rodape" className="space-y-6">
                <div className="border-b border-[#181410]/10 pb-4">
                  <h3 className="font-display text-xl uppercase">Localização, Sinais & Rodapé</h3>
                  <p className="text-xs text-[#686054]">
                    Cards de localização geográfica, links de redes e textos de copyright.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="rounded-2xl border border-[#181410]/10 bg-[#EDE2C6]/30 p-4 space-y-4">
                    <h4 className="font-display text-sm uppercase text-[#181410]">
                      Seção Sinais & Conecte-se
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-bold">Eyebrow</Label>
                        <Input
                          value={getValue('connect_eyebrow')}
                          onChange={(e) => handleChange('connect_eyebrow', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Título da Seção</Label>
                        <Input
                          value={getValue('connect_title')}
                          onChange={(e) => handleChange('connect_title', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#181410]/10 bg-[#EDE2C6]/30 p-4 space-y-4">
                    <h4 className="font-display text-sm uppercase text-[#181410]">
                      Card de Localização
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-bold">Eyebrow</Label>
                        <Input
                          value={getValue('location_eyebrow')}
                          onChange={(e) => handleChange('location_eyebrow', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Nome do Destino</Label>
                        <Input
                          value={getValue('location_title')}
                          onChange={(e) => handleChange('location_title', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Descrição Curta</Label>
                      <Input
                        value={getValue('location_description')}
                        onChange={(e) => handleChange('location_description', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-bold">Link Google Maps</Label>
                        <Input
                          value={getValue('location_maps_url')}
                          onChange={(e) => handleChange('location_maps_url', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Texto do Botão Maps</Label>
                        <Input
                          value={getValue('location_btn_label')}
                          onChange={(e) => handleChange('location_btn_label', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#181410]/10 bg-[#EDE2C6]/30 p-4 space-y-4">
                    <h4 className="font-display text-sm uppercase text-[#181410]">
                      Textos do Rodapé
                    </h4>
                    <div className="space-y-2">
                      <Label className="font-bold">Tagline do Festival</Label>
                      <Input
                        value={getValue('footer_tagline')}
                        onChange={(e) => handleChange('footer_tagline', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-bold">Data no Rodapé</Label>
                        <Input
                          value={getValue('footer_dates')}
                          onChange={(e) => handleChange('footer_dates', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Local no Rodapé</Label>
                        <Input
                          value={getValue('footer_place')}
                          onChange={(e) => handleChange('footer_place', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Copyright / Linha Final</Label>
                      <Input
                        value={getValue('footer_copyright')}
                        onChange={(e) => handleChange('footer_copyright', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end border-t border-[#181410]/10 pt-5">
              <Button
                onClick={handleSaveAll}
                disabled={saving || loading}
                className="h-12 rounded-full bg-[#E8622C] px-8 font-bold text-white shadow-warm hover:bg-[#C94F1E]"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" /> Salvando alterações...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" /> Salvar Conteúdo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Painel de Preview ao Vivo (Opcional lado a lado) */}
        {showLivePreview && (
          <div className="sticky top-24 hidden h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-3xl border border-[#181410]/20 bg-white shadow-2xl lg:flex">
            <div className="flex items-center justify-between border-b border-[#181410]/10 bg-[#EDE2C6] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-yellow-400" />
                <span className="size-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-bold uppercase tracking-wider text-[#181410]">
                  Prévia da Landing Page
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => {
                  const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.location.reload()
                  }
                }}
              >
                <RefreshCw className="size-3.5 mr-1" /> Atualizar
              </Button>
            </div>
            <div className="flex-1 bg-white">
              <iframe
                id="preview-iframe"
                src="/"
                title="Prévia da Landing Page"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}

function ColorField({
  label,
  help,
  value,
  onChange,
  defaultColor,
}: {
  label: string
  help?: string
  value: string
  onChange: (val: string) => void
  defaultColor: string
}) {
  const current = value || defaultColor
  return (
    <div className="space-y-2">
      <Label className="font-bold text-[#181410]">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={current}
            onChange={(e) => onChange(e.target.value)}
            className="size-11 cursor-pointer rounded-xl border border-[#181410]/20 bg-transparent p-1"
          />
        </div>
        <Input
          value={current}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono uppercase rounded-xl max-w-[130px]"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-xs text-[#686054] hover:bg-black/5"
          onClick={() => onChange(defaultColor)}
          title="Restaurar padrão"
        >
          <Undo2 className="size-3.5 mr-1" /> Padrão
        </Button>
      </div>
      {help && <p className="text-[11px] text-[#6d6559]">{help}</p>}
    </div>
  )
}
