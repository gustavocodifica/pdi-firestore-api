import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

import { FetchUsersUseCase } from '@/domain/application/use-cases/fetch-users'

import { FastifyController } from '../protocols/fastify-controller'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export class FetchUsersController implements FastifyController {
  constructor(private fetchUsersUseCase: FetchUsersUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { users } = await this.fetchUsersUseCase.execute()

    return reply.status(200).send({
      users,
    })
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
