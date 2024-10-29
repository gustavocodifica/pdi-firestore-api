import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

let sut: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRespository

describe('Create user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRespository()
    sut = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    await sut.execute({
      name: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
    })

    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items[0].name).toEqual('John')
    expect(inMemoryUsersRepository.items[0].email).toEqual('johndoe@gmail.com')
  })

  it('should prevent to create a new user when the provided email already exists', async () => {
    await sut.execute({
      name: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
    })

    await expect(() =>
      sut.execute({
        name: 'John 2',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
