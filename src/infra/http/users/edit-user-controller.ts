import { EditUserUseCase } from '@/domain/application/use-cases/users/edit-user'
import { ResourceNotFoundError } from '@/domain/application/use-cases/users/errors/resource-not-found-error'

import { auth } from '@/infra/database/firestore/firestore'

import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'
import { UserPresenter } from '../presenters/user-presenter'

import { FirebaseAuthService } from '../auth/firebase-auth-service'
import { FastifyVerifyTokenMiddleware } from '../middleware/verify-token'

import z from 'zod'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { makeEditUserUseCase } from '../factories/users/make-edit-user-use-case'

export class EditUserController implements FastifyController {
  constructor(private editUserUseCase: EditUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      userId: z.string(),
    })

    const bodySchema = z.object({
      displayName: z.string().optional(),
      department: z.string().optional(),
      userType: z.string().optional(),
      address: z.string().optional(),
      birthDate: z.string().optional(),
      genre: z.string().optional(),
      observation: z.string().optional(),
      phone: z.string().optional(),
      register: z.string().optional(),
      responsible: z.string().optional(),
    })

    try {
      const { userId } = paramsSchema.parse(request.params)

      const {
        displayName,
        department,
        userType,
        address,
        birthDate,
        genre,
        observation,
        phone,
        register,
        responsible,
      } = bodySchema.parse(request.body)

      const response = await this.editUserUseCase.execute({
        userId,
        displayName,
        department,
        userType,
        address,
        birthDate,
        genre,
        observation,
        phone,
        register,
        responsible,
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
  const editUserUseCase = makeEditUserUseCase()

  const editUserController = new EditUserController(editUserUseCase)

  const authService = new FirebaseAuthService(auth)
  const verifyTokenMiddleware = new FastifyVerifyTokenMiddleware(authService)

  app.put(
    '/users/:userId',
    {
      preHandler: verifyTokenMiddleware.handle(),
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
            displayName: { type: 'string' },
            department: { type: 'string' },
            userType: { type: 'string' },
            register: { type: 'string' },
            genre: { type: 'string' },
            birthDate: { type: 'string' },
            responsible: { type: 'string' },
            phone: { type: 'string' },
            observation: { type: 'string' },
            address: { type: 'string' },
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
      await editUserController.handle(request, reply)
    },
  )
}
