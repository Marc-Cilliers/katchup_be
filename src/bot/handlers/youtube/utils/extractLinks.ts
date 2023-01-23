import { getUrls } from '../../../../utils/getUrls'

export const extractLinks = (msg: string): string[] => {
  const urls = getUrls(msg)
  return Array.from(urls) as string[]
}
