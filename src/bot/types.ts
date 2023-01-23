import { Logger } from 'pino'
import { ChatUserstate } from 'tmi.js'

export type HandlerArgs = {
  channel: string
  state: ChatUserstate
  msg: string
  self: boolean
  timestamp: string
  logger?: Logger<{ level: string }>
}
