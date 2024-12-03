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
      address: faker.location.streetAddress(),
      birthDate: faker.date
        .past({
          years: 10,
        })
        .toString(),
      genre: faker.person.sexType(),
      observation: faker.lorem.paragraph(),
      phone: faker.phone.number(),
      register: faker.finance.accountNumber(),
      responsible: faker.person.firstName(),
      ...override,
    },
    id,
  )

  return user
}
