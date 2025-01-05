import { z } from "zod";

import { chatSchema } from "../schemas";

import { UUID } from "crypto";

export interface ICreateChat extends z.infer<typeof chatSchema> {}

export interface IChat extends ICreateChat {
  id: UUID;
}
