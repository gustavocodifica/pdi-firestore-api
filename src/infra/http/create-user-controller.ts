import { FastifyController } from './protocols/fastify-controller'

import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'

import { auth, db } from '../database/firestore/firestore'
import { FirestoreUsersRepository } from '../database/firestore/repositories/firestore-users-repository'

import z from 'zod'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { EmailAlreadyExistsError } from '@/domain/application/use-cases/errors/email-already-exists-error'
import { ClientError } from './errors/client-error'

export class CreateUserController implements FastifyController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      lastName: z.string(),
      email: z.string().email(),
    })

    try {
      const { name, lastName, email } = bodySchema.parse(request.body)

      await this.createUserUseCase.execute({
        name,
        lastName,
        email,
      })

      return reply.status(201).send()
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ClientError(error.message)
      }
    }
  }
}

export async function createUser(app: FastifyInstance) {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const createUserUseCase = new CreateUserUseCase(usersRepository)

  const createUserController = new CreateUserController(createUserUseCase)

  app.post('/users', async (request, reply) => {
    await createUserController.handle(request, reply)
  })
}