import { Request } from "express";

import { UUID } from "crypto";

declare module "express-serve-static-core" {
  interface Request {
    session: { id: UUID };
  }
}
