import tmi from 'tmi.js'

import { passToHandlers } from './handlers'
import { prisma } from '../prisma/client'
import { DateTime } from 'luxon'
import { MessengerAPI } from '../apis'
import { Console } from '../utils'

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
    Console.log('Channel joined', user.name)

    MessengerAPI.createChannel({ user: user.name, pipe: 'youtube' })
  }
}

const handleMessage = async (channel, state, msg, self) => {
  const timestamp = DateTime.utc().toISO()
  channel = channel[0] === '#' ? channel.substring(1) : channel

  Console.log('Message received from ', channel, msg)
  passToHandlers({ channel, state, msg, self, timestamp })
}

const joinChannel = (channel) => {
  try {
    client.join(channel)
  } catch (err) {
    console.log('❌ Error joining channel: ', err)
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

client.on('message', (channel, state, msg, self) =>
  handleMessage(channel, state, msg, self),
)

client.on('connected', () => {
  reattemptConnect = false

  connectToUsers()
})

client.on('part', (channel) => {
  void client.join(channel)
  Console.log('Channel parted, rejoined', channel)
})

interface KatchupBot {
  connect: () => void
  joinChannel: (channel: string) => void
}

export const KatchupBot: KatchupBot = {
  connect,
  joinChannel,
}
