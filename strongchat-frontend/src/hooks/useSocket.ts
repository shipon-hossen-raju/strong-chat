import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (token: string | null) => {
  const socket = useRef<Socket | null>(null);
  const backendUrl = "http://localhost:5005";
  console.log("Backend URL: ", backendUrl);

  useEffect(() => {
    if (!token) {
      console.warn("No token provided, socket will not be initialized.");
      return;
    }

    socket.current = io(backendUrl, { auth: { token } });

    socket.current.on("connect", () => {
      console.log("Socket connected: ", socket.current?.id);
    });

    socket.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [token]);

  return socket.current;
};
