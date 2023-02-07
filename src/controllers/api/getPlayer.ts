import { Request, Response } from 'express'
import Player from '../../models/Player'

const getPlayer = async (req: Request, res: Response) => {
  console.log('get-player-api!!', req.body)
  const player = new Player()
  const data = await player.get('xxx') // 本来はidTokenを渡すこと

  res.status(200).json({
    player: data,
  })
}

export default getPlayer
