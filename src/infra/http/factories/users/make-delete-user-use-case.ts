import { DeleteUserUseCase } from '@/domain/application/use-cases/users/delete-user'

import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

export function makeDeleteUserUseCase(): DeleteUserUseCase {
  const usersRepository = new FirestoreUsersRepository(db, auth)

  const deleteUserUseCase = new DeleteUserUseCase(usersRepository)

  return deleteUserUseCase
}
