import { Chatter } from '@prisma/client'
import { ChatUserstate } from 'tmi.js'
import { prisma } from '../client'

interface FindOrCreateFrom {
  username: (username: string) => Promise<Chatter>
}

export const getChatterAndUpdate = async (
  state: ChatUserstate,
  userId: string,
) => {
  const username = state['display-name']
  const chatter = await findOrCreateChatterFrom.username(username)
  const userChatter = await updateUserChatter(state, chatter.id, userId)

  return userChatter
}

const updateUserChatter = async (
  state: ChatUserstate,
  chatterId: string,
  userId: string,
) => {
  const existingUserChatter = await prisma.userChatter.findFirst({
    where: { chatterId, userId },
  })
  const { color, mod, subscriber, turbo, badges: badgesObj } = state
  const badges = Object.keys(badgesObj).map((k) => ({ [k]: badgesObj[k] }))

  if (existingUserChatter) {
    return await prisma.userChatter.update({
      where: { id: existingUserChatter.id },
      data: {
        badges,
        color,
        mod,
        subscriber,
        turbo,
      },
      select: {
        id: true,
        badges: true,
        chatterId: true,
        color: true,
        mod: true,
        subscriber: true,
        turbo: true,
        chatterRatings: {
          select: {
            rating: true,
          },
        },
        chatter: {
          select: {
            username: true,
          },
        },
      },
    })
  }

  return await prisma.userChatter.create({
    data: {
      badges,
      color,
      mod,
      subscriber,
      turbo,
      chatterId,
      userId,
    },
    select: {
      id: true,
      badges: true,
      chatterId: true,
      color: true,
      mod: true,
      subscriber: true,
      turbo: true,
      chatterRatings: {
        select: {
          rating: true,
        },
      },
      chatter: {
        select: {
          username: true,
        },
      },
    },
  })
}

const findOrCreateChatterFrom: FindOrCreateFrom = {
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
