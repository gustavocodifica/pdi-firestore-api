import { EditUserUseCase } from '@/domain/application/use-cases/users/edit-user'
import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

export function makeEditUserUseCase(): EditUserUseCase {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const editUserUseCase = new EditUserUseCase(usersRepository)

  return editUserUseCase
}
