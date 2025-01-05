import { registerSchema } from "@/auth/schemas";
import { UUID } from "crypto";
import { z } from "zod";

export interface ICreateUser extends z.infer<typeof registerSchema> {}

export interface IUser extends ICreateUser {
  id: UUID;
}
