import { User } from '@/domain/enterprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      displayName: user.displayName,
      email: user.email,
      department: user.department,
      company: user.company,
      userType: user.userType,
      register: user.register,
      address: user.address,
      genre: user.genre,
      birthDate: user.birthDate,
      reponsible: user.responsible,
      phone: user.phone,
      observation: user.observation,
    }
  }
}
