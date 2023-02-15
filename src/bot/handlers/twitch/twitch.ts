import { prisma } from '../../../prisma/client'
import { HandlerArgs } from '../../types'
import {
  getChatterAndUpdate,
  findUserByName,
  createTwitchClips,
} from '../../../prisma/helpers'
import { ClipInfo, TwitchAPI } from '../../../apis'
import { MessengerAPI } from '../../../apis/messenger'
import { extractLinks } from '../utils/extractLinks'
import {
  extractClips,
  LinkWithId,
  TWITCH_CLIP_REGEX,
} from '../utils/extractClips'
import { isBot } from '../../helpers/'
import { Console } from '../../../utils'

export const twitch = async (args: HandlerArgs) => {
  if (isBot(args)) return
  if (!TWITCH_CLIP_REGEX.test(args.msg)) return

  addTwitchClip(args)
}

async function addTwitchClip({ state, channel, msg, timestamp }: HandlerArgs) {
  const user = await findUserByName(channel)
  const links = extractLinks(msg)

  const twitchClipLinks = extractClips(links, true)
  const uniqueTwitchClips = await removeDuplicateTwitchClips(
    twitchClipLinks,
    user.id,
  )

  if (!uniqueTwitchClips.length) {
    Console.log('No unique twitch clips found, returning...')
    return
  }

  const clipPromises = uniqueTwitchClips.map((link) => getClipInfo(link))
  const chatterPromise = getChatterAndUpdate(state, user.id)

  const [twitchClips, userChatter] = await Promise.all([
    Promise.all(clipPromises),
    chatterPromise,
  ])

  const clips = await createTwitchClips({
    clips: twitchClips,
    userChatterId: userChatter.id,
    timestamp,
  })

  Console.log('Notifying Katchup user', user.name)

  MessengerAPI.sendMessage({
    user: user.name,
    pipe: 'twitch',
    event: 'newClip',
    payload: { clips, timestamp, userChatter },
  })
}

const getClipInfo = async (link: LinkWithId): Promise<ClipInfo> => {
  const clipInfo = await TwitchAPI.getClipInfo(link.clipId)
  if (clipInfo) return { ...clipInfo, url: link.url }

  return undefined
}

const removeDuplicateTwitchClips = async (
  clipLinks: LinkWithId[],
  userId: string,
) => {
  const existingClips = await prisma.twitchClip.findMany({
    where: {
      clipId: { in: clipLinks.map((l) => l.clipId) },
      archived: null,
      userChatter: {
        userId,
      },
    },
  })

  const existingClipIds = existingClips.map((v) => v.clipId)

  return clipLinks.filter((link) => !existingClipIds.includes(link.clipId))
}
