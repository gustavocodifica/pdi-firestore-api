import { User } from '@/domain/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

interface CreateUserUseCaseParams {
  name: string
  lastName: string
  email: string
  password: string
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, lastName, email, password }: CreateUserUseCaseParams) {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const user = User.create({
      name,
      lastName,
      email,
      password,
    })

    await this.usersRepository.create(user)
  }
}
