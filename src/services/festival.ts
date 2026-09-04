import pb from '@/lib/pocketbase/client'
import type { Edition, FestivalLink, FestivalMedia, Lead } from '@/types/festival'

export const getFileUrl = (
  record: { id: string; collectionId?: string; collectionName?: string },
  file?: string,
  thumb?: string,
) => {
  if (!file) return ''
  return pb.files.getURL(record, file, thumb ? { thumb } : undefined)
}

export async function listEditions() {
  return (await pb.collection('editions').getFullList({ sort: '-year' })) as unknown as Edition[]
}

export async function getEdition(id: string) {
  return (await pb.collection('editions').getOne(id)) as unknown as Edition
}

export async function listMedia(editionId?: string, limit?: number) {
  if (limit) {
    const result = await pb.collection('media').getList(1, limit, {
      sort: '-created,sort_order',
      filter: editionId ? pb.filter('edition = {:edition}', { edition: editionId }) : undefined,
    })
    return result.items as unknown as FestivalMedia[]
  }
  return (await pb.collection('media').getFullList({
    sort: 'sort_order,created',
    filter: editionId ? pb.filter('edition = {:edition}', { edition: editionId }) : undefined,
  })) as unknown as FestivalMedia[]
}

export async function listLinks(includeInactive = false) {
  return (await pb.collection('links').getFullList({
    sort: 'sort_order',
    filter: includeInactive ? undefined : 'active = true',
  })) as unknown as FestivalLink[]
}

export async function createLead(data: Omit<Lead, 'id' | 'created'>) {
  return pb.collection('leads').create(data)
}

export async function listLeads() {
  return (await pb.collection('leads').getFullList({ sort: '-created' })) as unknown as Lead[]
}

export { pb }
