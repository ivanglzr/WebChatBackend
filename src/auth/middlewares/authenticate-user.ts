import { tokenService } from "../services";

import { authCookieName } from "../config";

import { UUID } from "crypto";
import { NextFunction, Response, Request } from "express";

export default async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies[authCookieName];

  if (!token) {
    res.status(401).json({
      statusCode: 401,
      message: "Petition unauthorized please log in",
    });

    return;
  }

  const payload = await tokenService.verify(token);

  if (!payload) {
    res.status(401).json({
      statusCode: 401,
      message: "Petition unauthorized please log in",
    });

    return;
  }

  req.session = { id: payload.id as UUID };

  next();
}
