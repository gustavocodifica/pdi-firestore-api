import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { User } from '@/domain/enterprise/entities/user'

export class InMemoryUsersRespository implements UsersRepository {
  public items: User[] = []

  async create(user: User) {
    this.items.push(user)
  }

  async save(user: User) {
    const userIndex = this.items.findIndex(i => i.id === user.id)

    this.items[userIndex] = user
  }

  async findById(id: string) {
    const user = this.items.find(user => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find(user => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async delete(id: string) {
    const userIndex = this.items.findIndex(user => user.id === id)

    this.items.splice(userIndex, 1)
  }

  async findMany() {
    return this.items
  }
}
