import "express";
import { UUID } from "crypto";

declare module "express" {
  interface Request {
    session: { id: UUID };
  }
}
