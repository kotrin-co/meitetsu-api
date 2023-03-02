import { Request, Response } from 'express'
import Record from '../../models/Record'
import LineUser from '../../models/LineUser'

const getRecords = async (req: Request, res: Response) => {
  console.log('get-records!!', req.body)
  const { idToken, start, end, lineId } = req.body
  const player = new LineUser()
  const id = lineId ? lineId : await player.getLineIdByIdToken(idToken)

  const record = new Record()
  const records = await record.getPlayerRecors(id, start, end)

  res.status(200).json(records)
}

export default getRecords
