import { Request, Response } from 'express'
import Record from '../../models/Record'
import LineUser from '../../models/LineUser'

const getRecords = async (req: Request, res: Response) => {
  console.log('get-records!!', req.body)
  const { idToken, start, end } = req.body
  const player = new LineUser()
  const lineId = await player.getLineIdByIdToken(idToken)
  // const lineId = 'Ubca9519f029b6af8e53a9b54ffe92cae'
  const record = new Record()
  const records = await record.getPlayerRecors(lineId, start, end)

  res.status(200).json(records)
}

export default getRecords
