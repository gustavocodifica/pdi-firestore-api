import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { FetchUsersByCompanyUseCase } from './fetch-users-by-company'
import { User } from '@/domain/enterprise/entities/user'

let sut: FetchUsersByCompanyUseCase
let inMemoryUsersRepository: InMemoryUsersRespository

describe('Fetch users', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRespository()
    sut = new FetchUsersByCompanyUseCase(inMemoryUsersRepository)
  })

  it('should be able to fetch users', async () => {
    const firstUser = User.create({
      displayName: 'John',
      email: 'johndoe@gmail.com',
      password: '123456',
      company: 'development',
      department: 'CS',
      userType: 'admin',
    })

    const secondUser = User.create({
      displayName: 'John 2',
      email: 'johndoe2@gmail.com',
      password: '123456',
      company: 'company-abc',
      department: 'CS',
      userType: 'admin',
    })

    inMemoryUsersRepository.create(firstUser)
    inMemoryUsersRepository.create(secondUser)

    const { users } = await sut.execute({ company: 'development' })

    expect(users).toHaveLength(1)
    expect(users).toHaveLength(1)
    expect(users[0].company).toEqual('development')
  })
})
