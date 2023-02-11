import { dynamo } from '../app'
import type { LineUserData } from '../types'
import { getNowDatetime } from '../utils/timeGenerators'

class LineUser {
  // 選手の新規登録
  public create(lineId: string, lineName: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const recordExistence = await this.checkRecordExistence(lineId)
      const nowDatetime = getNowDatetime()
      if (recordExistence) {
        resolve(false)
      } else {
        const userData: LineUserData = {
          lineId,
          lineName,
          followedAt: nowDatetime,
        }
        const insertParams = {
          TableName: 'lineusers',
          Item: userData,
        }

        dynamo.put(insertParams, (err, data) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log('inserted successfully!', data)
            resolve(true)
          }
        })
      }
    })
  }

  // 選手の個別データ取得
  public get(idToken: string) {
    return new Promise((resolve, reject) => {
      // idtokenからlineIdを取得する処理は後ほど実装する

      const lineId = 'Ubca9519f029b6af8e53a9b54ffe92cae' // 開発のため固定ID
      const selectParams = {
        TableName: 'lineusers',
        Key: {
          lineId,
        },
      }

      dynamo.get(selectParams, (err, data) => {
        if (err) reject(err)

        if (data.Item) {
          console.log('player data', data.Item)
          resolve(data.Item)
        } else {
          resolve({})
        }
      })
    })
  }

  // 選手がDBに登録されているかチェックする
  private checkRecordExistence(lineId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const selectParams = {
        TableName: 'lineusers',
        Key: {
          lineId,
        },
      }

      dynamo.get(selectParams, (err, data) => {
        if (err) {
          reject(err)
        } else {
          if (data.Item !== undefined) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  }
}

export default LineUser
