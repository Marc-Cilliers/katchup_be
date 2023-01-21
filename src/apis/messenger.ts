import {
  createClient,
  RealtimeChannel,
  RealtimeChannelSendResponse,
} from '@supabase/supabase-js'

type Pipe = 'youtube'
type YoutubeEvent = 'newVideo'

type Event = YoutubeEvent

interface ChannelProps {
  user: string
  pipe: Pipe
}

interface SendMessageProps extends ChannelProps {
  event: Event
  payload: any
}

const channelMaps: Record<string, RealtimeChannel> = {}

const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 20,
      },
    },
  },
)

const sendMessage = async ({
  user,
  pipe,
  event,
  payload,
}: SendMessageProps): Promise<RealtimeChannelSendResponse> => {
  const channelName = `${user}-${pipe}`
  const channel = channelMaps[channelName]
  if (!channel) return

  return await channel.send({
    type: 'broadcast',
    event,
    payload,
  })
}

const createChannel = ({ user, pipe }: ChannelProps) => {
  const channelName = `${user}-${pipe}`
  if (channelMaps[channelName]) return // Channel already exists

  const channel = supabaseClient.channel(channelName)
  channel.subscribe()

  channelMaps[channelName] = channel
}

interface MessengerAPI {
  createChannel: (args: ChannelProps) => void
  sendMessage: (args: SendMessageProps) => Promise<RealtimeChannelSendResponse>
}

export const MessengerAPI: MessengerAPI = {
  createChannel,
  sendMessage,
}
