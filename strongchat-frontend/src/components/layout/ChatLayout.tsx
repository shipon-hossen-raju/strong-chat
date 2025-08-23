"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { User } from "@/types";
import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { ChatSidebar } from "../chat/ChatSidebar";
import { ChatWindow } from "../chat/ChatWindow";

export const ChatLayout: React.FC = () => {
  const { token } = useAuth();
  const socket = useSocket(token);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  console.log("Token in ChatLayout: ", token);
  console.log("socket in ChatLayout: ", socket);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.data.users || []);

      // Auto-select first user if none selected
      if (response.data.length > 0 && !selectedUser) {
        setSelectedUser(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserSelect = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  console.log("Selected User:", selectedUser);

  return (
    <div className="h-screen flex bg-gray-950">
      <ChatSidebar
        selectedUserId={selectedUser?.id}
        onUserSelect={handleUserSelect}
      />

      {selectedUser ? (
        <ChatWindow selectedUser={selectedUser} socket={socket} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-950">
          <div className="text-center text-gray-400">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              💬
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Welcome to StrongChat
            </h2>
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};
