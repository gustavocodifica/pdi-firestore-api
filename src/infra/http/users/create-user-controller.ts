import { auth } from '@/infra/database/firestore/firestore'

import { CreateUserUseCase } from '@/domain/application/use-cases/users/create-user'
import { EmailAlreadyExistsError } from '@/domain/application/use-cases/users/errors/email-already-exists-error'

import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'
import { FastifyVerifyTokenMiddleware } from '../middleware/verify-token'
import { UserPresenter } from '../presenters/user-presenter'
import { FirebaseAuthService } from '../auth/firebase-auth-service'
import { makeCreateUserUseCase } from '../factories/users/make-create-user-use-case'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import z from 'zod'

export class CreateUserController implements FastifyController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      displayName: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      company: z.string(),
      department: z.string(),
      userType: z.string(),
    })

    try {
      const { displayName, email, password, company, department, userType } =
        bodySchema.parse(request.body)

      const response = await this.createUserUseCase.execute({
        displayName,
        email,
        password,
        company,
        department,
        userType,
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
  const createUserUseCase = makeCreateUserUseCase()

  const createUserController = new CreateUserController(createUserUseCase)

  const authService = new FirebaseAuthService(auth)
  const verifyTokenMiddleware = new FastifyVerifyTokenMiddleware(authService)

  app.post(
    '/users',
    {
      preHandler: verifyTokenMiddleware.handle(),
      schema: {
        summary: 'Create a user',
        description: 'Access granted only when a valid token is provided.',
        tags: ['users'],
        body: {
          type: 'object',
          required: [
            'displayName',
            'email',
            'password',
            'company',
            'department',
            'userType',
          ],
          properties: {
            displayName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            company: { type: 'string' },
            department: { type: 'string' },
            userType: { type: 'string' },
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
                  displayName: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  company: { type: 'string' },
                  department: { type: 'string' },
                  userType: { type: 'string' },
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
