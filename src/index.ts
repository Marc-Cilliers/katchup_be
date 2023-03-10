import { utils } from './server/helpers/utils'
import fastify from 'fastify'
import pino from 'pino'
import botRouter from './server/routes/bot.router'
import { KatchupBot } from './bot'
import { Console } from './utils'

const port = 8080

const startServer = async () => {
  try {
    const server = fastify({
      logger: pino({ level: 'info' }),
    })
    server.register(require('fastify-formbody'))
    server.register(require('fastify-cors'))
    server.register(require('fastify-helmet'))
    server.register(botRouter, { prefix: '/api/bot' })
    server.setErrorHandler((error, request, reply) => {
      server.log.error(error)
    })
    server.get('/', (request, reply) => {
      reply.send({ name: 'fastify-typescript' })
    })
    server.get('/health-check', async (request, reply) => {
      try {
        await utils.healthCheck()
        reply.status(200).send()
      } catch (e) {
        reply.status(500).send()
      }
    })

    Console.init(server.log)
    KatchupBot.connect()

    await server.listen(port, '0.0.0.0')
  } catch (e) {
    console.error(e)
  }
}

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

startServer()
