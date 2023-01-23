import { extractIds } from './extractIds'

const LINKS = [
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

describe('extractIds', () => {
  test('correctly returns all ids from all youtube links', () => {
    const ids = [
      { videoId: 'iwGFalTRHDA', link: 'youtu.be/iwGFalTRHDA' },
      { videoId: 'iwGFalTRHDA', link: 'youtube.com/watch?v=iwGFalTRHDA' },
      { videoId: 'iwGFalTRHDA', link: 'www.youtube.com/watch?v=iwGFalTRHDA' },
      {
        videoId: 'iwGFalTRHDA',
        link: 'http://www.youtube.com/watch?v=iwGFalTRHDA',
      },
      {
        videoId: 'iwGFalTRHDA',
        link: 'https://www.youtube.com/watch?v=iwGFalTRHDA',
      },
      {
        videoId: 'MoBL33GT9S8',
        link: 'https://www.youtube.com/watch?v=MoBL33GT9S8&feature=share',
      },
      {
        videoId: 'iwGFalTRHDA',
        link: 'https://www.youtube.com/embed/watch?feature=player_embedded&v=iwGFalTRHDA',
      },
      {
        videoId: 'iwGFalTRHDA',
        link: 'https://www.youtube.com/embed/watch?v=iwGFalTRHDA',
      },
      {
        videoId: 'iwGFalTRHDA',
        link: 'https://www.youtube.com/embed/v=iwGFalTRHDA',
      },
      {
        videoId: 'iwGFalTRHDA',
        link: 'https://www.youtube.com/watch/iwGFalTRHDA',
      },
      {
        videoId: 'aGmiw_rrNxk',
        link: 'http://www.youtube.com/attribution_link?u=/watch?v=aGmiw_rrNxk&feature=share',
      },
      {
        videoId: 'iwGFalTRHDA',
        link: 'https://m.youtube.com/watch?v=iwGFalTRHDA',
      },
    ]

    expect(extractIds(LINKS)).toMatchObject(expect.arrayContaining(ids))
  })

  test('unique works correctly', () => {
    const ids = [
      { videoId: 'iwGFalTRHDA', link: 'youtu.be/iwGFalTRHDA' },
      {
        videoId: 'MoBL33GT9S8',
        link: 'https://www.youtube.com/watch?v=MoBL33GT9S8&feature=share',
      },
      {
        videoId: 'aGmiw_rrNxk',
        link: 'http://www.youtube.com/attribution_link?u=/watch?v=aGmiw_rrNxk&feature=share',
      },
    ]

    expect(extractIds(LINKS, true)).toMatchObject(expect.arrayContaining(ids))
  })
})
