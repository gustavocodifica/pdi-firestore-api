import { InMemoryUsersRespository } from '@/repositories/in-memory-users-repository'
import { makeUser } from '@/factories/make-user'

import { GetUserUseCase } from './get-user'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let sut: GetUserUseCase
let inMemoryUsersRepository: InMemoryUsersRespository

describe('Get user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRespository()
    sut = new GetUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to get user', async () => {
    const user = makeUser()

    inMemoryUsersRepository.create(user)

    await sut.execute({
      userId: user.id,
    })

    expect(inMemoryUsersRepository.items[0].displayName).toEqual(
      user.displayName,
    )
  })

  it('should prevent to get a user that does not exists', async () => {
    await expect(() =>
      sut.execute({
        userId: 'fake-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
