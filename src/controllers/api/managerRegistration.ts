import { Request, Response } from 'express'
import Admin from '../../models/Admin'

const managerRegistration = async (req: Request, res: Response) => {
  console.log('manager-registration!!', req.body)
  const { email, team, name } = req.body
  const admin = new Admin()

  try {
    // レスポンス false:登録済み、true:登録成功
    const created = await admin.create(email, team, name)

    if (!created) {
      return res.status(202).json({
        message: 'すでに登録済みのメールアドレスです',
      })
    }

    return res.status(201).json({ message: '監督登録に成功しました' })
  } catch (error) {
    res.status(500).json({
      message: '監督情報の登録に失敗しました',
    })
  }
}

export default managerRegistration
