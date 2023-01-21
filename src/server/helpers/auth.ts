import { FastifyRequest, FastifyReply } from 'fastify'
import { ERROR400 } from './constants'
import { base64decode } from 'nodejs-base64'

export const checkValidRequest = (
  request: FastifyRequest,
  reply: FastifyReply,
  done,
) => {
  try {
    // Simple auth, since it'll only ever be me calling this api
    const token = request.headers.authorization.replace('Bearer', '')
    const decodedToken = base64decode(token)

    const matches = decodedToken === process.env.SECRET_TOKEN
    if (matches) done()
    else {
      request.log.info(
        `Bad token (${decodedToken}) received from ${request.hostname}`,
      )
      return reply.code(ERROR400.statusCode).send(ERROR400)
    }
  } catch (e) {
    request.log.info('Error occured during token auth: ', e)
    return reply.code(ERROR400.statusCode).send(ERROR400)
  }
}
