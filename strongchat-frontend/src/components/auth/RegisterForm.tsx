"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface RegisterFormProps {
  onRegister: (
    email: string,
    password: string,
    name: string,
    bio: string
  ) => void;
  loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  loading = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("Hi Everyone, I am Using StrongChat");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(email, password, name, bio);
  };

  return (
    <div className="w-full max-w-md bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none h-20"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
};
