import { Request, Response } from 'express'
import LineUser from '../../models/LineUser'

const getPlayer = async (req: Request, res: Response) => {
  console.log('get-player-api!!', req.body)
  const player = new LineUser()
  const data = await player.get('xxx') // 本来はidTokenを渡すこと

  res.status(200).json({
    player: data,
  })
}

export default getPlayer
