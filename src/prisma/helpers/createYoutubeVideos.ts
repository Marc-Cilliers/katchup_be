import { YoutubeVideo } from '@prisma/client'
import { prisma } from '../client'
import { v4 as uuid4 } from 'uuid'

interface CreateYoutubeVideosProps {
  videos: Partial<YoutubeVideo>[]
  userChatterId: string
  timestamp: string
}

type PartialYoutubeVideo = {
  id: string
  userChatterId: string
  timestamp: string
  url: string
  title: string
  duration: string
  channel: string
  thumbnail: string
  videoId: string
}

export const createYoutubeVideos = async ({
  videos,
  userChatterId,
  timestamp,
}: CreateYoutubeVideosProps): Promise<PartialYoutubeVideo[]> => {
  const youtubeVideos: PartialYoutubeVideo[] = videos.map((v) => {
    return {
      id: uuid4(),
      userChatterId,
      timestamp,
      url: v.url,
      title: v.title,
      duration: v.duration,
      channel: v.channel,
      channelId: v.channelId,
      thumbnail: v.thumbnail,
      videoId: v.videoId,
    }
  })

  await prisma.youtubeVideo.createMany({
    data: youtubeVideos,
  })

  return youtubeVideos
}
