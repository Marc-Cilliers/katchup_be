import axios from 'axios'

export interface VideoInfo {
  title: string
  channel: string
  thumbnail: string
  duration: string
  videoId: string
  url?: string
}

interface YoutubeAPI {
  getVideoInfo: (videoId: string) => Promise<VideoInfo>
}

export const getVideoInfo = async (videoId: string): Promise<VideoInfo> => {
  const res = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?key=${process.env.GOOGLE_KEY}&id=${videoId}&part=snippet,contentDetails`,
  )
  const info = res.data.items[0]

  const title = info.snippet.title
  const channel = info.snippet.channelTitle
  const thumbnail = info.snippet.thumbnails.default.url
  const duration = info.contentDetails.duration

  return { title, duration, channel, thumbnail, videoId }
}

export const YoutubeAPI: YoutubeAPI = {
  getVideoInfo,
}
