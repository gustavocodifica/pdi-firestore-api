import { User, UserProps } from '@/domain/enterprise/entities/user'

import { faker } from '@faker-js/faker'

export function makeUser(override: Partial<UserProps> = {}, id?: string) {
  const user = User.create(
    {
      displayName: faker.internet.username(),
      password: faker.internet.password(),
      company: faker.company.name(),
      email: faker.internet.email(),
      department: faker.commerce.department(),
      userType: faker.internet.userAgent(),
      ...override,
    },
    id,
  )

  return user
}
