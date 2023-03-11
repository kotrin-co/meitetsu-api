import { Request, Response } from 'express'
import Record from '../../models/Record'
import LineUser from '../../models/LineUser'
import { format } from 'date-fns'
import type { PlayerData, RecordData } from '../../types'

const getTeamRecords = async (req: Request, res: Response) => {
  console.log('get-team-records!!', req.body)
  const { team, start, end } = req.body

  const lineUser = new LineUser()
  const players = (await lineUser.getTeamMembers(team)) as Array<
    PlayerData & { latestUpdate?: { updatedAt: string; date: string } }
  >

  const record = new Record()
  const records = (await record.getTeamRecords(
    team,
    start,
    end
  )) as Array<RecordData>

  // playersに最終更新日時を追加する
  players.forEach((player) => {
    const lineId = player.lineId
    const sortedRecords = records
      .filter((record) => record.lineId === lineId)
      .sort((a, b) => {
        if (a.updatedAt > b.updatedAt) return -1
        else if (a.updatedAt < b.updatedAt) return 1
        else return 0
      })

    if (sortedRecords.length)
      player.latestUpdate = {
        updatedAt: format(
          new Date(sortedRecords[0].updatedAt),
          'yyyy-MM-dd HH:mm:ss'
        ),
        date: sortedRecords[0].date,
      }
  })

  res.status(200).json({
    players,
    records,
  })
}

export default getTeamRecords
