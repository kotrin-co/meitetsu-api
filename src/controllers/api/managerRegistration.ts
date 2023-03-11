import { Request, Response } from 'express'
import Admin from '../../models/Admin'
import * as _ from 'lodash'

const managerRegistration = async (req: Request, res: Response) => {
  console.log('manager-registration!!', req.body)
  // beforeがある場合は更新、afterは更新対象
  const { before, after } = req.body
  const { email, team, name } = after

  const beforeEmail = _.get(before, 'email')
  const beforeTeam = _.get(before, 'team')
  const beforeName = _.get(before, 'name')

  // 新規登録かどうか
  const isNew = !beforeEmail && !beforeTeam && !beforeName

  // 更新でemailが変わるか
  const isEmailUpdate = beforeEmail && beforeEmail !== email

  // email以外の更新
  const isOtherUpdate = beforeEmail && beforeEmail === email

  const admin = new Admin()

  try {
    // 新規登録
    if (isNew) {
      // レスポンス null:すでにメアドが登録されている  managerデータ:登録成功
      const created = await admin.create(email, team, name)

      if (!created) {
        return res.status(202).json({
          message: 'すでに登録済みのメールアドレスです',
        })
      }

      return res
        .status(201)
        .json({ message: '監督の新規登録に成功しました', manager: created })
    }

    // email以外の更新
    if (isOtherUpdate) {
      // レスポンス managerデータ:更新成功
      const updated = await admin.update(email, team, name)
      console.log('updated', updated)

      return res
        .status(201)
        .json({ message: '監督データの更新に成功しました', manager: updated })
    }

    // emailの更新がある場合
    if (isEmailUpdate) {
      // emailの重複チェック
      const duplicate = await admin.get(email)
      if (!_.isEmpty(duplicate)) {
        return res.status(202).json({
          message: 'すでに登録済みのメールアドレスです',
        })
      }
      const deleted = await admin.delete(before.email)
      const created = await admin.create(email, team, name)
      return res
        .status(201)
        .json({ message: '監督データの更新に成功しました', manager: created })
    }
  } catch (error) {
    res.status(500).json({
      message: '監督情報の登録に失敗しました',
    })
  }
}

export default managerRegistration
