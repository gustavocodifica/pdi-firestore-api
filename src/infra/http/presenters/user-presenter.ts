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
    }
  }
}
