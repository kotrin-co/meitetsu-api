import { Request, Response } from 'express'
import LineUser from '../../models/LineUser'
import Record from '../../models/Record'

const dailyRecord = async (req: Request, res: Response) => {
  const { idToken, date, weight, content, remarks } = req.body
  console.log('daily record:', date, weight, content, remarks)

  const player = new LineUser()
  const lineId = await player.getLineIdByIdToken(idToken)
  // const lineId = 'Ubca9519f029b6af8e53a9b54ffe92cae'

  const record = new Record()

  const data = await record.createDailyRecord(
    lineId,
    date,
    weight,
    content,
    remarks
  )

  res.status(201).json(data)
}

export default dailyRecord
