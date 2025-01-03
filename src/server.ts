import express from "express";
import { createServer } from "node:http";

import cookieParser from "cookie-parser";

import authRouter from "./auth/router";

import authenticateUser from "./auth/middlewares/authenticate-user";

const app = express();
const server = createServer(app);

app.disable("x-powered-by");

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

app.use(authenticateUser);

export default server;
