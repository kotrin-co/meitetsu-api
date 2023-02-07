import { FollowEvent } from "@line/bot-sdk";
import { client } from "../../../app";
import Player from "../../../models/Player";

const handleFollowEvent = async (event: FollowEvent) => {
  if (event.type !== "follow") {
    return;
  }

  console.log("followEvent:", event);

  const { replyToken } = event;
  const lineId = event.source.userId!;
  const profile = await client.getProfile(lineId);
  const displayName = profile.displayName;

  const player = new Player();
  const insert = await player.create(lineId, displayName);
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
