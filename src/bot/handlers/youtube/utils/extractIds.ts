const YOUTUBE_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/

export const extractIds = (links: string[]) => {
  return links
    .map((link) => {
      const matches = link.match(YOUTUBE_URL_REGEX)
      return matches ? matches[1] : undefined
    })
    .filter((l) => !!l)
}
