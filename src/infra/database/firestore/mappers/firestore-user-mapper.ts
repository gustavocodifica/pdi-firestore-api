import { User } from '@/domain/enterprise/entities/user'

export interface FirestoreUser {
  id: string
  name: string
  lastName: string
  email: string
  createdAt: string
}

export class FirestoreUserMapper {
  static ToDomain(raw: FirestoreUser): User {
    return new User(
      {
        name: raw.name,
        lastName: raw.lastName,
        createdAt: new Date(raw.createdAt),
        email: raw.email,
      },
      raw.id,
    )
  }

  static ToFirestore(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    }
  }
}
