import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditUserUseCaseParams {
  userId: string
  displayName?: string
  department?: string
  userType?: string
  address?: string
  birthDate?: string
  genre?: string
  observation?: string
  phone?: string
  register?: string
  responsible?: string
}

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    displayName,
    department,
    userType,
    address,
    birthDate,
    genre,
    observation,
    phone,
    register,
    responsible,
  }: EditUserUseCaseParams) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    user.displayName = displayName ?? user.displayName
    user.department = department ?? user.department
    user.userType = userType ?? user.userType
    user.address = address ?? user.address
    user.birthDate = birthDate ?? user.birthDate
    user.observation = observation ?? user.observation
    user.genre = genre ?? user.genre
    user.phone = phone ?? user.phone
    user.register = register ?? user.register
    user.responsible = responsible ?? user.responsible

    await this.usersRepository.save(user)

    return {
      user,
    }
  }
}
