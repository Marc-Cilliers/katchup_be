import { User } from '@prisma/client'
import { Maybe } from '../../types'
import { prisma } from '../client'

export const findUserByName = async (name: string): Promise<Maybe<User>> => {
  const users: Maybe<User[]> =
    await prisma.$queryRaw`SELECT * FROM "User" WHERE LOWER(name) LIKE LOWER(${name})`

  if (!users || !users.length) return null
  return users[0]
}
