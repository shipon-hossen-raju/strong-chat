"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  loading = false,
}) => {
  const [email, setEmail] = useState("raju@a.com");
  const [password, setPassword] = useState("1234");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="w-full max-w-md bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
            Agree to the terms of use & privacy policy.
          </label>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login Now"}
        </Button>
      </form>

      <p className="mt-4 text-center text-gray-400 text-sm">
        Create an account{" "}
        <button className="text-purple-400 hover:text-purple-300">
          Click here
        </button>
      </p>
    </div>
  );
};
