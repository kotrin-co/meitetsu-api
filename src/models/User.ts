import {dynamo} from "../app";
const TABLE_NAME = process.env.TABLE_NAME!;

type UserRecord = {
  lineId: string;
  displayName: string;
  followedAt: number;
  invitedBy: string;
  invite: string[];
  birthday: string;
};

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
          birthday: ""
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
};

export default User;
