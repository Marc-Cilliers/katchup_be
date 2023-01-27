import { prisma } from '../prisma/client'
import axios from 'axios'
import { Console } from '../utils'

// AUTH METHODS
// ------------------------------------->
const AUTH_ERROR_CODES = [401, 403]

const wrap = (fn: (...args: any[]) => any) => {
  const wrapper = async (...args) => {
    let attemptCount = 0
    try {
      const res = await fn(...args)
      Console.log(`Twitch function call success!`, fn.name)
      return res
    } catch (err) {
      const shouldReattempt =
        AUTH_ERROR_CODES.includes(err.response.status) && attemptCount < 1
      if (!shouldReattempt) return

      await authorize()
      attemptCount++
      return await wrapper(...args)
    }
  }

  return wrapper
}

export const authorize = async () => {
  const res = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
    params: {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    },
  })
  const creds = await getTwitchCredentials()
  await prisma.twitch.update({
    where: { id: creds.id },
    data: { access_token: res.data.access_token },
  })

  return true
}

export const getTwitchCredentials = async () => {
  const info = await prisma.twitch.findFirst()
  if (info) return info

  return await prisma.twitch.create({
    data: { access_token: '', auth_token: '', refresh_token: '' },
    select: {
      access_token: true,
      refresh_token: true,
      auth_token: true,
      id: true,
    },
  })
}

const getHeaders = async () => {
  const creds = await getTwitchCredentials()
  return {
    'Client-ID': process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${creds.access_token}`,
    'Content-Type': 'application/json',
  }
}

//<-------------------------------------

interface UserInfo {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  created_at: string //ISO
}

const getUserInfo = async (username: string): Promise<UserInfo> => {
  const headers = await getHeaders()
  const res = await axios.get(
    `https://api.twitch.tv/helix/users?login=${username}`,
    { headers },
  )
  return res.data.data[0]
}

interface ChannelInfo {
  broadcaster_id: string
  broadcaster_login: string
  broadcaster_name: string
  broadcaster_language: string
  game_id: string
  game_name: string
  title: string
  delay: number
  tags: string[]
}

const getChannelInfo = async (broadcasterId: string): Promise<ChannelInfo> => {
  const headers = await getHeaders()

  const res = await axios.get(
    `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`,
    { headers },
  )
  return res.data.data[0]
}

type Badges = Record<string, string>

const getSubscriberBadges = async (broadcasterId: string): Promise<Badges> => {
  const headers = await getHeaders()

  const badges: Badges = {}
  const res = await axios.get(
    `https://api.twitch.tv/helix/chat/badges?broadcaster_id=${broadcasterId}`,
    { headers },
  )
  const set = res.data.data.find((d) => d.set_id === 'subscriber')
  if (!set) return {}

  for (const version of set.versions) {
    badges[version.id] = version.image_url_4x
  }

  return badges
}

const getSubscriberBadgesFromUsername = async (
  username: string,
): Promise<Badges> => {
  const userInfo = await getUserInfo(username)
  const subBadges = await getSubscriberBadges(userInfo.id)
  return subBadges
}

export const TwitchAPI = {
  getUserInfo: wrap(getUserInfo),
  getChannelInfo: wrap(getChannelInfo),
  getSubscriberBadges: wrap(getSubscriberBadges),
  getSubscriberBadgesFromUsername: wrap(getSubscriberBadgesFromUsername),
}
