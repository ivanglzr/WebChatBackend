import { z } from "zod";

const fullnameSchema = z
  .string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  })
  .min(1, "Name is required")
  .min(2, "Name must have at least 2 characters")
  .max(60, "Name can't have more than 60 characters");

const emailSchema = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email({ message: "Email must be valid" })
  .min(1, "Email is required")
  .min(5, "Email must have at least 5 characters")
  .max(100, "Email can't have more than 100 characters");

const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .min(1, "Password is required")
  .min(6, "Password must have at least 6 characters")
  .max(100);

export const logInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  fullname: fullnameSchema,
  email: emailSchema,
  password: passwordSchema,
});
