import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { messageRoutes } from "../modules/message/message.routes";
import { userRoutes } from "../modules/User/user.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/messages",
    route: messageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
