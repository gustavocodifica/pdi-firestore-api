import { FastifyInstance } from 'fastify'
import { ClientError } from './http/errors/client-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  })
}
