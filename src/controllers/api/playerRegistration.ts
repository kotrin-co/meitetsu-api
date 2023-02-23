import { Request, Response } from 'express'
import LineUser from '../../models/LineUser'

const playerRegistration = async (req: Request, res: Response) => {
  const { idToken, birthday, sex, team, displayName, positions, agreement } =
    req.body

  const player = new LineUser()

  try {
    const data = await player.register({
      idToken,
      birthday,
      sex,
      team,
      displayName,
      positions,
      agreement,
    })
    console.log('res.data', data)
    res.status(201).json(data)
  } catch (error) {
    res.status(505).send('登録に失敗しました')
  }
}

export default playerRegistration
