import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { FetchUsersByCompanyUseCase } from '@/domain/application/use-cases/users/fetch-users-by-company'

import { UserPresenter } from '../presenters/user-presenter'
import { FastifyController } from '../protocols/fastify-controller'

import { FirebaseAuthService } from '../auth/firebase-auth-service'
import { FastifyVerifyTokenMiddleware } from '../middleware/verify-token'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import z from 'zod'
export class FetchUsersByCompanyController implements FastifyController {
  constructor(private fetchUsersUseCase: FetchUsersByCompanyUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const queryParams = z.object({
      company: z.string(),
    })

    try {
      const { company } = queryParams.parse(request.query)

      const response = await this.fetchUsersUseCase.execute({ company })

      const users = response.users.map(user => UserPresenter.toHTTP(user))

      return reply.status(200).send({
        users,
      })
    } catch (error) {
      throw error
    }
  }
}

export async function fetchUsersByCompany(app: FastifyInstance) {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const fetchUsersUseCase = new FetchUsersByCompanyUseCase(usersRepository)

  const fetchUsersController = new FetchUsersByCompanyController(
    fetchUsersUseCase,
  )

  const authService = new FirebaseAuthService(auth)
  const verifyTokenMiddleware = new FastifyVerifyTokenMiddleware(authService)

  app.get(
    '/users',
    {
      preHandler: verifyTokenMiddleware.handle(),
      schema: {
        summary: 'Fetch users',
        description: 'Access granted only when a valid token is provided.',
        tags: ['users'],
        querystring: {
          type: 'object',
          properties: {
            company: {
              type: 'string',
              description: 'The name of the company to filter users by.',
            },
          },
          required: ['company'],
        },
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
                    displayName: { type: 'string' },
                    email: {
                      type: 'string',
                      format: 'email',
                    },
                    company: {
                      type: 'string',
                    },
                    department: {
                      type: 'string',
                    },
                    userType: {
                      type: 'string',
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
