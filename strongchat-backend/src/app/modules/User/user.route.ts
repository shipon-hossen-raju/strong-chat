import { UserRole } from "@prisma/client";
import express from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

// *!register user
router.post(
  "/register",
  validateRequest(UserValidation.CreateUserValidationSchema),
  userController.createUser
);

// *!get all  user
router.get("/", auth(), userController.getUsers);

// *!profile user
router.put(
  "/profile",
  // validateRequest(UserValidation.userUpdateSchema),

  auth(UserRole.ADMIN, UserRole.USER),
  fileUploader.uploadSingle,
  userController.updateProfile
);

// *!update  user
router.put("/:id", userController.updateUser);

export const userRoutes = router;
