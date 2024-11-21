import { auth } from '@/infra/database/firestore/firestore'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const authHeader = request.headers['authorization']

    if (!authHeader) {
      return reply
        .status(401)
        .send({ message: 'Unauthorized: No token provided.' })
    }

    const [_, token] = authHeader.split(' ')

    if (!token) {
      return reply
        .status(401)
        .send({ message: 'Unauthorized: No token provided.' })
    }

    await auth.verifyIdToken(token)
  } catch (error) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
