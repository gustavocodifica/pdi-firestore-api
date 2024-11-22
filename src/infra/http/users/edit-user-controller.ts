import { EditUserUseCase } from '@/domain/application/use-cases/edit-user'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'

import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'
import { verifyToken } from '../middleware/verify-token'
import { UserPresenter } from '../presenters/user-presenter'

import z from 'zod'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export class EditUserController implements FastifyController {
  constructor(private editUserUseCase: EditUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      userId: z.string(),
    })

    const bodySchema = z.object({
      name: z.string(),
      lastName: z.string(),
    })

    try {
      const { userId } = paramsSchema.parse(request.params)

      const { name, lastName } = bodySchema.parse(request.body)

      const response = await this.editUserUseCase.execute({
        userId,
        name,
        lastName,
      })

      const user = UserPresenter.toHTTP(response.user)

      return reply.send({
        user,
      })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new ClientError(error.message)
      }

      throw error
    }
  }
}

export async function editUser(app: FastifyInstance) {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const editUserUseCase = new EditUserUseCase(usersRepository)

  const editUserController = new EditUserController(editUserUseCase)

  app.put(
    '/users/:userId',
    {
      preHandler: verifyToken,
      schema: {
        summary: 'Update a user',
        description: 'Access granted only when a valid token is provided.',
        tags: ['users'],
        params: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
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
