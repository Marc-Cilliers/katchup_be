import { prisma } from '../client'
import { findUserByName } from './findUserByName'

interface UpdateUserProps {
  badges: Record<string, string>
  username: string
}

export const updateUserBadges = async ({
  badges,
  username,
}: UpdateUserProps): Promise<void> => {
  const user = await findUserByName(username)
  await prisma.user.update({ where: { id: user.id }, data: { badges } })
}
