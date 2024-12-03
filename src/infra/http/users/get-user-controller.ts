import { auth } from '@/infra/database/firestore/firestore'

import { GetUserUseCase } from '@/domain/application/use-cases/users/get-user'
import { ResourceNotFoundError } from '@/domain/application/use-cases/users/errors/resource-not-found-error'

import { UserPresenter } from '../presenters/user-presenter'
import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'

import { FirebaseAuthService } from '../auth/firebase-auth-service'
import { FastifyVerifyTokenMiddleware } from '../middleware/verify-token'
import { makeGetUserUseCase } from '../factories/users/make-get-user-use-case'

import z from 'zod'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export class GetUserController implements FastifyController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      userId: z.string(),
    })

    try {
      const { userId } = paramsSchema.parse(request.params)

      const response = await this.getUserUseCase.execute({
        userId,
      })

      const user = UserPresenter.toHTTP(response.user)

      return reply.status(200).send({
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

export async function getUser(app: FastifyInstance) {
  const getUserUseCase = makeGetUserUseCase()

  const getUserController = new GetUserController(getUserUseCase)

  const authService = new FirebaseAuthService(auth)
  const verifyTokenMiddleware = new FastifyVerifyTokenMiddleware(authService)

  app.get(
    '/users/:userId',
    {
      preHandler: verifyTokenMiddleware.handle(),

      schema: {
        summary: 'Get a user',
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
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  displayName: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  company: { type: 'string' },
                  department: { type: 'string' },
                  userType: { type: 'string' },
                  register: {
                    oneOf: [{ type: 'string' }, { type: 'null' }],
                  },
                  genre: {
                    oneOf: [{ type: 'string' }, { type: 'null' }],
                  },
                  birthDate: {
                    oneOf: [{ type: 'string' }, { type: 'null' }],
                  },
                  responsible: {
                    oneOf: [{ type: 'string' }, { type: 'null' }],
                  },
                  phone: {
                    oneOf: [{ type: 'string' }, { type: 'null' }],
                  },
                  observation: {
                    oneOf: [{ type: 'string' }, { type: 'null' }],
                  },
                  address: {
                    oneOf: [{ type: 'string' }, { type: 'null' }],
                  },
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
      await getUserController.handle(request, reply)
    },
  )
}
