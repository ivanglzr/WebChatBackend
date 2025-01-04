import express from "express";
import { createServer } from "node:http";

import cookieParser from "cookie-parser";

import authRouter, { AUTH_ROUTES } from "./auth/router";
import userRouter, { USER_ROUTES } from "./user/router";

import authenticateUser from "./auth/middlewares/authenticate-user";
import morgan from "morgan";

const app = express();
const server = createServer(app);

app.disable("x-powered-by");

app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

app.use(AUTH_ROUTES.PREFIX, authRouter);

app.use(authenticateUser);

app.use(USER_ROUTES.PREFIX, userRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: "Page not found",
  });
});

export default server;
