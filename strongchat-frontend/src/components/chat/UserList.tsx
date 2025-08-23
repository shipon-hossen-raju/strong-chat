"use client";

import React from "react";
import { User } from "@/types";
import { Avatar } from "../ui/Avatar";

interface UserListProps {
  users: User[];
  selectedUserId?: string;
  onUserSelect: (userId: string) => void;
  currentUserId: string;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  selectedUserId,
  onUserSelect,
  currentUserId,
}) => {
  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(lastSeen).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(lastSeen).toLocaleDateString();
  };

  return (
    <div className="space-y-1">
      {users.length === 0 ? (
        <p className="text-sm text-gray-400 text-center mt-4">No users found</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
              selectedUserId === user.id
                ? "bg-purple-600 bg-opacity-20"
                : "hover:bg-gray-800"
            }`}
          >
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              isOnline={user.isOnline}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white truncate">{user.name}</h3>
                <span className="text-xs text-gray-400">
                  {user.isOnline ? "Online" : user?.lastSeen ? formatLastSeen(user?.lastSeen) : "Offline" }
                </span>
              </div>
              <p className="text-sm text-gray-400 truncate">
                {user.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
