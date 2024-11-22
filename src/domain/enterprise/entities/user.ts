import { Entity } from '@/core/entity'

export interface UserProps {
  displayName: string
  email: string
  password: string
  company: string
  department: string
  userType: string
}

export class User extends Entity<UserProps> {
  get displayName() {
    return this.props.displayName
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get company() {
    return this.props.company
  }

  get department() {
    return this.props.department
  }

  get userType() {
    return this.props.userType
  }

  set displayName(displayName: string) {
    this.props.displayName = displayName
  }

  set department(department: string) {
    this.props.department = department
  }

  set userType(userType: string) {
    this.props.userType = userType
  }

  static create(props: UserProps, id?: string) {
    const user = new User(
      {
        ...props,
      },
      id,
    )

    return user
  }
}
