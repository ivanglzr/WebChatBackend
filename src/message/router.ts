import { Router } from "express";

import { messageController } from "./controller";
import validateId from "@/common/middlewares/validateId";

const messageRouter = Router({ mergeParams: true });

messageRouter.get("/", messageController.getMessages);
messageRouter.get(
  "/:messageId",
  validateId("messageId"),
  messageController.getMessage
);

export default messageRouter;
