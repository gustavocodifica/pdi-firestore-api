import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { makeUser } from '@/factories/make-user'

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
    const user = makeUser()

    await sut.execute({
      displayName: user.displayName,
      email: user.email,
      password: user.password,
      company: user.company,
      department: user.department,
      userType: user.userType,
      address: user.address,
      birthDate: user.birthDate,
      genre: user.genre,
      observation: user.observation,
      phone: user.phone,
      register: user.register,
      responsible: user.responsible,
    })

    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items[0].displayName).toEqual(
      user.displayName,
    )
    expect(inMemoryUsersRepository.items[0].email).toEqual(user.email)
    expect(inMemoryUsersRepository.items[0].genre).toEqual(user.genre)
  })

  it('should prevent to create a new user when the provided email already exists', async () => {
    const user = makeUser({
      email: 'johndoe@gmail.com',
    })

    await sut.execute({
      displayName: user.displayName,
      email: user.email,
      password: user.password,
      company: user.company,
      department: user.department,
      userType: user.userType,
    })

    await expect(() =>
      sut.execute({
        displayName: user.displayName,
        email: user.email,
        password: user.password,
        company: user.company,
        department: user.department,
        userType: user.userType,
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
