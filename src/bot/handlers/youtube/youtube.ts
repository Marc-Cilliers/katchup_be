import { prisma } from '../../../prisma/client'
import { HandlerArgs } from '../../types'
import {
  createYoutubeVideos,
  getChatterAndUpdate,
  findUserByName,
} from '../../../prisma/helpers'
import { VideoInfo, YoutubeAPI } from '../../../apis'
import { MessengerAPI } from '../../../apis/messenger'
import { extractLinks } from '../utils/extractLinks'
import { extractIds, LinkWithId, YOUTUBE_URL_REGEX } from '../utils/extractIds'
import { isBot } from '../../helpers/'
import { Console } from '../../../utils'

export const youtube = async (args: HandlerArgs) => {
  if (isBot(args)) return
  if (!YOUTUBE_URL_REGEX.test(args.msg)) return

  addYoutubeVideo(args)
}

async function addYoutubeVideo({
  state,
  channel,
  msg,
  timestamp,
}: HandlerArgs) {
  const user = await findUserByName(channel)
  const links = extractLinks(msg)

  const youtubeLinks = extractIds(links, true)
  const uniqueYoutubeLinks = await removeDuplicateYoutubeLinks(
    youtubeLinks,
    user.id,
  )

  if (!uniqueYoutubeLinks.length) {
    Console.log('No unique youtube links found, returning...')
    return
  }

  const videoPromises = uniqueYoutubeLinks.map((link) => getVideoInfo(link))
  const chatterPromise = getChatterAndUpdate(state, user.id)

  const [youtubeVideos, userChatter] = await Promise.all([
    Promise.all(videoPromises),
    chatterPromise,
  ])

  const videos = await createYoutubeVideos({
    videos: youtubeVideos,
    userChatterId: userChatter.id,
    timestamp,
  })

  Console.log('Notifying Katchup user', user.name)

  MessengerAPI.sendMessage({
    user: user.name,
    pipe: 'youtube',
    event: 'newVideo',
    payload: { videos, timestamp, userChatter },
  })
}

const getVideoInfo = async (
  link: LinkWithId,
): Promise<VideoInfo | { url: string }> => {
  const videoInfo = await YoutubeAPI.getVideoInfo(link.videoId)
  if (videoInfo) return { ...videoInfo, url: link.url }

  return { url: link.url }
}

const removeDuplicateYoutubeLinks = async (
  youtubeLinks: LinkWithId[],
  userId: string,
) => {
  const existingVideos = await prisma.youtubeVideo.findMany({
    where: {
      videoId: { in: youtubeLinks.map((l) => l.videoId) },
      archived: null,
      userChatter: {
        userId,
      },
    },
  })

  const existingVideoIds = existingVideos.map((v) => v.videoId)

  return youtubeLinks.filter((link) => !existingVideoIds.includes(link.videoId))
}
