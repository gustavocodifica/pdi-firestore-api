import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { User } from '@/domain/enterprise/entities/user'

import { Firestore } from 'firebase-admin/firestore'
import { Auth } from 'firebase-admin/auth'

export class FirestoreUsersRepository implements UsersRepository {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) {}

  async create(user: User) {
    const response = await this.auth.createUser({
      displayName: user.name,
      email: user.email,
    })

    await this.firestore.collection('users').doc(response.uid).set({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    })
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
