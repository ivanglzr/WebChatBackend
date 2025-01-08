import { Router } from "express";

import { messageController } from "./controller";

const messageRouter = Router({ mergeParams: true });

messageRouter.get("/", messageController.getMessages);
messageRouter.get(":messageId", messageController.getMessage);

export default messageRouter;
