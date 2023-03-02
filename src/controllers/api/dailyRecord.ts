import { Request, Response } from 'express'
import LineUser from '../../models/LineUser'
import Record from '../../models/Record'
import type { PlayerData } from '../../types'

const dailyRecord = async (req: Request, res: Response) => {
  const { idToken, date, weight, content, remarks, lineId, comments } = req.body
  console.log(
    'create daily record:',
    date,
    weight,
    content,
    remarks,
    lineId,
    comments
  )

  const record = new Record()

  // idTokenがある場合はユーザーによる更新
  if (idToken) {
    const player = new LineUser()
    const playerData = (await player.get(idToken)) as PlayerData
    const data = await record.createDailyRecord(
      playerData,
      date,
      weight,
      content,
      remarks
    )
    res.status(201).json(data)
  }

  // lineIdがある場合は監督による更新
  if (lineId) {
    const data = await record.updateManagersComment(lineId, date, comments)
    res.status(202).json(data)
  }
}

export default dailyRecord
