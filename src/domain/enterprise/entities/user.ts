import { Entity } from '@/core/entity'

export interface UserProps {
  displayName: string
  email: string
  password: string
  company: string
  department: string
  userType: string
  register?: string | null
  address?: string | null
  genre?: string | null
  birthDate?: string | null
  responsible?: string | null
  phone?: string | null
  observation?: string | null
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

  get register() {
    return this.props.register
  }

  get genre() {
    return this.props.genre
  }

  get birthDate() {
    return this.props.birthDate
  }

  get responsible() {
    return this.props.responsible
  }

  get phone() {
    return this.props.phone
  }

  get observation() {
    return this.props.observation
  }

  get address() {
    return this.props.address
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

  set register(register: string | null | undefined) {
    this.props.register = register
  }

  set address(address: string | null | undefined) {
    this.props.address = address
  }

  set genre(genre: string | null | undefined) {
    this.props.genre = genre
  }

  set birthDate(birthDate: string | null | undefined) {
    this.props.birthDate = birthDate
  }

  set responsible(responsible: string | null | undefined) {
    this.props.responsible = responsible
  }

  set phone(phone: string | null | undefined) {
    this.props.phone = phone
  }

  set observation(observation: string | null | undefined) {
    this.props.observation = observation
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
