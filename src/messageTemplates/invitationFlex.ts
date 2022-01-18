import {FlexMessage} from "@line/bot-sdk";
const INVITATION_IMAGE = "https://answer.salon/line_images/invitation.png";
const LIFF_URL = "https://liff.line.me/1656328837-ypWkblLv";

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
            "uri": `https://line.me/R/share?text=${LIFF_URL}?${lineId}`
          },
          "size": "full"
        }
      }
  };
};

export default invitationFlex;
