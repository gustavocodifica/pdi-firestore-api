import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { FetchUsersByCompanyUseCase } from './fetch-users-by-company'

import { makeUser } from '@/factories/make-user'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let sut: FetchUsersByCompanyUseCase
let inMemoryUsersRepository: InMemoryUsersRespository

describe('Fetch users', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRespository()
    sut = new FetchUsersByCompanyUseCase(inMemoryUsersRepository)
  })

  it('should be able to fetch users', async () => {
    const firstUser = makeUser({
      company: 'ramdom-company-name',
    })

    const secondUser = makeUser({
      company: 'ramdom-company-name',
    })

    inMemoryUsersRepository.create(firstUser)
    inMemoryUsersRepository.create(secondUser)

    const { users } = await sut.execute({ userId: firstUser.id.toString() })

    expect(users).toHaveLength(2)
    expect(users).toHaveLength(2)
    expect(users[0].company).toEqual('ramdom-company-name')
  })

  it('should prevent to fecth users if user id provided is invalid', async () => {
    expect(() =>
      sut.execute({
        userId: 'fake-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
