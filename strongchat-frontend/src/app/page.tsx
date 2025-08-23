"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user, router]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError("");
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string,
    bio: string
  ) => {
    try {
      setLoading(true);
      setError("");
      await register(email, password, name, bio);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl">
        {/* Logo Section */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
            <div className="p-4 bg-purple-600 rounded-2xl">
              <MessageCircle size={48} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              StrongChat
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Connect instantly with friends and colleagues through our modern,
            real-time messaging platform.
          </p>
          <div className="hidden lg:block">
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time messaging
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Media sharing
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Secure & private
              </span>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="flex-1 w-full max-w-md">
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {isLogin ? (
            <LoginForm onLogin={handleLogin} loading={loading} />
          ) : (
            <RegisterForm onRegister={handleRegister} loading={loading} />
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
