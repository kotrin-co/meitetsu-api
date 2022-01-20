import { DynamoDB } from "aws-sdk";
import {
  ClientConfig,
  Client,
} from "@line/bot-sdk";

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN!,
  channelSecret: process.env.CHANNEL_SECRET,
};
export const client = new Client(clientConfig);
export const dynamo = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME!;

type UserRecord = {
  lineId: string;
  displayName: string;
  followedAt: number;
  invitedBy: string;
  invite: string[];
  birthday: string;
  birthyear: string;
};

export const birthWatcher = async () => {
  const targetUsers: any = await getTargetUsers();
  if (targetUsers.length) {
    const promises = [];
    for (let i = 0; i < targetUsers.length; i++) {
      const user = targetUsers[i];
      promises.push(
        client.pushMessage(user.lineId, {
          type: "text",
          text: `${user.displayName}さん、お誕生日おめでとうございます！`,
        })
      );
    }

    await Promise.all(promises)
      .then(() => console.log("すべてのユーザーへ誕生日メッセージ配信完了"))
      .catch((err) => console.log(err));
  }
}

const getTargetUsers = () => {
  return new Promise((resolve, reject) => {
    const today = (new Date().getMonth() + 1) + "-" + new Date().getDate();
    const searchParams = {
      TableName: TABLE_NAME,
      IndexName: "birthday-index",
      KeyConditionExpression: "#attrName = :attrValue",
      ExpressionAttributeNames: {
        "#attrName": "birthday"
      },
      ExpressionAttributeValues: {
        ":attrValue": today
      }
    };
    dynamo.query(searchParams, (err, user) => {
      if (err) {
        console.log("お誕生日ユーザー取得失敗");
        reject(err);
      } else {
        console.log("お誕生日ユーザー取得成功");
        resolve(user.Items);
      }
    });
  });
};
