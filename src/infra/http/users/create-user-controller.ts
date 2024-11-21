import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'
import { EmailAlreadyExistsError } from '@/domain/application/use-cases/errors/email-already-exists-error'

import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'
import { verifyToken } from '../middleware/verify-token'

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

      await this.createUserUseCase.execute({
        name,
        lastName,
        email,
        password,
      })

      return reply.status(201).send()
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

  app.post('/users', { preHandler: verifyToken }, async (request, reply) => {
    await createUserController.handle(request, reply)
  })
}
