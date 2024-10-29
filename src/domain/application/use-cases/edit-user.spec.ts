import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { EditUserUseCase } from './edit-user'
import { User } from '@/domain/enterprise/entities/user'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let sut: EditUserUseCase
let inMemoryUsersRepository: InMemoryUsersRespository

describe('Create user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRespository()
    sut = new EditUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to edit a user', async () => {
    const user = User.create({
      name: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
    })

    inMemoryUsersRepository.create(user)

    await sut.execute({
      userId: user.id,
      name: 'John 2',
      lastName: 'Doe 2',
    })

    expect(inMemoryUsersRepository.items[0].name).toEqual('John 2')
    expect(inMemoryUsersRepository.items[0].lastName).toEqual('Doe 2')
  })

  it('should prevent to edit a user with a non existing id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'fake-user-id',
        name: 'John',
        lastName: 'Doe',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
