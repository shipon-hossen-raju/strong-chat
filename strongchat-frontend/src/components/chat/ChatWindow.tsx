"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Message, User } from "@/types";
import { api } from "@/utils/api";
import { MoreVertical, Phone, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar } from "../ui/Avatar";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatWindowProps {
  selectedUser: User;
  socket: any;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  socket,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (selectedUser.id) {
      fetchMessages();
    }
  }, [selectedUser.id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket connected!");
    });

    // Listen for new messages
    socket.on("receive_message", (message: Message) => {
      if (message.senderId === selectedUser.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Listen for message confirmation
    socket.on("message_sent", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicators
    socket.on("user_typing", (userId: string) => {
      if (userId === selectedUser.id) {
        setIsTyping(true);
      }
    });

    socket.on("user_stopped_typing", (userId: string) => {
      if (userId === selectedUser.id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [socket, selectedUser.id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/messages/${selectedUser.id}`);
      setMessages(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (
    content: string,
    type = "TEXT",
    mediaUrl?: string
  ) => {
    const sendData = {
      receiverId: selectedUser.id,
      content,
      type,
      mediaUrl: mediaUrl || null,
    };
    if (!socket) return;

    socket.emit("send_message", sendData);
    setIsTyping(false);
  };

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(lastSeen).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Active now";
    if (minutes < 60) return `Active ${minutes}m ago`;
    return `Last seen ${new Date(lastSeen).toLocaleString()}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={selectedUser.avatarUrl}
              alt={selectedUser.name}
              isOnline={selectedUser.isOnline}
              size="md"
            />
            <div>
              <h2 className="font-semibold text-white">{selectedUser.name}</h2>
              <p className="text-sm text-gray-400">
                {selectedUser.isOnline
                  ? "Online"
                  : selectedUser.lastSeen
                  ? formatLastSeen(selectedUser.lastSeen)
                  : "Offline"}
                {isTyping && selectedUser.isOnline && (
                  <span className="text-purple-400"> • typing...</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Phone size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Video size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};
