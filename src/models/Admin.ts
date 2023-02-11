import { dynamo } from '../app'
import * as _ from 'lodash'
import { getNowDatetime } from '../utils/timeGenerators'
import type { AdminData } from '../types'

class Admin {
  // emailより監督or管理者の情報取得
  public get(email: string) {
    return new Promise((resolve, reject) => {
      const selectParams = {
        TableName: 'admins',
        Key: {
          email,
        },
      }

      dynamo.get(selectParams, (err, data) => {
        if (err) reject(err)

        if (data.Item) {
          console.log('admin data', data.Item)
          resolve(data.Item)
        } else {
          resolve({})
        }
      })
    })
  }

  // 監督情報の登録（重複：false、登録成功:trueを返す）
  public create(email: string, team: string, name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // emailですでに登録がないかチェック
      this.get(email).then((data) => {
        // すでに登録済みの場合は終了
        if (!_.isEmpty(data)) resolve(false)

        // 未登録の場合は登録処理を進める
        const nowDatetime = getNowDatetime() // 登録日時
        const adminData: AdminData = {
          email,
          team,
          name,
          type: 'manager',
          registeredAt: nowDatetime,
        }
        const insertParams = {
          TableName: 'admins',
          Item: adminData,
        }

        dynamo.put(insertParams, (err, data) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log('manager created successfully!', data)
            resolve(true)
          }
        })
      })
    })
  }
}

export default Admin
