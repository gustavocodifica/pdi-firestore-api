import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { FetchUsersByCompanyUseCase } from './fetch-users-by-company'

import { makeUser } from '@/factories/make-user'

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

    const { users } = await sut.execute({ company: 'ramdom-company-name' })

    expect(users).toHaveLength(2)
    expect(users).toHaveLength(2)
    expect(users[0].company).toEqual('ramdom-company-name')
  })
})
