import { extractClips } from './extractClips'

const LINKS = [
  'https://clips.twitch.tv/JoyousIronicDragonfruitANELE-VpCndsYjEQc5Tdjj',
  'https://clips.twitch.tv/PlainNeighborlyYogurtPJSalt-fbn2jVaPeoXnQDqt',
  'https://clips.twitch.tv/FancyNurturingPastaTheTarFu-Qf21_ges0Cn-GplZ',
  'https://clips.tWitCh.tv/PlainNeighborlyYogurtPJSalt-fbn2jVaPeoXnQDqt',
]

describe('extractClips', () => {
  test('correctly returns all clip ids from all twitch links', () => {
    const ids = [
      {
        clipId: 'JoyousIronicDragonfruitANELE-VpCndsYjEQc5Tdjj',
        url: 'https://clips.twitch.tv/JoyousIronicDragonfruitANELE-VpCndsYjEQc5Tdjj',
      },
      {
        clipId: 'PlainNeighborlyYogurtPJSalt-fbn2jVaPeoXnQDqt',
        url: 'https://clips.twitch.tv/PlainNeighborlyYogurtPJSalt-fbn2jVaPeoXnQDqt',
      },
      {
        clipId: 'FancyNurturingPastaTheTarFu-Qf21_ges0Cn-GplZ',
        url: 'https://clips.twitch.tv/FancyNurturingPastaTheTarFu-Qf21_ges0Cn-GplZ',
      },
      {
        clipId: 'PlainNeighborlyYogurtPJSalt-fbn2jVaPeoXnQDqt',
        url: 'https://clips.tWitCh.tv/PlainNeighborlyYogurtPJSalt-fbn2jVaPeoXnQDqt',
      },
    ]

    expect(extractClips(LINKS)).toMatchObject(expect.arrayContaining(ids))
  })

  test('unique works correctly', () => {
    const ids = [
      {
        clipId: 'JoyousIronicDragonfruitANELE-VpCndsYjEQc5Tdjj',
        url: 'https://clips.twitch.tv/JoyousIronicDragonfruitANELE-VpCndsYjEQc5Tdjj',
      },
      {
        clipId: 'PlainNeighborlyYogurtPJSalt-fbn2jVaPeoXnQDqt',
        url: 'https://clips.twitch.tv/PlainNeighborlyYogurtPJSalt-fbn2jVaPeoXnQDqt',
      },
      {
        clipId: 'FancyNurturingPastaTheTarFu-Qf21_ges0Cn-GplZ',
        url: 'https://clips.twitch.tv/FancyNurturingPastaTheTarFu-Qf21_ges0Cn-GplZ',
      },
    ]

    expect(extractClips(LINKS, true)).toMatchObject(expect.arrayContaining(ids))
  })
})
