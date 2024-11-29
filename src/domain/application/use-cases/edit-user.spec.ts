import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { EditUserUseCase } from './edit-user'
import { makeUser } from '@/factories/make-user'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

let sut: EditUserUseCase
let inMemoryUsersRepository: InMemoryUsersRespository

describe('Edit user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRespository()
    sut = new EditUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to edit a user', async () => {
    const user = makeUser()

    inMemoryUsersRepository.create(user)

    await sut.execute({
      userId: user.id,
      displayName: 'John 2',
      department: 'Desenvolvimento',
      userType: 'viewer',
    })

    expect(inMemoryUsersRepository.items[0].displayName).toEqual('John 2')
    expect(inMemoryUsersRepository.items[0].department).toEqual(
      'Desenvolvimento',
    )
    expect(inMemoryUsersRepository.items[0].userType).toEqual('viewer')
  })

  it('should prevent to edit a user that does not exists', async () => {
    await expect(() =>
      sut.execute({
        userId: 'fake-user-id',
        displayName: 'John 2',
        department: 'Desenvolvimento',
        userType: 'viewer',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
