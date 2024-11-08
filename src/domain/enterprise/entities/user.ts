import { Entity } from '@/core/entity'
import { Optional } from '@/core/optional'

export interface UserProps {
  name: string
  lastName: string
  email: string
  createdAt: Date
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get lastName() {
    return this.props.lastName
  }

  get email() {
    return this.props.email
  }

  get createdAt() {
    return this.props.createdAt
  }

  set name(name: string) {
    this.props.name = name
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: string) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return user
  }
}
