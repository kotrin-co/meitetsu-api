import express from "express";
import getPlayer from "../controllers/api/getPlayer";

const apiRouter = express.Router();

// LINE Webhook
apiRouter.post("/get-player", getPlayer);

export default apiRouter;
