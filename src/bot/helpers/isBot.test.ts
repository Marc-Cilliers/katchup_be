import { isBot, IsBotArgs } from './isBot'

describe('isBot', () => {
  test('returns false for other users', () => {
    let args: IsBotArgs = {
      state: {
        username: 'random_user',
      },
    }

    expect(isBot(args)).toBeFalsy()

    args = {
      state: {
        username: 'night_bot',
      },
    }

    expect(isBot(args)).toBeFalsy()
  })

  test('returns true for known bots', () => {
    let args: IsBotArgs = {
      state: {
        username: 'nightbot',
      },
    }

    expect(isBot(args)).toBeTruthy()
    args = {
      state: {
        username: 'streamelements',
      },
    }

    expect(isBot(args)).toBeTruthy()
  })
})
