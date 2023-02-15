import { HandlerArgs } from '../types'
import { youtube } from './youtube'
import { twitch } from './twitch'

const HANDLERS = [youtube, twitch]

export const passToHandlers = async (args: HandlerArgs) => {
  for (const handler of HANDLERS) {
    handler(args)
  }
}
