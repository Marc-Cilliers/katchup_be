import { prisma } from '../../../prisma/client'
import { HandlerArgs } from '../../types'
import {
  createYoutubeVideos,
  findOrCreateChatterFrom,
  findUserByName,
} from '../../../prisma/helpers'
import { VideoInfo, YoutubeAPI } from '../../../apis'
import { MessengerAPI } from '../../../apis/messenger'
import { extractLinks } from './utils/extractLinks'
import { extractIds } from './utils/extractIds'

const YOUTUBE_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/

export const youtube = async (args: HandlerArgs) => {
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
  const videoIds = extractIds(youtubeLinks)

  const uniqueVideoIds = await removeDuplicateVideoIds(videoIds, user.id)
  if (!uniqueVideoIds.length) return

  const videoPromises = uniqueVideoIds.map((id, index) =>
    getVideoInfo(id, youtubeLinks[index]),
  )
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
  videoId: string,
  link: string,
): Promise<VideoInfo | { url: string }> => {
  const videoInfo = await YoutubeAPI.getVideoInfo(videoId)
  return { ...videoInfo, url: link }
}

const removeDuplicateVideoIds = async (videoIds, userId) => {
  const existingVideos = await prisma.youtubeVideo.findMany({
    where: { videoId: { in: videoIds }, archived: null, userId },
  })

  const existingVideoIds = existingVideos.map((v) => v.videoId)

  return videoIds.filter((id) => !existingVideoIds.includes(id))
}
