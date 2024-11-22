import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { FetchUsersUseCase } from './fetch-users'
import { User } from '@/domain/enterprise/entities/user'

let sut: FetchUsersUseCase
let inMemoryUsersRepository: InMemoryUsersRespository

describe('Fetch users', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRespository()
    sut = new FetchUsersUseCase(inMemoryUsersRepository)
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
      company: 'development',
      department: 'CS',
      userType: 'admin',
    })

    inMemoryUsersRepository.create(firstUser)
    inMemoryUsersRepository.create(secondUser)

    const { users } = await sut.execute()

    expect(users).toHaveLength(2)
    expect(users[0].displayName).toEqual('John')
    expect(users[1].displayName).toEqual('John 2')
  })
})
