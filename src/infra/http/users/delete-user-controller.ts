import { DeleteUserUseCase } from '@/domain/application/use-cases/delete-user'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'

import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'
import { verifyToken } from '../middleware/verify-token'

import z from 'zod'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

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
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const deleteUserUseCase = new DeleteUserUseCase(usersRepository)

  const editUserController = new DeleteUserController(deleteUserUseCase)

  app.delete(
    '/users/:userId',
    {
      preHandler: verifyToken,

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
