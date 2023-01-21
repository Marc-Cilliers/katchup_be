import { getUrls } from '../../utils/getUrls'
import { prisma } from '../../prisma/client'
import { HandlerArgs } from '../types'
import {
  createYoutubeVideos,
  findOrCreateChatterFrom,
  findUserByName,
} from '../../prisma/helpers'
import { VideoInfo, YoutubeAPI } from '../../apis'
import { MessengerAPI } from '../../apis/messenger'

const YOUTUBE_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/

const youtube = async (args: HandlerArgs) => {
  if (!YOUTUBE_URL_REGEX.test(args.msg)) return

  addYoutubeVideo(args)
}

async function addYoutubeVideo({
  state,
  channel,
  msg,
  timestamp,
}: HandlerArgs) {
  const username = state['display-name']
  const user = await findUserByName(channel)
  const youtubeLinks = extractLinks(msg)
  const uniqueLinks = await removeDuplicateLinks(youtubeLinks, user.id)
  if (!uniqueLinks.length) return

  const videoPromises = uniqueLinks.map((l) => getVideoInfo(l))
  const chatterPromise = findOrCreateChatterFrom.username(username)

  const [youtubeVideos, chatter] = await Promise.all([
    Promise.all(videoPromises),
    chatterPromise,
  ])

  const videos = await createYoutubeVideos({
    videos: youtubeVideos,
    chatterId: chatter.id,
    timestamp,
    userId: user.id,
  })

  MessengerAPI.sendMessage({
    user: user.name,
    pipe: 'youtube',
    event: 'newVideo',
    payload: { videos, timestamp, chatter },
  })
}

const getVideoInfo = async (
  link: string,
): Promise<VideoInfo | { url: string }> => {
  const matches = link.match(YOUTUBE_URL_REGEX)
  if (matches) {
    const videoId = matches[1]
    const videoInfo = await YoutubeAPI.getVideoInfo(videoId)

    return { ...videoInfo, url: link }
  }

  return { url: link }
}

const extractLinks = (msg) => {
  const urls = getUrls(msg)
  return Array.from(urls)
}

const removeDuplicateLinks = async (links, userId) => {
  const existingVideos = await prisma.youtubeVideo.findMany({
    where: { url: { in: links }, archived: null, userId },
  })

  const existingLinks = existingVideos.map((v) => v.url)

  return links.filter((l) => !existingLinks.includes(l))
}

export default youtube
