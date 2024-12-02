import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { FetchUsersByCompanyUseCase } from '@/domain/application/use-cases/users/fetch-users-by-company'

import { UserPresenter } from '../presenters/user-presenter'
import { FastifyController } from '../protocols/fastify-controller'

import { FirebaseAuthService } from '../auth/firebase-auth-service'
import { FastifyVerifyTokenMiddleware } from '../middleware/verify-token'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export class FetchUsersByCompanyController implements FastifyController {
  constructor(private fetchUsersUseCase: FetchUsersByCompanyUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = request.headers['authorization']

      if (!authHeader) {
        return reply
          .status(401)
          .send({ message: 'Unauthorized: No token provided.' })
      }

      const [_, token] = authHeader.split(' ')

      const { uid: userId } = await auth.verifyIdToken(token)

      const response = await this.fetchUsersUseCase.execute({
        userId,
      })

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
