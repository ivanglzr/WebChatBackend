import { z } from "zod";

const chatNameSchema = z
  .string({
    required_error: "Chat name is required",
    invalid_type_error: "Chat name must be a string",
  })
  .min(1, "Chat name is required")
  .max(100, "Chat name can't have more than a 100 characters");

const usersIdsSchema = z
  .array(
    z
      .string({
        invalid_type_error: "A user id must be a string",
      })
      .uuid("A user id must be a valid uuid")
  )
  .nonempty("A chat must have at least 1 member");

export const chatSchema = z.object({
  chatName: chatNameSchema,
  usersIds: usersIdsSchema,
});
