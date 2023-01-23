import { HandlerArgs } from 'bot/types'

const KNOWN_BOTS = ['streamelements', 'nightbot']

export type IsBotArgs = Pick<HandlerArgs, 'state' | 'logger'>

export const isBot = (args: IsBotArgs) => {
  const isBot = KNOWN_BOTS.includes(args.state.username.toLowerCase())
  args.logger.info(`isBot? ${isBot}`)

  return isBot
}
