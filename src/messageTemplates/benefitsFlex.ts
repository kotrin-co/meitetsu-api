import { FlexMessage } from "@line/bot-sdk";

const BENEFIT_IMAGE = "https://answer.salon/line_images/answer_LINE_inviting_benefits.png";

const benefitsFlex = (): FlexMessage => {
  return {
    type: "flex",
    altText: "お友だち紹介特典",
    contents:
      {
        "type": "bubble",
        "size": "giga",
        "hero": {
          "type": "image",
          "url": BENEFIT_IMAGE,
          "size": "full"
        }
      }
  };
};

export default benefitsFlex;
