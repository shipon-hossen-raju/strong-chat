import { MessageType } from "@prisma/client";
import { z } from "zod";

const createSchema = z.object({
  content: z.string().min(1, "Name is required"),
  type: z.nativeEnum(MessageType),
  mediaUrl: z.string().optional(),
  receiverId: z.string().min(1, "Receiver ID is required"),
});

const updateSchema = z.object({
  id: z.string().min(1, "Message ID is required"),
  content: z.string().min(1, "Content is required"),
  type: z.nativeEnum(MessageType).optional(),
  mediaUrl: z.string().optional(),
});

export const messageValidation = {
  createSchema,
  updateSchema,
};
