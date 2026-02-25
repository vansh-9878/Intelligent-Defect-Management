import { useState } from "react";
import { motion } from "motion/react";
import { Lock, User, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface LoginPageProps {
  onLogin: () => void;
  onGoSignup: () => void;
}

export function LoginPage({ onLogin, onGoSignup }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();

      Cookies.set("token", data.access_token, {
        expires: 1,
        secure: false,
        sameSite: "lax",
      });

      onLogin();
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#0F0F0F] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-800 p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-[#3B9EBF] to-[#2A7A94] rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl text-gray-100 mb-2">
              Intelligent Defect Management Platform
            </h1>
            <p className="text-gray-400 text-sm">Login to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <motion.div
                animate={{
                  scale: focusedField === "username" ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full bg-[#2A2A2A] border ${
                      focusedField === "username"
                        ? "border-[#3B9EBF]"
                        : "border-gray-700"
                    } rounded-lg px-10 py-3 text-gray-100 focus:outline-none transition-all`}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </motion.div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <motion.div
                animate={{
                  scale: focusedField === "password" ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full bg-[#2A2A2A] border ${
                      focusedField === "password"
                        ? "border-[#3B9EBF]"
                        : "border-gray-700"
                    } rounded-lg px-10 py-3 text-gray-100 focus:outline-none transition-all`}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </motion.div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-[#3B9EBF] to-[#2A7A94] text-white py-3 rounded-lg font-medium hover:from-[#45B0D1] hover:to-[#3188A6] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onGoSignup}
              className="text-sm text-[#3B9EBF] hover:text-[#45B0D1] transition-colors"
            >
              Signup?
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
