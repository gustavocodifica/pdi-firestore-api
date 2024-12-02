import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchUsersByCompanyUseCaseParams {
  userId: string
}

export class FetchUsersByCompanyUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: FetchUsersByCompanyUseCaseParams) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const users = await this.usersRepository.findMany(user.company)

    return {
      users,
    }
  }
}
