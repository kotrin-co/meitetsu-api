import { FollowEvent } from "@line/bot-sdk";
import { client } from "../app";
import User from "../models/User";
import birthdayRegistrationFlex from "../messageTemplates/birthdayRegistrationFlex";

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
  const message = insert ? `${displayName}さんをDynamoDBへ格納成功` : `${displayName}さんはすでにお友だち登録されています`;
  console.log(message);
  const birthRegistMessage = birthdayRegistrationFlex();
  await client.replyMessage(replyToken, birthRegistMessage);
};

export default handleFollowEvent;