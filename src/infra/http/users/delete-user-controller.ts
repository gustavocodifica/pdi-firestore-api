import { DeleteUserUseCase } from '@/domain/application/use-cases/users/delete-user'
import { ResourceNotFoundError } from '@/domain/application/use-cases/users/errors/resource-not-found-error'

import { auth } from '@/infra/database/firestore/firestore'

import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'
import { FastifyVerifyTokenMiddleware } from '../middleware/verify-token'
import { makeDeleteUserUseCase } from '../factories/users/make-delete-user-use-case'
import { FirebaseAuthService } from '../auth/firebase-auth-service'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import z from 'zod'

export class DeleteUserController implements FastifyController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      userId: z.string(),
    })

    try {
      const { userId } = paramsSchema.parse(request.params)

      await this.deleteUserUseCase.execute({
        userId,
      })

      return reply.status(204).send()
    } catch (error) {
      console.log(error)

      if (error instanceof ResourceNotFoundError) {
        throw new ClientError(error.message)
      }

      throw error
    }
  }
}

export async function deleteUser(app: FastifyInstance) {
  const deleteUserUseCase = makeDeleteUserUseCase()

  const editUserController = new DeleteUserController(deleteUserUseCase)

  const authService = new FirebaseAuthService(auth)
  const verifyTokenMiddleware = new FastifyVerifyTokenMiddleware(authService)

  app.delete(
    '/users/:userId',
    {
      preHandler: verifyTokenMiddleware.handle(),
      schema: {
        summary: 'Delete a user',
        description: 'Access granted only when a valid token is provided.',
        tags: ['users'],
        params: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'string' },
          },
        },
        response: {
          204: {
            type: 'object',
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },

        security: [
          {
            BearerAuth: [],
          },
        ],
      },
    },
    async (request, reply) => {
      await editUserController.handle(request, reply)
    },
  )
}
