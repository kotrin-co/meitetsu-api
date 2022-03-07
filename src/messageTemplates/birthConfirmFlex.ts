import { FlexMessage } from "@line/bot-sdk";

const DATEPICKER_LIFF_URL = "https://liff.line.me/" + process.env.LIFF_ID_BIRTH_SELECT;

const birthConfirmFlex = (
  name: string,
  birthYear: number,
  birthMonth: number,
  birthDate: number
): FlexMessage => {
  return {
    "type": "flex",
    "altText": "お誕生日の確認",
    "contents": {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": `${name}さんのお誕生日を`,
            "wrap": true
          },
          {
            "type": "text",
            "text": `${birthYear}年${birthMonth}月${birthDate}日`,
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "で登録します。よろしいですか？"
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "postback",
              "label": "はい",
              "data": `birthday&${birthYear}/${birthMonth}/${birthDate}`
            }
          },
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "選びなおす",
              "uri": DATEPICKER_LIFF_URL
            }
          }
        ]
      },
      "styles": {
        "footer": {
          "separator": true
        }
      }
    }
  };
};

export default birthConfirmFlex;