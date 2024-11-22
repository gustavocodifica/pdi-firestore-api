import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'
import { EmailAlreadyExistsError } from '@/domain/application/use-cases/errors/email-already-exists-error'

import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'
import { verifyToken } from '../middleware/verify-token'
import { UserPresenter } from '../presenters/user-presenter'

import z from 'zod'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export class CreateUserController implements FastifyController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    try {
      const { name, lastName, email, password } = bodySchema.parse(request.body)

      const response = await this.createUserUseCase.execute({
        name,
        lastName,
        email,
        password,
      })

      const user = UserPresenter.toHTTP(response.user)

      return reply.status(201).send({
        user,
      })
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ClientError(error.message)
      }

      throw error
    }
  }
}

export async function createUser(app: FastifyInstance) {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const createUserUseCase = new CreateUserUseCase(usersRepository)

  const createUserController = new CreateUserController(createUserUseCase)

  app.post(
    '/users',
    {
      preHandler: verifyToken,
      schema: {
        summary: 'Create a user',
        description: 'Access granted only when a valid token is provided.',
        tags: ['users'],
        body: {
          type: 'object',
          required: ['name', 'lastName', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
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
      await createUserController.handle(request, reply)
    },
  )
}
