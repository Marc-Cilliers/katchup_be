import { HandlerArgs } from '../types'
import { youtube } from './youtube'

const HANDLERS = [youtube]

export const passToHandlers = async (args: HandlerArgs) => {
  for (const handler of HANDLERS) {
    handler(args)
  }
}
