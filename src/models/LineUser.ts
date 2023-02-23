import { dynamo } from '../app'
import type { LineUserData, PlayerRegistrationData } from '../types'
import { getNowDatetime } from '../utils/timeGenerators'
import axios from 'axios'
import * as qs from 'qs'

const LINE_LOGIN_CHANNEL_ID = process.env.LINE_LOGIN_CHANNEL_ID || ''

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
      this.getLineIdByIdToken(idToken)
        .then((lineId) => {
          // const lineId = 'Ubca9519f029b6af8e53a9b54ffe92cae' // 開発のため固定ID
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
        .catch((e) => reject(e))
    })
  }

  // 選手の情報登録
  public register({
    idToken,
    birthday,
    sex,
    team,
    displayName,
    positions,
    agreement,
  }: PlayerRegistrationData): Promise<void> {
    return new Promise((resolve, reject) => {
      // idトークンからLINE IDを取得する
      this.getLineIdByIdToken(idToken)
        .then((lineId) => {
          // const lineId = 'Ubca9519f029b6af8e53a9b54ffe92cae'

          // 選手がDBに登録されているかチェックする
          this.checkRecordExistence(lineId).then((isPresent) => {
            if (!isPresent) reject('友だち登録されていません')

            // 更新パラメータ
            const params = {
              TableName: 'lineusers',
              Key: {
                lineId,
              },
              UpdateExpression:
                'set birthday = :birthday, sex = :sex, team = :team, displayName = :displayName, positions = :positions, agreement = :agreement',
              ExpressionAttributeValues: {
                ':birthday': birthday,
                ':sex': sex,
                ':team': team,
                ':displayName': displayName,
                ':positions': positions,
                ':agreement': agreement,
              },
              ReturnValues: 'ALL_NEW',
            }

            dynamo.update(params, (err, data) => {
              if (err) reject(err)

              console.log('dynamo update', data)
              resolve()
            })
          })
        })
        .catch((e) => reject(e))
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

  // idTokenからLINE IDを取得する
  public getLineIdByIdToken(idToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let lineId = ''
      const postData = {
        id_token: idToken,
        client_id: LINE_LOGIN_CHANNEL_ID,
      }
      axios
        .post('https://api.line.me/oauth2/v2.1/verify', qs.stringify(postData))
        .then((response) => {
          console.log('token res', response)
          lineId = response.data.sub
          resolve(lineId)
        })
        .catch((e) => reject(e))
    })
  }
}

export default LineUser
