import { prisma } from '../client'
import { v4 as uuid4 } from 'uuid'
import { ClipInfo } from 'apis'

interface CreateTwitchClipsProps {
  clips: ClipInfo[]
  userChatterId: string
  timestamp: string
}

type PartialTwitchClip = {
  id: string
  thumbnail: string
  userChatterId: string
  timestamp: string
  url: string
  title: string
  duration: number
  clipId: string
  broadcasterId: string
  broadcasterName: string
  creatorId: string
  creatorName: string
  gameId: string
  language: string
  viewCount: number
  createdAt: string
}

export const createTwitchClips = async ({
  clips,
  userChatterId,
  timestamp,
}: CreateTwitchClipsProps): Promise<PartialTwitchClip[]> => {
  const twitchClips: PartialTwitchClip[] = clips
    .filter((v) => !!v)
    .map((v) => {
      return {
        id: uuid4(),
        userChatterId,
        timestamp,
        url: v.url,
        title: v.title,
        duration: v.duration,
        clipId: v.id,
        broadcasterId: v.broadcaster_id,
        broadcasterName: v.broadcaster_name,
        creatorId: v.creator_id,
        creatorName: v.creator_name,
        gameId: v.game_id,
        language: v.language,
        viewCount: v.view_count,
        createdAt: v.created_at,
        thumbnail: v.thumbnail_url,
      }
    })

  await prisma.twitchClip.createMany({
    data: twitchClips,
  })

  return twitchClips
}
