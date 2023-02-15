export const TWITCH_CLIP_REGEX = /(?:https:\/\/)?clips\.twitch\.tv\/(\S+)/i

export interface LinkWithId {
  clipId: string
  url: string
}

export const extractClips = (links: string[], unique = false): LinkWithId[] => {
  const uniqueLinks: LinkWithId[] = []

  for (const link of links) {
    const matches = link.match(TWITCH_CLIP_REGEX)
    const clipId = matches ? matches[1] : undefined

    if (!clipId) continue
    if (unique && uniqueLinks.find((l) => l.clipId === clipId)) continue

    uniqueLinks.push({ clipId, url: link })
  }

  return uniqueLinks
}
