import { extractIds } from './extractIds'

describe('extractIds', () => {
  test('correctly returns all ids from all youtube links', () => {
    const links = [
      'youtu.be/iwGFalTRHDA',
      'youtube.com/watch?v=iwGFalTRHDA',
      'www.youtube.com/watch?v=iwGFalTRHDA',
      'http://www.youtube.com/watch?v=iwGFalTRHDA',
      'https://www.youtube.com/watch?v=iwGFalTRHDA',
      'https://www.youtube.com/watch?v=MoBL33GT9S8&feature=share',
      'https://www.youtube.com/embed/watch?feature=player_embedded&v=iwGFalTRHDA',
      'https://www.youtube.com/embed/watch?v=iwGFalTRHDA',
      'https://www.youtube.com/embed/v=iwGFalTRHDA',
      'https://www.youtube.com/watch/iwGFalTRHDA',
      'http://www.youtube.com/attribution_link?u=/watch?v=aGmiw_rrNxk&feature=share',
      'https://m.youtube.com/watch?v=iwGFalTRHDA',
    ]

    const ids = [
      'iwGFalTRHDA',
      'iwGFalTRHDA',
      'iwGFalTRHDA',
      'iwGFalTRHDA',
      'iwGFalTRHDA',
      'MoBL33GT9S8',
      'iwGFalTRHDA',
      'iwGFalTRHDA',
      'iwGFalTRHDA',
      'iwGFalTRHDA',
      'aGmiw_rrNxk',
      'iwGFalTRHDA',
    ]

    expect(extractIds(links)).toMatchObject(expect.arrayContaining(ids))
  })
})
