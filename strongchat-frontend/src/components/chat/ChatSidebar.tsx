"use client";

import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { api } from "@/utils/api";
import { LogOut, Search, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { UserList } from "./UserList";

interface ChatSidebarProps {
  selectedUserId?: string;
  onUserSelect: (userId: string) => void;
  users: User[];
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedUserId,
  onUserSelect,
  users
}) => {
  const { user, logout, updateProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });

  const filteredUsers =
    users.length &&
    users.filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData);
      setShowProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">StrongChat</h1>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search User..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4">
          {users.length && (
            <UserList
              users={filteredUsers || []}
              selectedUserId={selectedUserId}
              onUserSelect={onUserSelect}
              currentUserId={user?.id || ""}
            />
          )}
        </div>

        {/* Current User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <Avatar src={user?.avatarUrl} alt={user?.name} size="md" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{user?.name}</h3>
              <p className="text-sm text-gray-400 truncate">{user?.bio}</p>
            </div>
            <Settings size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="Profile details"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatarUrl} alt={user?.name} size="xl" />
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              upload profile image
            </button>
          </div>

          <Input
            type="text"
            placeholder="Full Name"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
          />

          <textarea
            placeholder="Bio"
            value={profileData.bio}
            onChange={(e) =>
              setProfileData({ ...profileData, bio: e.target.value })
            }
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none h-20"
          />

          <Button onClick={handleProfileUpdate} className="w-full">
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
};
