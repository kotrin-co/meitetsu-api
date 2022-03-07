import express, {Request, Response} from "express";
import linebot from "../controllers/linebot";
import handleInvitation from "../controllers/handleInvitation";
import {
  middleware,
  MiddlewareConfig
} from "@line/bot-sdk";

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET!,
};

const router = express.Router();

router.get("/invitation", (req: Request, res: Response) => res.render("invite"));
router.post("/hook", middleware(middlewareConfig), (req: Request, res: Response) => linebot(req, res));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.post("/invited", (req: Request, res: Response) => {
  const {
    invitedBy,
    idToken,
  } = req.body;
  handleInvitation(
    req,
    res,
    invitedBy,
    idToken
  );
});

export default router;