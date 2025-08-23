import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { messageController } from "./message.controller";
import { messageValidation } from "./message.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(messageValidation.createSchema),
  messageController.createMessage
);

router.get("/:senderId", auth(), messageController.getsMessagesBySenderId);

export const messageRoutes = router;
