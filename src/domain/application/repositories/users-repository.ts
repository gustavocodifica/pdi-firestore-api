import { User } from '@/domain/enterprise/entities/user'

export interface UsersRepository {
  create(user: User): Promise<User>
  save(user: User): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findMany(company: string): Promise<User[]>
}
