import { dynamo } from '../app'
import { getNowDatetime } from '../utils/timeGenerators'
import { RecordData } from '../types'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

type QueryParam = {
  TableName: string
  KeyConditionExpression: string
  ExpressionAttributeNames: { [key: string]: string }
  ExpressionAttributeValues: { [key: string]: string }
  ExclusiveStartKey?: DocumentClient.Key
}

class Record {
  // 練習ノートの記録
  public createDailyRecord(
    lineId: string,
    date: string,
    weight: string,
    content: string,
    remarks: string
  ) {
    return new Promise((resolve, reject) => {
      // まずはLINE IDと日付が一致するレコードが存在するかをチェック
      const queryParams = {
        TableName: 'dailyrecords',
        Key: {
          lineId,
          date,
        },
      }

      dynamo.get(queryParams, (err, data) => {
        if (err) reject(err)

        const record = data.Item
        console.log('daily-records:', record)

        // recordsがなければ新規作成
        if (!record) {
          const createdAt = getNowDatetime()
          const updatedAt = getNowDatetime()

          const Item = {
            lineId,
            date,
            weight,
            content,
            remarks,
            createdAt,
            updatedAt,
          }

          const params = {
            TableName: 'dailyrecords',
            Item,
          }

          dynamo.put(params, (err, data) => {
            if (err) {
              console.log(err)
              reject(err)
            } else {
              console.log('create record succeeded', data)
              resolve(data)
            }
          })
        }

        // recordsがあれば更新
        if (record) {
          const updatedAt = getNowDatetime()

          // 更新パラメータ
          const updateParams = {
            TableName: 'dailyrecords',
            Key: {
              lineId,
              date,
            },
            UpdateExpression:
              'set weight = :weight, content = :content, remarks = :remarks, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
              ':weight': weight,
              ':content': content,
              ':remarks': remarks,
              ':updatedAt': updatedAt,
            },
            ReturnValues: 'ALL_NEW',
          }

          dynamo.update(updateParams, (err, data) => {
            if (err) reject(err)

            console.log('dynamo update', data)
            resolve(data)
          })
        }
      })
    })
  }

  // 選手の記録ノートを指定期間取得する
  public async getPlayerRecors(lineId: string, start: string, end: string) {
    const params: QueryParam = {
      TableName: 'dailyrecords',
      KeyConditionExpression:
        '#lineId = :lineId and #date between :startdate and :enddate',
      ExpressionAttributeNames: {
        '#lineId': 'lineId',
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':lineId': lineId,
        ':startdate': start,
        ':enddate': end,
      },
    }

    const items: RecordData[] = []

    const query = async () => {
      const result = await dynamo.query(params).promise()
      items.push(...(result.Items as Array<RecordData>))

      if (result.LastEvaluatedKey) {
        params.ExclusiveStartKey = result.LastEvaluatedKey // 上限1MB対応
        await query()
      }
    }

    try {
      await query()
      return items
    } catch (error) {
      return error
    }
  }
}

export default Record
