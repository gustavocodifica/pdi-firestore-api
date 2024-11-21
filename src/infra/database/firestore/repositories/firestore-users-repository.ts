import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { User } from '@/domain/enterprise/entities/user'

import { Firestore } from 'firebase-admin/firestore'
import { Auth } from 'firebase-admin/auth'

import {
  FirestoreUser,
  FirestoreUserMapper,
} from '../mappers/firestore-user-mapper'

export class FirestoreUsersRepository implements UsersRepository {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) {}

  async create(user: User) {
    const response = await this.auth.createUser({
      displayName: user.name,
      email: user.email,
      password: user.password,
    })

    await this.firestore.collection('users').doc(response.uid).set({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    })
  }

  async save(user: User) {
    const raw = FirestoreUserMapper.ToFirestore(user)

    const { id, ...rest } = raw

    await this.firestore
      .collection('users')
      .doc(id)
      .update({
        ...rest,
        createdAt: rest.createdAt,
      })
  }

  async findById(id: string) {
    const user = await this.firestore.collection('users').doc(id).get()

    if (!user.exists) {
      return null
    }

    const raw = {
      id: user.id,
      name: user.data()?.name as string,
      lastName: user.data()?.lastName as string,
      email: user.data()?.email as string,
      createdAt: user.data()?.createdAt as string,
    }

    return FirestoreUserMapper.ToDomain(raw)
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
    await Promise.all([
      this.auth.deleteUser(id),
      this.firestore.collection('users').doc(id).delete(),
    ])
  }

  async findMany() {
    const users = await this.firestore.collection('users').get()

    const usersArray: FirestoreUser[] = users.docs.map(userDoc => {
      const { name, lastName, email, createdAt } =
        userDoc.data() as FirestoreUser

      return {
        id: userDoc.id,
        name: name || '',
        lastName: lastName || '',
        email: email || '',
        createdAt: createdAt || '',
      }
    })

    return usersArray.map(user => FirestoreUserMapper.ToDomain(user))
  }
}
