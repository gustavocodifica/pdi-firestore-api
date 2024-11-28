import { AuthService } from '../auth/auth-service'

import { FastifyReply, FastifyRequest } from 'fastify'

export class FastifyVerifyTokenMiddleware {
  constructor(private authService: AuthService) {}

  handle() {
    return async (
      request: FastifyRequest,
      reply: FastifyReply,
    ): Promise<void> => {
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

        await this.authService.verifyToken(token)
      } catch (error) {
        return reply.status(401).send({ message: 'Unauthorized.' })
      }
    }
  }
}
