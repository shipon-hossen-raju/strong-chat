import React from "react";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  isOnline,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
          <User className="text-gray-400" size={size === "xl" ? 24 : 16} />
        </div>
      )}

      {isOnline !== undefined && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`}
        />
      )}
    </div>
  );
};
