import { HandlerArgs } from '../types'

const KNOWN_BOTS = ['streamelements', 'nightbot', 'fossabot']

export type IsBotArgs = Pick<HandlerArgs, 'state'>

export const isBot = (args: IsBotArgs) => {
  return KNOWN_BOTS.includes(args.state.username.toLowerCase())
}
