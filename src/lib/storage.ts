// Simple in-memory storage for demo (replace with database in production)
export const links = new Map<string, { 
  originalUrl: string; 
  clicks: number; 
  createdAt: string 
}>()

export function addLink(shortId: string, originalUrl: string) {
  links.set(shortId, {
    originalUrl,
    clicks: 0,
    createdAt: new Date().toISOString()
  })
}

export function getLink(shortId: string) {
  return links.get(shortId)
}

export function incrementClicks(shortId: string) {
  const link = links.get(shortId)
  if (link) {
    link.clicks += 1
    links.set(shortId, link)
  }
  return link
}
