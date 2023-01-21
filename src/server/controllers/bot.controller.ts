import { KatchupBot } from '../../bot'
import { FastifyReply, FastifyRequest } from 'fastify'
import { STANDARD } from '../helpers/constants'
import { ERRORS, handleServerError } from '../helpers/errors'

export const joinChannel = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const channel = request.body['channel']

    const res = await KatchupBot.joinChannel(channel)

    if (res) {
      reply.status(STANDARD.SUCCESS).send()
    } else {
      request.log.info('Join channel request error: ', channel)
      handleServerError(reply, ERRORS.joinError)
    }
  } catch (e) {
    handleServerError(reply, e)
  }
}
