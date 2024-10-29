import { User } from '@/domain/enterprise/entities/user'

export interface UsersRepository {
  create(user: User): Promise<void>
  save(user: User): Promise<void>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  delete(id: string): Promise<void>
}
