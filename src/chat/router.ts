import { Router } from "express";

import { chatController } from "./controller";

export enum CHAT_ROUTES {
  PREFIX = "/chat",
}

const chatRouter = Router();

chatRouter.get("/", chatController.getUserChats);

chatRouter.post("/", chatController.createChat);

export default chatRouter;
