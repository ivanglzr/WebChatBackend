import { z } from "zod";

import { NextFunction, Request, Response } from "express";

const uuidSchema = z.string().uuid();

const validateId =
  (paramIdName: string = "id") =>
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramIdName];

    const { error } = uuidSchema.safeParse(id);

    if (error) {
      res.status(400).json({
        statusCode: 400,
        message: "Invalid id",
      });

      return;
    }

    next();
  };

export default validateId;
