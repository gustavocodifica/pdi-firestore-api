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
      displayName: 'John',
      email: 'johndoe@gmail.com',
      password: '123456,',
      company: 'development',
      department: 'CS',
      userType: 'admin',
    })

    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items[0].displayName).toEqual('John')
    expect(inMemoryUsersRepository.items[0].email).toEqual('johndoe@gmail.com')
  })

  it('should prevent to create a new user when the provided email already exists', async () => {
    await sut.execute({
      displayName: 'John',
      email: 'johndoe@gmail.com',
      password: '123456,',
      company: 'development',
      department: 'CS',
      userType: 'admin',
    })

    await expect(() =>
      sut.execute({
        displayName: 'John 2',
        email: 'johndoe@gmail.com',
        password: '123456,',
        company: 'development',
        department: 'CS',
        userType: 'admin',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
