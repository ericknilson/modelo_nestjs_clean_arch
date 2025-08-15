import { faker } from '@faker-js/faker'
import { UserOutput } from '@/users/application/dtos/user-output'

type Props = {
  id?: string
  name?: string
  email?: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export function UserOutputDataBuilder(props: Props = {}): UserOutput {
  return {
    id: props.id ?? faker.string.uuid(),
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
    deletedAt: props.deletedAt,
  }
}
