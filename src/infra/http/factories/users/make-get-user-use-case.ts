import { GetUserUseCase } from '@/domain/application/use-cases/users/get-user'

import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

export function makeGetUserUseCase(): GetUserUseCase {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const getUserUseCase = new GetUserUseCase(usersRepository)

  return getUserUseCase
}
