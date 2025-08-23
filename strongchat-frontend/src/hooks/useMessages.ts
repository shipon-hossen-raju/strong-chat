import { Message } from "@/types";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";

export const useMessages = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  const fetchMessages = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
    );
  };

  return {
    messages,
    loading,
    error,
    addMessage,
    updateMessage,
    refetch: fetchMessages,
  };
};
