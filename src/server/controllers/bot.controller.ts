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

    KatchupBot.joinChannel(channel)
    reply.status(STANDARD.SUCCESS).send()
  } catch (e) {
    handleServerError(reply, e)
  }
}
