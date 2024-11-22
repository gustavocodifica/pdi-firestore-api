import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditUserUseCaseParams {
  userId: string
  name: string
  lastName: string
}

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, name, lastName }: EditUserUseCaseParams) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    user.name = name
    user.lastName = lastName

    await this.usersRepository.save(user)

    return {
      user,
    }
  }
}
