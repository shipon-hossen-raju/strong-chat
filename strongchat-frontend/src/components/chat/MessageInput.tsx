"use client";

import React, { useState } from "react";
import { Send, Image, Paperclip } from "lucide-react";
import { Button } from "../ui/Button";

interface MessageInputProps {
  onSendMessage: (content: string, type?: string, mediaUrl?: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t border-gray-700 bg-gray-900">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Media buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Send image"
          >
            <Image size={20} />
          </button>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
        </div>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message"
            disabled={disabled}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none max-h-32"
            rows={1}
            style={{
              height: "auto",
              minHeight: "48px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
        </div>

        {/* Send button */}
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-3"              
        >
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
};
