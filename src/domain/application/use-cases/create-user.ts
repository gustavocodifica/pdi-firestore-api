import { User } from '@/domain/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

interface CreateUserUseCaseParams {
  displayName: string
  email: string
  password: string
  department: string
  company: string
  userType: string
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    displayName,
    email,
    password,
    department,
    company,
    userType,
  }: CreateUserUseCaseParams) {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const user = User.create({
      displayName,
      email,
      password,
      department,
      company,
      userType,
    })

    await this.usersRepository.create(user)

    return {
      user,
    }
  }
}
