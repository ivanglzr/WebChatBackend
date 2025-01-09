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

messageRouter.post("/", messageController.postMessage);

messageRouter.put(
  "/:messageId",
  validateId("messageId"),
  messageController.putMessage
);

messageRouter.delete(
  "/:messageId",
  validateId("messageId"),
  messageController.deleteMessage
);

export default messageRouter;
