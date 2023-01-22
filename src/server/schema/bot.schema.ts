import S from 'fluent-json-schema'

export const joinChannelSchema = {
  body: S.object().prop('channel', S.string().required()).required(),
  queryString: S.object(),
  params: S.object(),
  headers: S.object(),
}
