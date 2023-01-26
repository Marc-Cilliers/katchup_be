import axios from 'axios'
import { Console } from '../utils'

export interface VideoInfo {
  title: string
  channel: string
  channelId: string
  thumbnail: string
  duration: string
  videoId: string
  url?: string
}

interface YoutubeAPI {
  getVideoInfo: (videoId: string) => Promise<VideoInfo>
}

export const getVideoInfo = async (videoId: string): Promise<VideoInfo> => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?key=${process.env.GOOGLE_KEY}&id=${videoId}&part=snippet,contentDetails`,
    )
    const info = res.data.items[0]

    const title = info.snippet.title
    const channel = info.snippet.channelTitle
    const channelId = info.snippet.channelId
    const thumbnail = info.snippet.thumbnails.default.url
    const duration = info.contentDetails.duration
    return { title, duration, channel, channelId, thumbnail, videoId }
  } catch (err) {
    Console.error('Error fetching video info', err)
    return undefined
  }
}

export const YoutubeAPI: YoutubeAPI = {
  getVideoInfo,
}
