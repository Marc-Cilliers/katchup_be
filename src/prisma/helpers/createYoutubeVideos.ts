import { YoutubeVideo } from '@prisma/client'
import { prisma } from '../client'
import { v4 as uuid4 } from 'uuid'

interface CreateYoutubeVideosProps {
  videos: Partial<YoutubeVideo>[]
  chatterId: string
  timestamp: string
  userId: string
}

type PartialYoutubeVideo = {
  id: string
  chatterId: string
  timestamp: string
  userId: string
  url: string
  title: string
  duration: string
  channel: string
  thumbnail: string
  videoId: string
}

export const createYoutubeVideos = async ({
  videos,
  chatterId,
  timestamp,
  userId,
}: CreateYoutubeVideosProps): Promise<PartialYoutubeVideo[]> => {
  const youtubeVideos: PartialYoutubeVideo[] = videos.map((v) => {
    return {
      id: uuid4(),
      chatterId,
      timestamp,
      userId,
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
