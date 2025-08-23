"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@/types";
import React, { useEffect, useRef } from "react";
import { Avatar } from "../ui/Avatar";

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            💬
          </div>
          <p>No messages yet. Start a conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {Object.entries(messageGroups).map(([date, dayMessages]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="flex justify-center mb-4">
            <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">
              {formatDateHeader(date)}
            </span>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {dayMessages.map((message, index) => {
              const isOwn = message.senderId === user?.id;
              const showAvatar =
                !isOwn &&
                (index === dayMessages.length - 1 ||
                  dayMessages[index + 1]?.senderId !== message.senderId);

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    isOwn ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {showAvatar && !isOwn ? (
                      <Avatar
                        src={message.sender.avatarUrl}
                        alt={message.sender.name}
                        size="sm"
                      />
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                  </div>

                  <div
                    className={`flex flex-col ${
                      isOwn ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`chat-bubble ${
                        isOwn ? "chat-bubble-sent" : "chat-bubble-received"
                      }`}
                    >
                      {message.type === "IMAGE" && message.mediaUrl ? (
                        <div className="space-y-2">
                          <img
                            src={message.mediaUrl}
                            alt="Shared image"
                            className="max-w-xs rounded-lg"
                          />
                          {message.content && (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>

                    <span
                      className={`text-xs text-gray-400 mt-1 ${
                        isOwn ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
