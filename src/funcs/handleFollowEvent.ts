import { FollowEvent } from "@line/bot-sdk";
import { client } from "../app";
import User from "../models/User";

const handleFollowEvent = async (event: FollowEvent) => {
  if (event.type !== "follow") {
    return;
  }

  const {replyToken} = event;
  const lineId = event.source.userId!;
  const profile = await client.getProfile(lineId);
  const displayName = profile.displayName;

  const user = new User(lineId, displayName);
  const insert = await user.createUserRecord();
  const returnMessage = insert ? `${displayName}さん、お友だち登録ありがとうございます^^ ダイナモにデータを格納しました^^` : "すでにお友だち登録されています";
  await client.replyMessage(replyToken, {
    type: "text",
    text: returnMessage,
  });
};

export default handleFollowEvent;