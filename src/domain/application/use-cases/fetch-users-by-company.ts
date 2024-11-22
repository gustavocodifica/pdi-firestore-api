import { UsersRepository } from '../repositories/users-repository'

interface FetchUsersByCompanyUseCaseParams {
  company: string
}

export class FetchUsersByCompanyUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ company }: FetchUsersByCompanyUseCaseParams) {
    const users = await this.usersRepository.findMany(company)

    return {
      users,
    }
  }
}
