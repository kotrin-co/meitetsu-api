import { FollowEvent } from "@line/bot-sdk";
import { client } from "../../../app";
import LineUser from "../../../models/LineUser";

const handleFollowEvent = async (event: FollowEvent) => {
  if (event.type !== "follow") {
    return;
  }

  console.log("followEvent:", event);

  const { replyToken } = event;
  const lineId = event.source.userId!;
  const profile = await client.getProfile(lineId);
  const displayName = profile.displayName;

  const user = new LineUser();
  const insert = await user.create(lineId, displayName);
  const message = insert
    ? `${displayName}さんをDynamoDBへ格納成功`
    : `${displayName}さんはすでにお友だち登録されています`;
  console.log(message);
  await client.replyMessage(replyToken, {
    type: "text",
    text: message,
  });
};

export default handleFollowEvent;
