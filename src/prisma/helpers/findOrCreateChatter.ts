import { Chatter } from '@prisma/client'
import { prisma } from '../client'

interface FindOrCreateChatterFrom {
  username: (username: string) => Promise<Chatter>
}

export const findOrCreateChatterFrom: FindOrCreateChatterFrom = {
  username: async (username) => {
    const existingChatter = await prisma.chatter.findFirst({
      where: { username },
      select: { id: true, username: true },
    })

    if (existingChatter) return existingChatter

    return await prisma.chatter.create({
      data: { username },
      select: { id: true, username: true },
    })
  },
}
