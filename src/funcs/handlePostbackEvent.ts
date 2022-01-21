import { PostbackEvent } from "@line/bot-sdk";
import { client } from "../app";
import User from "../models/User";

const handlePostbackEvent = async (event: PostbackEvent) => {
  if (event.type !== "postback") {
    return;
  }

  const { replyToken } = event;
  const lineId = event.source.userId!;
  const profile = await client.getProfile(lineId);
  const displayName = profile.displayName;

  const { data } = event.postback;
  const header = data.split("&")[0];

  switch (header) {
    case "birthday":
      const birthday = data.split("&")[1];
      const user = new User(lineId, displayName);
      const { registered, date } = await user.birthRegist(birthday);
      console.log('誕生日登録レスポンス；', date);
      if (registered) {
        await client.replyMessage(replyToken, {
          type: "text",
          text: `${displayName}さんのお誕生日は${date.split("-")[0]}月${date.split("-")[1]}日で登録されております\u{1F60A}\nプレゼントを楽しみにしていてくださいね\u{2728}\u{2728}`
        });
      } else {
        await client.replyMessage(replyToken, {
          type: "text",
          text: `${displayName}さんのお誕生日を${date.split("/")[0]}年${date.split("/")[1]}月${date.split("/")[2]}日で登録しました\u{1F60A}\nプレゼントを楽しみにしていてくださいね\u{2728}\u{2728}`
        });
      }
      break;
  }

}

export default handlePostbackEvent;
