import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { GetUserUseCase } from './get-user'
import { User } from '@/domain/enterprise/entities/user'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let sut: GetUserUseCase
let inMemoryUsersRepository: InMemoryUsersRespository

describe('Get user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRespository()
    sut = new GetUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to get user', async () => {
    const user = User.create({
      displayName: 'John',
      email: 'johndoe@gmail.com',
      password: '123456',
      company: 'development',
      department: 'CS',
      userType: 'admin',
    })

    inMemoryUsersRepository.create(user)

    await sut.execute({
      userId: user.id,
    })

    expect(inMemoryUsersRepository.items[0].displayName).toEqual('John')
  })

  it('should prevent to get a user that does not exists', async () => {
    await expect(() =>
      sut.execute({
        userId: 'fake-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
