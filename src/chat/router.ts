import { Router } from "express";

import { chatController } from "./controller";

export enum CHAT_ROUTES {
  PREFIX = "/chat",
}

const chatRouter = Router();

chatRouter.post("/", chatController.createChat);

export default chatRouter;
