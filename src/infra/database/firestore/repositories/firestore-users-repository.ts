import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { User } from '@/domain/enterprise/entities/user'

import { Firestore } from 'firebase-admin/firestore'

export class FirestoreUsersRepository implements UsersRepository {
  constructor(private firestore: Firestore) {}

  async create(user: User) {
    await this.firestore.collection('users').add(user)
  }

  async save(user: User) {
    const newUser = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    }

    await this.firestore.collection('users').doc(user.id).update(newUser)
  }

  async findById(id: string) {
    const user = await this.firestore.collection('users').doc(id).get()

    if (!user.exists) {
      return null
    }

    const userData = user.data() as User

    return userData
  }

  async findByEmail(email: string) {
    const user = await this.firestore
      .collection('users')
      .where('email', '==', email)
      .get()

    if (user.empty) {
      return null
    }

    const userData = user.docs[0].data() as User

    return userData
  }

  async delete(id: string) {
    await this.firestore.collection('users').doc(id).delete()
  }
}
