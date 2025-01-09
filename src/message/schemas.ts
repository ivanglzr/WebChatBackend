import { z } from "zod";

const contentSchema = z
  .string({
    required_error: "A message can't be empty",
    invalid_type_error: "A message must be a string",
  })
  .min(1, "A message can't be empty");

export const messageSchema = z.object({
  content: contentSchema,
});
