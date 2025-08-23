import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { messageService } from "../app/modules/message/message.service";
import prisma from "../shared/prisma";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const socketHandler = (io: Server) => {
  console.log("Socket.io server running...");

  // middleware to authenticate socket connection
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth.token || // 👈 from frontend io({ auth: { token } })
        socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const secret = process.env.JWT_SECRET || "secret";
      const decoded = jwt.verify(token, secret);

      console.log("Socket decoded: ", decoded);

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
      where: {
        id: userId,
      },
      data: {
        isOnline: true,
      },
    });

    socket.join(userId);
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

    console.log("Find User: ", findUser);
  });
};
