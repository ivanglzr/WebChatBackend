import { Router } from "express";

import chatRouter, { CHAT_ROUTES } from "@/chat/router";

export enum USER_ROUTES {
  PREFIX = "/user",
}

const userRouter = Router();

userRouter.use(CHAT_ROUTES.PREFIX, chatRouter);

export default userRouter;
