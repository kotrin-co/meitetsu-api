import { FollowEvent } from '@line/bot-sdk'
import { client } from '../../../app'
import LineUser from '../../../models/LineUser'

const handleFollowEvent = async (event: FollowEvent) => {
  if (event.type !== 'follow') {
    return
  }

  console.log('followEvent:', event)

  const lineId = event.source.userId!
  const profile = await client.getProfile(lineId)
  const displayName = profile.displayName

  const user = new LineUser()
  const insert = await user.create(lineId, displayName)
  console.log('follow insert:', insert)
}

export default handleFollowEvent
