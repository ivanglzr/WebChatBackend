import { Router } from "express";

import { authController } from "./controller";

export enum AUTH_ROUTES {
  LOG_IN = "/log-in",
  REGISTER = "/register",
}

const authRouter = Router();

authRouter.post(AUTH_ROUTES.LOG_IN, authController.logIn);
authRouter.post(AUTH_ROUTES.REGISTER, authController.register);

export default authRouter;
