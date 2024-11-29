import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { makeUser } from '@/factories/make-user'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { DeleteUserUseCase } from './delete-user'

let sut: DeleteUserUseCase
let inMemoryUsersRepository: InMemoryUsersRespository

describe('Delete user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRespository()
    sut = new DeleteUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to delete a user', async () => {
    const user = makeUser()

    inMemoryUsersRepository.create(user)

    expect(inMemoryUsersRepository.items).toHaveLength(1)

    await sut.execute({
      userId: user.id,
    })

    expect(inMemoryUsersRepository.items).toHaveLength(0)
  })

  it('should prevent to delete a user that does not exists', async () => {
    await expect(() =>
      sut.execute({
        userId: 'fake-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
