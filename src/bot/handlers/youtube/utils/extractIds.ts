const YOUTUBE_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/

export interface LinkWithId {
  videoId: string
  url: string
}

export const extractIds = (links: string[], unique = false): LinkWithId[] => {
  const uniqueLinks: LinkWithId[] = []

  for (const link of links) {
    const matches = link.match(YOUTUBE_URL_REGEX)
    const videoId = matches ? matches[1] : undefined
    if (!videoId) continue
    if (unique && uniqueLinks.find((l) => l.videoId === videoId)) continue

    uniqueLinks.push({ videoId, url: link })
  }

  return uniqueLinks
}
