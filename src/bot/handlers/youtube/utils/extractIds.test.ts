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
  'https://www.youtube.com/shorts/ktIaFr5OQGg',
]

describe('extractIds', () => {
  test('correctly returns all ids from all youtube links', () => {
    const ids = [
      { videoId: 'iwGFalTRHDA', url: 'youtu.be/iwGFalTRHDA' },
      { videoId: 'iwGFalTRHDA', url: 'youtube.com/watch?v=iwGFalTRHDA' },
      { videoId: 'iwGFalTRHDA', url: 'www.youtube.com/watch?v=iwGFalTRHDA' },
      {
        videoId: 'iwGFalTRHDA',
        url: 'http://www.youtube.com/watch?v=iwGFalTRHDA',
      },
      {
        videoId: 'iwGFalTRHDA',
        url: 'https://www.youtube.com/watch?v=iwGFalTRHDA',
      },
      {
        videoId: 'MoBL33GT9S8',
        url: 'https://www.youtube.com/watch?v=MoBL33GT9S8&feature=share',
      },
      {
        videoId: 'iwGFalTRHDA',
        url: 'https://www.youtube.com/embed/watch?feature=player_embedded&v=iwGFalTRHDA',
      },
      {
        videoId: 'iwGFalTRHDA',
        url: 'https://www.youtube.com/embed/watch?v=iwGFalTRHDA',
      },
      {
        videoId: 'iwGFalTRHDA',
        url: 'https://www.youtube.com/embed/v=iwGFalTRHDA',
      },
      {
        videoId: 'iwGFalTRHDA',
        url: 'https://www.youtube.com/watch/iwGFalTRHDA',
      },
      {
        videoId: 'aGmiw_rrNxk',
        url: 'http://www.youtube.com/attribution_link?u=/watch?v=aGmiw_rrNxk&feature=share',
      },
      {
        videoId: 'iwGFalTRHDA',
        url: 'https://m.youtube.com/watch?v=iwGFalTRHDA',
      },
      {
        videoId: 'ktIaFr5OQGg',
        url: 'https://www.youtube.com/shorts/ktIaFr5OQGg',
      },
    ]

    expect(extractIds(LINKS)).toMatchObject(expect.arrayContaining(ids))
  })

  test('unique works correctly', () => {
    const ids = [
      { videoId: 'iwGFalTRHDA', url: 'youtu.be/iwGFalTRHDA' },
      {
        videoId: 'MoBL33GT9S8',
        url: 'https://www.youtube.com/watch?v=MoBL33GT9S8&feature=share',
      },
      {
        videoId: 'aGmiw_rrNxk',
        url: 'http://www.youtube.com/attribution_link?u=/watch?v=aGmiw_rrNxk&feature=share',
      },
    ]

    expect(extractIds(LINKS, true)).toMatchObject(expect.arrayContaining(ids))
  })
})
