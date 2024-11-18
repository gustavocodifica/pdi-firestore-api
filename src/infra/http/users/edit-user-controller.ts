import { EditUserUseCase } from '@/domain/application/use-cases/edit-user'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'

import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'

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

      await this.editUserUseCase.execute({
        userId,
        name,
        lastName,
      })

      return reply.send({
        userId,
      })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new ClientError(error.message)
      }
    }
  }
}

export async function editUser(app: FastifyInstance) {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const editUserUseCase = new EditUserUseCase(usersRepository)

  const editUserController = new EditUserController(editUserUseCase)

  app.put('/users/:userId', async (request, reply) => {
    await editUserController.handle(request, reply)
  })
}
