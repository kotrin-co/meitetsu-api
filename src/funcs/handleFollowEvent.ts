import { FollowEvent } from "@line/bot-sdk";
import {
  client,
  dynamo
} from "../app";

const TABLE_NAME = process.env.TABLE_NAME!;

type DynamoInsertParams = {
  TableName: string;
  Item: {
    lineId: string;
    displayName: string;
    followedAt: number;
    invitedBy: string;
    invite: string[];
    birthday: string;
  }
};

const handleFollowEvent = async (event: FollowEvent) => {
  if (event.type !== "follow") {
    return;
  }

  const {replyToken} = event;
  const lineId = event.source.userId!;
  const profile = await client.getProfile(lineId);
  const displayName = profile.displayName;

  await insertUserData(lineId, displayName);
  await client.replyMessage(replyToken, {
    type: "text",
    text: `${displayName}さん、お友だち登録ありがとうございます^^ ダイナモにデータを格納しました^^`
  })
};

const insertUserData = (
  lineId: string,
  displayName: string
) => {
  return new Promise((resolve, reject) => {
    const insertParams: DynamoInsertParams = {
      TableName: TABLE_NAME,
      Item: {
        "lineId": lineId,
        "displayName": displayName,
        "followedAt": new Date().getTime(),
        "invitedBy": "",
        "invite": [],
        "birthday": "",
      }
    };

    dynamo.put(insertParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("inserted successfully!", data);
        resolve(data);
      }
    })
  });
}

export default handleFollowEvent;