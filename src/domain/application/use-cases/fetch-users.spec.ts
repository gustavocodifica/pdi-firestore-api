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
      name: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
    })

    const secondUser = User.create({
      name: 'John 2',
      lastName: 'Doe 2',
      email: 'johndoe2@gmail.com',
    })

    inMemoryUsersRepository.create(firstUser)
    inMemoryUsersRepository.create(secondUser)

    const { users } = await sut.execute()

    expect(users).toHaveLength(2)
    expect(users[0].name).toEqual('John')
    expect(users[1].name).toEqual('John 2')
  })
})
