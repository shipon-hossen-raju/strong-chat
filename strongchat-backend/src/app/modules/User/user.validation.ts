import { z } from "zod";

const CreateUserValidationSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"), // Ensure email is provided and is valid
  name: z.string().optional(),
  password: z.string().nonempty("Password is required"),
});

const UserLoginValidationSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
  password: z
    .string()
    .nonempty("Password is required"),
});

const userUpdateSchema = z.object({
  name: z.string().optional(),
});

export const UserValidation = {
  CreateUserValidationSchema,
  UserLoginValidationSchema,
  userUpdateSchema,
};
