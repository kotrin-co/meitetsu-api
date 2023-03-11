import { dynamo, client } from '../app'
import type { LineUserData, PlayerRegistrationData } from '../types'
import { getNowDatetime } from '../utils/timeGenerators'
import axios from 'axios'
import * as qs from 'qs'

const LINE_LOGIN_CHANNEL_ID = process.env.LINE_LOGIN_CHANNEL_ID || ''
const RICHMENU_ID_2 = process.env.RICHMENU_ID_2 || ''

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
          this.getUserByLineId(lineId)
            .then((user) => resolve(user))
            .catch((e) => reject(e))
        })
        .catch((e) => reject(e))
    })
  }

  // チームの選手の取得
  public getTeamMembers(team: string) {
    return new Promise((resolve, reject) => {
      // クエリパラメータ
      const params = {
        TableName: 'lineusers', // テーブル名
        IndexName: 'team-index', // 作成したGSI名
        KeyConditionExpression: '#indexKey = :indexValue', // 条件を指定
        ExpressionAttributeNames: {
          '#indexKey': 'team', // GSIの作成時に指定したキー名を設定
        },
        ExpressionAttributeValues: {
          ':indexValue': team,
        },
      }

      dynamo.query(params, (err, data) => {
        if (err) reject(err)

        if (data.Items) {
          console.log('team members', data.Items)
          resolve(data.Items)
        } else {
          resolve({})
        }
      })
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

              // 登録成功したらリッチメニューを切り替える
              client
                .linkRichMenuToUser(lineId, RICHMENU_ID_2)
                .then(() => resolve())
                .catch((e) => reject(e))
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

  // lineIdからユーザー情報を取得する
  public getUserByLineId(lineId: string) {
    return new Promise((resolve, reject) => {
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
}

export default LineUser
