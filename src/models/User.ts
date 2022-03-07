import { dynamo } from "../app";
const TABLE_NAME = process.env.TABLE_NAME!;
import {UserRecord} from "../types";

class User {
  constructor(
    private lineId: string,
    private displayName: string
  ) {}

  public createUserRecord(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const recordExistence = await this.checkRecordExistence(this.lineId);
      if (recordExistence) {
        resolve(false);
      } else {
        const userRecord: UserRecord = {
          lineId: this.lineId,
          displayName: this.displayName,
          followedAt: new Date().getTime(),
          invitedBy: "",
          invite: [],
          birthday: "not-registered",
          birthyear: "",
        }
        const insertParams = {
          TableName: TABLE_NAME,
          Item: userRecord
        };

        dynamo.put(insertParams, (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log("inserted successfully!", data);
            resolve(true);
          }
        });
      }
    });
  }

  public birthRegist(birthday: string): Promise<{registered: boolean; date: string}> {
    return new Promise(async (resolve, reject) => {
      const birthArray = birthday.split("/");
      const registeredBirth = await this.birthCheck(this.lineId);
      if (registeredBirth === "not-registered" || registeredBirth === "") {
        const updateParams = {
          TableName: TABLE_NAME,
          Key: {
            lineId: this.lineId
          },
          UpdateExpression: "set birthday = :date, birthyear = :year",
          ExpressionAttributeValues: {
            ":date": `${birthArray[1]}-${birthArray[2]}`,
            ":year": birthArray[0]
          },
          ReturnedValue: "UPDATED",
        };
        dynamo.update(updateParams, (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log("お誕生日登録成功", data);
            resolve({
              registered: false,
              date: birthday,
            });
          }
        });
      } else {
        resolve({
          registered: true,
          date: registeredBirth
        });
      }
    })
  }

  private checkRecordExistence(lineId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const selectParams = {
        TableName: TABLE_NAME,
        Key: {
          lineId,
        }
      };

      dynamo.get(selectParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (data.Item !== undefined) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  }

  private birthCheck(lineId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const selectParams = {
        TableName: TABLE_NAME,
        Key: {
          lineId,
        }
      };

      dynamo.get(selectParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (data.Item !== undefined) {
            resolve(data.Item.birthday);
          } else {
            resolve("");
          }
        }
      });
    })
  }
};

export default User;
