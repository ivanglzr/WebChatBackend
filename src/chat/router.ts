import { Router } from "express";

import { chatController } from "./controller";

import validateId from "@/common/middlewares/validateId";

export enum CHAT_ROUTES {
  PREFIX = "/chat",
}

const chatRouter = Router();

chatRouter.get("/", chatController.getUserChats);
chatRouter.get("/:chatId", validateId("chatId"), chatController.getChatById);

chatRouter.post("/", chatController.createChat);

chatRouter.put("/:chatId", validateId("chatId"), chatController.editChat);

export default chatRouter;
