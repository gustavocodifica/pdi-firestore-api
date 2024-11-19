import { UsersRepository } from '../repositories/users-repository'

export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute() {
    const users = await this.usersRepository.findMany()

    return {
      users,
    }
  }
}
