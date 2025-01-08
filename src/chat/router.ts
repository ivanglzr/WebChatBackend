import { Router } from "express";

import { chatController } from "./controller";

import messageRouter from "@/message/router";

import validateId from "@/common/middlewares/validateId";

export enum CHAT_ROUTES {
  PREFIX = "/chat",
}

const chatRouter = Router();

chatRouter.get("/", chatController.getUserChats);
chatRouter.get("/:chatId", validateId("chatId"), chatController.getChatById);

chatRouter.post("/", chatController.createChat);

chatRouter.put("/:chatId", validateId("chatId"), chatController.editChat);

chatRouter.delete("/:chatId", validateId("chatId"), chatController.deleteChat);

chatRouter.use("/:chatId/message", validateId("chatId"), messageRouter);

export default chatRouter;
