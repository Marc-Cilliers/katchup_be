import { Logger } from 'pino'

let LOGGER: Logger<{ level: string }>

const log = (msg: string, ...args: any[]) => {
  const extraArgs = args.map((arg) => {
    if (typeof arg === 'object') return JSON.stringify(arg)
    return arg
  })

  LOGGER.info(`${msg}: ${extraArgs.join('; ')}`)
}

const error = (msg: string, ...args: any[]) => {
  const extraArgs = args.map((arg) => {
    if (typeof arg === 'object') return JSON.stringify(arg)
    return arg
  })

  LOGGER.error(`${msg}: ${extraArgs.join('; ')}`)
}

const init = (logger: Logger<{ level: string }>) => {
  LOGGER = logger
}

interface Console {
  init: (logger: Logger<{ level: string }>) => void
  log: (msg: string, ...args: any[]) => void
  error: (msg: string, ...args: any[]) => void
}

export const Console = {
  init,
  log,
  error,
}
