import { CreateUserUseCase } from '@/domain/application/use-cases/users/create-user'

import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

export function makeCreateUserUseCase(): CreateUserUseCase {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const createUserUseCase = new CreateUserUseCase(usersRepository)

  return createUserUseCase
}
