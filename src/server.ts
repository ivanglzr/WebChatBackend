import express from "express";
import { createServer } from "node:http";

import authRouter from "./auth/router";

const app = express();
const server = createServer(app);

app.disable("x-powered-by");

app.use(express.json());

app.use("/auth", authRouter);

export default server;
