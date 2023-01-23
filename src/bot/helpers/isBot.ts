import { HandlerArgs } from 'bot/types'
import { Console } from '../../utils'

const KNOWN_BOTS = ['streamelements', 'nightbot']

export type IsBotArgs = Pick<HandlerArgs, 'state'>

export const isBot = (args: IsBotArgs) => {
  const isBot = KNOWN_BOTS.includes(args.state.username.toLowerCase())
  Console.log('isBot?', isBot)

  return isBot
}
