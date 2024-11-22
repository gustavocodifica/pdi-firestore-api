import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditUserUseCaseParams {
  userId: string
  displayName: string
  department: string
  userType: string
}

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    displayName,
    department,
    userType,
  }: EditUserUseCaseParams) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    user.displayName = displayName
    user.department = department
    user.userType = userType

    await this.usersRepository.save(user)

    return {
      user,
    }
  }
}
