export type Edition = {
  id: string
  title: string
  year: number
  description: string
  stats_public?: string
  cover?: string
  created: string
  updated: string
}

export type FestivalMedia = {
  id: string
  edition: string
  file: string
  type: 'image' | 'video'
  caption?: string
  sort_order: number
  created: string
}

export type FestivalLink = {
  id: string
  label: string
  url: string
  icon: 'whatsapp' | 'instagram' | 'ticket' | 'map' | 'email'
  highlight: boolean
  active: boolean
  sort_order: number
}

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  source: 'landing' | 'whatsapp' | 'instagram' | 'tickets'
  interest?: 'ingresso' | 'lineup' | 'experiencia' | 'parceria'
  consent: boolean
  created: string
}
