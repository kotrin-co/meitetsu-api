import { MessageEvent } from "@line/bot-sdk";
import {
  client,
  dynamo
} from "../app";
import invitationFlex from "../messageTemplates/invitationFlex";
// import benefitsImageMap from "../messageTemplates/benefitsImageMap";
import birthConfirmFlex from "../messageTemplates/birthConfirmFlex";
import benefitsFlex from "../messageTemplates/benefitsFlex";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handleTextEvent = async (event: MessageEvent) => {
  if (event.type !== "message" || event.message.type !=="text") {
    return;
  }
  const {replyToken} = event;
  const {text} = event.message;
  const lineId = event.source.userId!;
  const profile = await client.getProfile(lineId);
  const displayName = profile.displayName;

  // 誕生日を正規表現でチェック
  const regex = /^(\d{4})年(\d{1,2})月(\d{1,2})日$/;

  if (regex.test(text)) {
    // 値が適正かチェック
    const birthYear = Number(text.split("年")[0]);
    const birthMonth = Number(text.split("月")[0].split("年")[1]);
    const birthDate = Number(text.split("月")[1].split("日")[0]);
    if (
      birthYear > 1922 && birthYear <= new Date().getFullYear()
      && birthMonth > 0 && birthMonth <= 12
      && birthDate > 0 && birthDate <= 31
    ) {
      const birthConfirmMessage = birthConfirmFlex(displayName, birthYear, birthMonth, birthDate);
      await client.replyMessage(replyToken, birthConfirmMessage);
    }
  } else {
    switch (text) {
      case "友達にanswerの公式LINEアカウントを紹介する":
        const invitationMessage = invitationFlex(lineId);
        await client.replyMessage(replyToken, invitationMessage);
        break;

      case "answerの公式LINEアカウントの友達紹介人数を確認する":
        const invitings = await getNumberOfInvitings(lineId);
        await client.replyMessage(replyToken, {
          type: "text",
          text: `${displayName}さんの紹介人数は${invitings}人です。`,
        });
        break;

      case "answerの公式LINEアカウントの友達紹介特典を確認する":
        // const imageMapMessage = benefitsImageMap();
        const benefitsFlexMessage = benefitsFlex();
        await client.replyMessage(replyToken, benefitsFlexMessage);
        break;
    }
  }
};

const getNumberOfInvitings = (lineId: string) => {
  return new Promise((resolve, reject) => {
    const selectParams = {
      TableName: TABLE_NAME,
      Key: {
        "lineId": lineId
      }
    };

    dynamo.get(selectParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (data.Item !== undefined) {
          const invitings = data.Item.invite.length;
          resolve(invitings);
        }
      }
    });
  });
};
