import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { FetchUsersUseCase } from '@/domain/application/use-cases/fetch-users'

import { UserPresenter } from '../presenters/user-presenter'
import { FastifyController } from '../protocols/fastify-controller'
import { verifyToken } from '../middleware/verify-token'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export class FetchUsersController implements FastifyController {
  constructor(private fetchUsersUseCase: FetchUsersUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const response = await this.fetchUsersUseCase.execute()

      const users = response.users.map(user => UserPresenter.toHTTP(user))

      return reply.status(200).send({
        users,
      })
    } catch (error) {
      throw error
    }
  }
}

export async function fetchUsers(app: FastifyInstance) {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const fetchUsersUseCase = new FetchUsersUseCase(usersRepository)

  const fetchUsersController = new FetchUsersController(fetchUsersUseCase)

  app.get(
    '/users/',
    {
      preHandler: verifyToken,
      schema: {
        summary: 'Fetch users',
        description: 'Access granted only when a valid token is provided.',
        tags: ['users'],
        response: {
          200: {
            type: 'object',
            properties: {
              users: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    lastName: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
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
      await fetchUsersController.handle(request, reply)
    },
  )
}
