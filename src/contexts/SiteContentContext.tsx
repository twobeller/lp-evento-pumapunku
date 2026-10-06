import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { listSiteContent, getFileUrl } from '@/services/festival'
import type { SiteContentItem } from '@/types/festival'

// Valores padrão imutáveis de fallback caso o banco esteja indisponível ou vazio
export const DEFAULT_CONTENT: Record<string, string> = {
  // Cores & Fontes
  theme_color_bg: '#F2E9D3',
  theme_color_text: '#181410',
  theme_color_primary: '#E8622C',
  theme_color_secondary: '#2E6B4F',
  theme_color_gold: '#C9962E',
  theme_font_display: 'Archivo Black',

  // Hero
  hero_badge: '04 & 05 Julho · São Thomé das Letras – MG',
  hero_title_line1: 'Puma Punku',
  hero_title_line2: 'Festival 2026',
  hero_subtitle:
    'Dois dias entre montanhas, música e mistério. Atravesse o portal para uma experiência que pulsa além da pista.',
  hero_btn_primary_label: 'Garantir meu lugar',
  hero_btn_primary_url: '#contato',
  hero_btn_secondary_label: 'Ver edições passadas',
  hero_btn_secondary_url: '#edicoes',
  hero_bg_banner: '',

  // Marquee
  marquee_text: 'PUMA PUNKU FESTIVAL ✦ 04 & 05 JULHO 2026 ✦ SÃO THOMÉ DAS LETRAS ✦',

  // O Festival
  festival_eyebrow: 'O festival',
  festival_title: 'Onde a pista encontra o extraordinário.',
  festival_description:
    'No alto das montanhas de São Thomé, o Puma Punku abre um portal para dois dias de música eletrônica, arte, natureza e conexão. Uma celebração que nasce da terra, atravessa a madrugada e fica para sempre.',
  festival_pill_1: 'Imersão na natureza',
  festival_pill_2: 'Arte & ancestralidade',
  festival_stat1_number: '24',
  festival_stat1_label: 'horas de música',
  festival_stat2_number: '03',
  festival_stat2_label: 'palcos vivos',
  festival_stat3_number: '04',
  festival_stat3_label: 'edições realizadas',

  // Edições Anteriores
  editions_eyebrow: 'Nossa história',
  editions_title: 'Edições anteriores',
  editions_subtitle: 'Cada edição, um novo portal.\nReviva os capítulos da nossa história.',

  // Galeria
  gallery_eyebrow: 'Memórias da pista',
  gallery_title: 'Você precisa sentir.',

  // Tribo / Leads
  tribo_eyebrow: 'Faça parte desde agora',
  tribo_title: 'Entre na tribo',
  tribo_description:
    'Receba primeiro o lineup, pré-venda exclusiva e condições especiais de ingresso.',
  tribo_banner: '',

  // Conexão
  connect_eyebrow: 'Conecte-se',
  connect_title: 'Siga os sinais',

  // Localização
  location_eyebrow: 'O destino',
  location_title: 'São Thomé das Letras · MG',
  location_description: 'Montanhas, misticismo e uma vista inesquecível.',
  location_maps_url: 'https://maps.google.com/?q=São+Thomé+das+Letras+MG',
  location_btn_label: 'Abrir no Google Maps',

  // Rodapé
  footer_tagline: 'Música, natureza e ancestralidade em uma experiência além da pista.',
  footer_dates: '04 & 05 JULHO',
  footer_place: 'São Thomé das Letras · MG',
  footer_copyright: 'Puma Punku Festival · 04 & 05 Julho 2026 · São Thomé das Letras – MG',
}

export type SiteContentMap = Record<string, string>

interface SiteContentContextType {
  content: SiteContentMap
  rawItems: SiteContentItem[]
  loading: boolean
  reload: () => Promise<void>
  getText: (key: string, fallback?: string) => string
  getImageUrl: (key: string, fallback?: string) => string
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: DEFAULT_CONTENT,
  rawItems: [],
  loading: false,
  reload: async () => {},
  getText: (key, fallback) => fallback || DEFAULT_CONTENT[key] || '',
  getImageUrl: (_key, fallback) => fallback || '',
})

// Fontes disponíveis prontas para uso com Google Fonts injetadas
export const AVAILABLE_DISPLAY_FONTS = [
  { label: 'Archivo Black (Padrão)', value: 'Archivo Black', googleFont: 'Archivo+Black' },
  { label: 'Syne (Vanguardista / Techno)', value: 'Syne', googleFont: 'Syne:wght@800;900' },
  {
    label: 'Cinzel Decorative (Místico / Ancestral)',
    value: 'Cinzel Decorative',
    googleFont: 'Cinzel+Decorative:wght@700;900',
  },
  {
    label: 'Cabinet Grotesk (Display Moderno)',
    value: 'Cabinet Grotesk',
    googleFont: 'Cabinet+Grotesk:wght@800;900',
  },
  {
    label: 'Clash Display (Geométrico / Festival)',
    value: 'Clash Display',
    googleFont: 'Clash+Display:wght@700',
  },
  { label: 'Righteous (Retrofuturista)', value: 'Righteous', googleFont: 'Righteous' },
  {
    label: 'Unbounded (Eletrônica / Futurista)',
    value: 'Unbounded',
    googleFont: 'Unbounded:wght@800;900',
  },
  { label: 'Bebas Neue (Condensado Bold)', value: 'Bebas Neue', googleFont: 'Bebas+Neue' },
  { label: 'Anton (Impactante Pesado)', value: 'Anton', googleFont: 'Anton' },
]

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [rawItems, setRawItems] = useState<SiteContentItem[]>([])
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    try {
      const items = await listSiteContent()
      setRawItems(items)
    } catch (err) {
      console.warn('Não foi possível carregar site_content, usando fallback local:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  // Mapa com chaves -> valor final (ou url do arquivo se houver image_file)
  const { contentMap, imageUrlMap } = useMemo(() => {
    const cMap: Record<string, string> = { ...DEFAULT_CONTENT }
    const imgMap: Record<string, string> = {}

    for (const item of rawItems) {
      if (item.value !== undefined && item.value !== null && item.value !== '') {
        cMap[item.key] = item.value
      }
      if (item.image_file) {
        const url = getFileUrl(item, item.image_file)
        if (url) {
          imgMap[item.key] = url
          cMap[item.key] = url
        }
      } else if (
        item.value &&
        (item.value.startsWith('http://') ||
          item.value.startsWith('https://') ||
          item.value.startsWith('/'))
      ) {
        imgMap[item.key] = item.value
      }
    }
    return { contentMap: cMap, imageUrlMap: imgMap }
  }, [rawItems])

  // Aplica cores e fontes selecionadas no :root como CSS variables
  useEffect(() => {
    const root = document.documentElement
    const bg = contentMap.theme_color_bg || DEFAULT_CONTENT.theme_color_bg
    const text = contentMap.theme_color_text || DEFAULT_CONTENT.theme_color_text
    const primary = contentMap.theme_color_primary || DEFAULT_CONTENT.theme_color_primary
    const secondary = contentMap.theme_color_secondary || DEFAULT_CONTENT.theme_color_secondary
    const gold = contentMap.theme_color_gold || DEFAULT_CONTENT.theme_color_gold
    const displayFont = contentMap.theme_font_display || DEFAULT_CONTENT.theme_font_display

    root.style.setProperty('--color-site-bg', bg)
    root.style.setProperty('--color-site-text', text)
    root.style.setProperty('--color-site-primary', primary)
    root.style.setProperty('--color-site-secondary', secondary)
    root.style.setProperty('--color-site-gold', gold)
    root.style.setProperty('--font-site-display', `'${displayFont}', system-ui, sans-serif`)

    // Se uma fonte customizada for escolhida, carrega via Google Fonts dinamicamente
    const fontDef = AVAILABLE_DISPLAY_FONTS.find((f) => f.value === displayFont)
    if (fontDef && fontDef.googleFont) {
      const linkId = 'dynamic-google-font'
      let linkEl = document.getElementById(linkId) as HTMLLinkElement | null
      if (!linkEl) {
        linkEl = document.createElement('link')
        linkEl.id = linkId
        linkEl.rel = 'stylesheet'
        document.head.appendChild(linkEl)
      }
      linkEl.href = `https://fonts.googleapis.com/css2?family=${fontDef.googleFont}&display=swap`
    }
  }, [contentMap])

  const getText = (key: string, fallback?: string): string => {
    return contentMap[key] ?? fallback ?? DEFAULT_CONTENT[key] ?? ''
  }

  const getImageUrl = (key: string, fallback?: string): string => {
    return imageUrlMap[key] || contentMap[key] || fallback || ''
  }

  return (
    <SiteContentContext.Provider
      value={{
        content: contentMap,
        rawItems,
        loading,
        reload,
        getText,
        getImageUrl,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}
