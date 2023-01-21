import tmi from 'tmi.js'

import { passToHandlers } from './handlers'
import { prisma } from '../prisma/client'
import { DateTime } from 'luxon'
import { MessengerAPI } from '../apis'

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

const joinChannel = async (channel): Promise<boolean> => {
  try {
    await client.join(channel)
    return true
  } catch (err) {
    return false
  }
}

const connect = () => {
  // Connect to Twitch
  client.connect()
  reattemptConnect = true
  setTimeout(() => {
    if (reattemptConnect) {
      console.log('🔃 Re-attempting katchup_bot connect...')
      client.connect()
    }
  }, 2500)
}

client.on('message', (channel, state, msg, self) =>
  handleMessage(channel, state, msg, self),
)

client.on('connected', () => {
  reattemptConnect = false

  connectToUsers()
})

client.on('part', (channel) => {
  void client.join(channel)
})

interface KatchupBot {
  connect: () => void
  joinChannel: (channel: string) => Promise<boolean>
}

export const KatchupBot: KatchupBot = {
  connect,
  joinChannel,
}
