import { FetchUsersByCompanyUseCase } from '@/domain/application/use-cases/users/fetch-users-by-company'

import { auth, db } from '@/infra/database/firestore/firestore'
import { FirestoreUsersRepository } from '@/infra/database/firestore/repositories/firestore-users-repository'

export function makeFetchUsersUseCase(): FetchUsersByCompanyUseCase {
  const usersRepository = new FirestoreUsersRepository(db, auth)
  const fetchUsersUseCase = new FetchUsersByCompanyUseCase(usersRepository)

  return fetchUsersUseCase
}
