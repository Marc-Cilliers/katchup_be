import tmi from 'tmi.js'

import { passToHandlers } from './handlers'
import { prisma } from '../prisma/client'
import { DateTime } from 'luxon'
import { MessengerAPI, TwitchAPI } from '../apis'
import { Console } from '../utils'
import { updateUserBadges } from '../prisma/helpers'

let reattemptConnect = false

const opts = {
  identity: {
    username: 'katchup_bot',
    password: process.env.CHATBOT_TOKEN,
  },
}

const client = tmi.client(opts)

const connectToUsers = async () => {
  const users = await prisma.user.findMany()

  for (const user of users) {
    client.join(user.name)
    MessengerAPI.createChannel({ user: user.name, pipe: 'youtube' })
  }
}

const handleMessage = async (channel, state, msg, self) => {
  const timestamp = DateTime.utc().toISO()
  channel = channel[0] === '#' ? channel.substring(1) : channel

  passToHandlers({ channel, state, msg, self, timestamp })
}

const joinChannel = (channel) => {
  try {
    client.join(channel)
    MessengerAPI.createChannel({ user: channel, pipe: 'youtube' })
  } catch (err) {
    Console.error('❌ Error joining channel: ', err)
  }
}

const connect = () => {
  // Connect to Twitch
  client.connect()
  reattemptConnect = true
  setTimeout(() => {
    if (reattemptConnect) {
      Console.log('Re-attempting katchup_bot connect...')
      client.connect()
    }
  }, 2500)
}

client.on('message', async (channel, state, msg, self) => {
  Console.log('✉️ Message received', { channel, state, msg, self })
  handleMessage(channel, state, msg, self)
})

client.on('serverchange', async (channel) => {
  Console.log('🖥 Twitch server change has occured', { channel })
})

client.on('disconnected', async (reason) => {
  Console.log('❌ Twitch client disconnected', { reason })
  client.connect()
})

client.on('action', async (channel, state, msg, self) => {
  Console.log('⚡️ Twitch action occured', { channel, state, msg, self })
})

client.on('connected', async (address, port) => {
  reattemptConnect = false

  Console.log('🔗 Twitch client connected', { address, port })
  connectToUsers()
})

client.on('part', async (channel) => {
  Console.log('⎋ Channel parted attempting to rejoin...', { channel })
  await client.join(channel)
})

client.on('join', async (channel, username, self) => {
  if (!self) return
  channel = channel[0] === '#' ? channel.substring(1) : channel

  Console.log('✅ Channel joined', { channel, username, self })

  const badges = await TwitchAPI.getSubscriberBadgesFromUsername(channel)
  await updateUserBadges({ badges, username: channel })
  Console.log('🚀 Channel badges fetched!', { channel })
})

interface KatchupBot {
  connect: () => void
  joinChannel: (channel: string) => void
}

export const KatchupBot: KatchupBot = {
  connect,
  joinChannel,
}
