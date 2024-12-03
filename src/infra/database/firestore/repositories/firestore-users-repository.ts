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
      displayName: user.displayName,
      email: user.email,
      password: user.password,
    })

    await this.firestore.collection('users').doc(response.uid).set({
      displayName: user.displayName,
      email: user.email,
      empresa: user.company,
      departamento: user.department,
      userType: user.userType,
      cadastro: user.register,
      endereço: user.address,
      gênero: user.genre,
      nascimento: user.birthDate,
      observações: user.observation,
      responsável: user.responsible,
      telefone: user.phone,
    })

    const raw: FirestoreUser = {
      id: response.uid,
      displayName: user.displayName,
      email: user.email,
      empresa: user.company,
      departamento: user.department,
      userType: user.userType,
      cadastro: user.register,
      endereço: user.address,
      gênero: user.genre,
      nascimento: user.birthDate,
      observações: user.observation,
      responsável: user.responsible,
      telefone: user.phone,
    }

    return FirestoreUserMapper.ToDomain(raw)
  }

  async save(user: User) {
    const raw = FirestoreUserMapper.ToFirestore(user)

    const { id, ...rest } = raw

    await this.firestore
      .collection('users')
      .doc(id)
      .update({
        ...rest,
      })
  }

  async findById(id: string) {
    const user = await this.firestore.collection('users').doc(id).get()

    if (!user.exists) {
      return null
    }

    const raw: FirestoreUser = {
      id: user.id,
      displayName: user.data()?.displayName as string,
      email: user.data()?.email as string,
      empresa: user.data()?.empresa as string,
      departamento: user.data()?.departamento as string,
      userType: user.data()?.userType as string,
      cadastro: user.data()?.cadastro as string,
      endereço: user.data()?.endereço as string,
      gênero: user.data()?.gênero as string,
      nascimento: user.data()?.nascimento as string,
      observações: user.data()?.observações as string,
      responsável: user.data()?.responsável as string,
      telefone: user.data()?.telefone as string,
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

  async findMany(company: string) {
    const users = await this.firestore
      .collection('users')
      .where('empresa', '==', company)
      .get()

    const usersArray: FirestoreUser[] = users.docs.map(userDoc => {
      const {
        displayName,
        email,
        empresa,
        departamento,
        userType,
        cadastro,
        endereço,
        gênero,
        nascimento,
        observações,
        responsável,
        telefone,
      } = userDoc.data() as FirestoreUser

      return {
        id: userDoc.id,
        displayName,
        email,
        departamento,
        empresa,
        userType,
        cadastro,
        endereço,
        gênero,
        nascimento,
        observações,
        responsável,
        telefone,
      }
    })

    return usersArray.map(user => FirestoreUserMapper.ToDomain(user))
  }
}
