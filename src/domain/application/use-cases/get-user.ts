import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserParams {
  userId: string
}

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetUserParams) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
