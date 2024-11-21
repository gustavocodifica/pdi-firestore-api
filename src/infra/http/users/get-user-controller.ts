import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { GetUserUseCase } from '@/domain/application/use-cases/get-user'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'

import { UserPresenter } from '../presenters/user-presenter'
import { ClientError } from '../errors/client-error'
import { FastifyController } from '../protocols/fastify-controller'
import { verifyToken } from '../middleware/verify-token'

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
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const getUserUseCase = new GetUserUseCase(usersRepository)

  const getUserController = new GetUserController(getUserUseCase)

  app.get(
    '/users/:userId',
    { preHandler: verifyToken },
    async (request, reply) => {
      await getUserController.handle(request, reply)
    },
  )
}
