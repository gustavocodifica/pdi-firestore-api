import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { FetchUsersUseCase } from '@/domain/application/use-cases/fetch-users'

import { FastifyController } from '../protocols/fastify-controller'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { UserPresenter } from '../presenters/user-presenter'

export class FetchUsersController implements FastifyController {
  constructor(private fetchUsersUseCase: FetchUsersUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const response = await this.fetchUsersUseCase.execute()

      const users = response.users.map(user => UserPresenter.toHTTP(user))

      return reply.status(200).send({
        users,
      })
    } catch (error) {
      throw error
    }
  }
}

export async function fetchUsers(app: FastifyInstance) {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const fetchUsersUseCase = new FetchUsersUseCase(usersRepository)

  const fetchUsersController = new FetchUsersController(fetchUsersUseCase)

  app.get('/users/', async (request, reply) => {
    await fetchUsersController.handle(request, reply)
  })
}
