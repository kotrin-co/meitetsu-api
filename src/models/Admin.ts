import { dynamo } from '../app'
import * as _ from 'lodash'
import { getNowDatetime } from '../utils/timeGenerators'
import type { AdminData } from '../types'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
const cognito = new CognitoIdentityServiceProvider()
const userPoolId = process.env.USER_POOL_ID || ''

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

  // 全ての管理者データの抜き出し
  public async getAdmins() {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: 'admins', // テーブル名
        IndexName: 'type-index', // 作成したGSI名
        KeyConditionExpression: '#indexKey = :indexValue', // 条件を指定
        ExpressionAttributeNames: {
          '#indexKey': 'type', // GSIの作成時に指定したキー名を設定
        },
        ExpressionAttributeValues: {
          ':indexValue': 'admin',
        },
      }
      dynamo.query(params, (err, data) => {
        if (err) reject(err)
        console.log('admin', data)
        if (data.Items) {
          console.log('admin data', data.Items)
          resolve(data.Items)
        } else {
          resolve({})
        }
      })
    })
  }

  // 全ての監督データの抜き出し
  public getManagers() {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: 'admins', // テーブル名
        IndexName: 'type-index', // 作成したGSI名
        KeyConditionExpression: '#indexKey = :indexValue', // 条件を指定
        ExpressionAttributeNames: {
          '#indexKey': 'type', // GSIの作成時に指定したキー名を設定
        },
        ExpressionAttributeValues: {
          ':indexValue': 'manager',
        },
      }

      dynamo.query(params, (err, data) => {
        if (err) reject(err)

        console.log('managers', data)

        if (data.Items) {
          console.log('admin data', data.Items)
          resolve(data.Items)
        } else {
          resolve({})
        }
      })
    })
  }

  // 監督情報の登録（重複：false、登録成功:trueを返す）
  public create(
    email: string,
    team: string,
    name: string
  ): Promise<AdminData | null> {
    return new Promise((resolve, reject) => {
      // emailですでに登録がないかチェック
      this.get(email).then((data) => {
        // すでに登録済みの場合は終了
        if (!_.isEmpty(data)) resolve(null)

        // 未登録の場合はcognitoへユーザー登録する
        cognito
          .adminCreateUser({
            UserPoolId: userPoolId,
            Username: email,
          })
          .promise()
          .then((user) => {
            console.log('登録完了', JSON.stringify(user, null, 4))

            // 未登録の場合はdynamoDBへ登録する
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
                this.get(email)
                  .then((manager) => {
                    console.log('manager created successfully!', manager)
                    resolve(manager as AdminData)
                  })
                  .catch((e) => reject(e))
              }
            })
          })
      })
    })
  }

  // 監督データの更新
  public update(email: string, team: string, name: string): Promise<AdminData> {
    return new Promise((resolve, reject) => {
      const updatedAt = getNowDatetime()
      // 更新パラメータ
      const params = {
        TableName: 'admins',
        Key: {
          email,
        },
        UpdateExpression: 'set #n = :name, #t = :team, #r = :registeredAt',
        ExpressionAttributeNames: {
          '#n': 'name',
          '#t': 'team',
          '#r': 'registeredAt',
        },
        ExpressionAttributeValues: {
          ':name': name,
          ':team': team,
          ':registeredAt': updatedAt,
        },
        ReturnValues: 'ALL_NEW',
      }

      dynamo.update(params, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }

        const manager = data.Attributes as AdminData
        console.log('dynamo update', data.Attributes)
        resolve(manager)
      })
    })
  }

  // 監督データの削除
  public delete(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // ユーザープールから削除
      cognito
        .adminDeleteUser({
          UserPoolId: userPoolId,
          Username: email,
        })
        .promise()
        .then(() => {
          // dynamoから削除
          const params = {
            TableName: 'admins',
            Key: {
              email,
            },
          }

          dynamo.delete(params, (err, data) => {
            if (err) reject(err)

            console.log('dynamo delete admin:', data)
            resolve(true)
          })
        })
        .catch((e) => reject(e))
    })
  }
}

export default Admin
