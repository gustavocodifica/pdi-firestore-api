import { User } from '@/domain/enterprise/entities/user'

export interface FirestoreUser {
  id: string
  displayName: string
  email: string
  empresa: string
  departamento: string
  userType: string
  cadastro?: string | null
  endereço?: string | null
  gênero?: string | null
  nascimento?: string | null
  responsável?: string | null
  telefone?: string | null
  observações?: string | null
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
        address: raw.endereço,
        birthDate: raw.nascimento,
        genre: raw.gênero,
        observation: raw.observações,
        phone: raw.telefone,
        register: raw.cadastro,
        responsible: raw.responsável,
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
      cadastro: user.register,
      endereço: user.address,
      gênero: user.genre,
      nascimento: user.birthDate,
      observações: user.observation,
      responsável: user.responsible,
      telefone: user.phone,
    }
  }
}
