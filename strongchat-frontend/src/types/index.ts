export interface User {
   id: string;
   email: string;
   name: string;
   bio?: string;
   avatarUrl?: string;
   isOnline?: boolean;
   lastSeen?: Date;
   createdAt: Date;
}

export interface Message {
   id: string;
   content: string;
   type: "TEXT" | "IMAGE" | "FILE";
   mediaUrl?: string;
   senderId: string;
   receiverId: string;
   sender: {
      id: string;
      name: string;
      avatarUrl?: string;
   },
   isRead: boolean;
   createdAt: Date;
}

export interface AuthUser {
   id: string;
   email: string;
   name: string;
   bio?: string;
   avatarUrl?: string;
}
