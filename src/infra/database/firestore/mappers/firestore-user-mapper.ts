import { User } from '@/domain/enterprise/entities/user'

export interface FirestoreUser {
  id: string
  displayName: string
  email: string
  empresa: string
  departamento: string
  userType: string
}

export class FirestoreUserMapper {
  static ToDomain(raw: FirestoreUser): User {
    return new User(
      {
        displayName: raw.displayName,
        email: raw.email,
        company: raw.empresa,
        department: raw.departamento,
        userType: raw.userType,
        password: '',
      },
      raw.id,
    )
  }

  static ToFirestore(user: User): FirestoreUser {
    return {
      id: user.id.toString(),
      displayName: user.displayName,
      email: user.email,
      empresa: user.company,
      departamento: user.department,
      userType: user.userType,
    }
  }
}
