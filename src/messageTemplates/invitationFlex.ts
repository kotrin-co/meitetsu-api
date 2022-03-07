import { FlexMessage } from "@line/bot-sdk";

const INVITATION_IMAGE = "https://answer.salon/line_images/invitation.png";
const LIFF_URL = `https://liff.line.me/${process.env.LIFF_ID_INVITATION}`;

// お友だち登録してプレゼントをゲット！+改行
const message = "%E3%81%8A%E5%8F%8B%E3%81%A0%E3%81%A1%E7%99%BB%E9%8C%B2%E3%81%97%E3%81%A6%E3%83%97%E3%83%AC%E3%82%BC%E3%83%B3%E3%83%88%E3%82%92%E3%82%B2%E3%83%83%E3%83%88%EF%BC%81%0D%0A";

const invitationFlex = (lineId: string): FlexMessage => {
  return {
    type: "flex",
    altText: "お友だちご招待",
    contents:
      {
        "type": "bubble",
        "size": "mega",
        "hero": {
          "type": "image",
          "url": INVITATION_IMAGE,
          "action": {
            "type": "uri",
            "label": "action",
            "uri": `https://line.me/R/share?text=${message}${LIFF_URL}?${lineId}`
          },
          "size": "full"
        }
      }
  };
};

export default invitationFlex;
