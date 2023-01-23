import tmi from 'tmi.js'

import { passToHandlers } from './handlers'
import { prisma } from '../prisma/client'
import { DateTime } from 'luxon'
import { MessengerAPI } from '../apis'
import { Logger } from 'pino'

let reattemptConnect = false
let logger: Logger<{ level: string }>

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
    logger.info(`Channel joined: ${user.name}`)

    MessengerAPI.createChannel({ user: user.name, pipe: 'youtube' })
  }
}

const handleMessage = async (channel, state, msg, self) => {
  const timestamp = DateTime.utc().toISO()
  channel = channel[0] === '#' ? channel.substring(1) : channel

  logger.info(`Message received from ${channel}: `, msg)
  passToHandlers({ channel, state, msg, self, timestamp, logger })
}

const joinChannel = (channel) => {
  try {
    client.join(channel)
  } catch (err) {
    console.log('❌ Error joining channel: ', err)
  }
}

const connect = (loggingInstance: Logger<{ level: string }>) => {
  logger = loggingInstance

  // Connect to Twitch
  client.connect()
  reattemptConnect = true
  setTimeout(() => {
    if (reattemptConnect) {
      logger.info('Re- ttempting katchup_bot connect...')
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
  logger.info(`Channel parted, rejoined: ${channel}`)
})

interface KatchupBot {
  connect: (logger: Logger<{ level: string }>) => void
  joinChannel: (channel: string) => void
}

export const KatchupBot: KatchupBot = {
  connect,
  joinChannel,
}
