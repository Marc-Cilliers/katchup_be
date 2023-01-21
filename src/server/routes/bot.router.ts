import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import * as controllers from '../controllers'
import { checkValidRequest } from '../helpers/auth'
import { joinChannelSchema } from '../schema'

const botRouter = (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  next: (err?: Error) => void,
) => {
  fastify.route({
    method: 'POST',
    url: '/joinChannel',
    schema: joinChannelSchema,
    preHandler: [checkValidRequest],
    handler: controllers.joinChannel,
  })

  next()
}

export default botRouter
