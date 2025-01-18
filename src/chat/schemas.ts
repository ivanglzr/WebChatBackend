import { z } from "zod";

const chatNameSchema = z
  .string({
    required_error: "Chat name is required",
    invalid_type_error: "Chat name must be a string",
  })
  .min(1, "Chat name is required")
  .max(100, "Chat name can't have more than a 100 characters");

const memberIdsSchema = z
  .array(
    z
      .string({
        invalid_type_error: "A user id must be a string",
      })
      .uuid("A user id must be a valid uuid")
  )
  .transform((ids) => {
    const idsSet = new Set(ids);

    return Array.from(idsSet);
  });

export const chatSchema = z.object({
  chatName: chatNameSchema,
  memberIds: memberIdsSchema,
});
