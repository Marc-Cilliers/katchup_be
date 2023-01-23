import { extractLinks } from './extractLinks'
import { faker } from '@faker-js/faker'

describe('extractLinks', () => {
  test('correctly returns all links from a message', () => {
    const links = [
      'https://twitch.tv/random_channel', //Twitch
      'https://youtube.com/watch?v=cyCjGiRyW4g', //Youtube
    ]

    const startOfMsg = faker.random.words(50)
    const endOfMsg = faker.random.words(50)

    const msg = `${startOfMsg} ${links.join(' ')} ${endOfMsg}`

    expect(extractLinks(msg)).toMatchObject(expect.arrayContaining(links))
  })
})
