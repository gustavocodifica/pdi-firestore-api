import { User } from '@/domain/enterprise/entities/user'
import { UsersRepository } from '../../repositories/users-repository'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

interface CreateUserUseCaseParams {
  displayName: string
  email: string
  password: string
  department: string
  company: string
  userType: string
  register?: string | null
  address?: string | null
  genre?: string | null
  birthDate?: string | null
  responsible?: string | null
  phone?: string | null
  observation?: string | null
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
    address,
    birthDate,
    genre,
    register,
    responsible,
    phone,
    observation,
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
      address,
      birthDate,
      genre,
      register,
      responsible,
      phone,
      observation,
    })

    const response = await this.usersRepository.create(user)

    return {
      user: response,
    }
  }
}
