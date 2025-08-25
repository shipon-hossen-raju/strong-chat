import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { messageService } from "../app/modules/message/message.service";
import prisma from "../shared/prisma";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

// online users
const onlineUsers = new Map<string, string>();

export const socketHandler = (io: Server) => {
  console.log("Socket.io server running...");

  // middleware to authenticate socket connection
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.headers.authorization?.split(" ")[1] ||
        socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const secret = process.env.JWT_SECRET || "secret";
      const decoded = jwt.verify(token, secret);

      if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
        socket.userId = (decoded as { id: string }).id;
        next();
      } else {
        next(new Error("Authentication error: Invalid token payload"));
      }
    } catch (err) {
      console.error("Socket auth error:", err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);
    const userId = socket.userId;
    if (!userId) {
      console.log("No userId found, disconnecting socket");
      socket.disconnect();
      return;
    }
    const findUser = await prisma.user.findUnique({
      where: {
        id: socket.userId,
      },
      select: {
        id: true,
        isOnline: true,
      },
    });
    if (!findUser) {
      console.log("User not found in DB, disconnecting socket");
      socket.disconnect();
      return;
    }
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });

    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    io.emit("online_users", Array.from(onlineUsers.keys()));

    // find all users & emit
    socket.on("users_list", async () => {
      const users = await prisma.user.findMany({
        where: { id: { not: userId } },
        select: {
          id: true,
        }
      })
    } );

    type sendResponse = {
      receiverId: string;
      content: string;
      type?: string;
      mediaUrl?: string;
    };
    socket.on("send_message", async (payload: sendResponse) => {
      console.log("send_message payload: ", payload);
      const { receiverId, content, type = "TEXT", mediaUrl } = payload;

      const message = await messageService.createIntoDb(
        { receiverId, content, type, mediaUrl },
        userId
      );

      io.to(receiverId).emit("receive_message", message);
      socket.emit("message_sent", message);
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false, lastSeen: new Date() },
      });
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });
  });
};
