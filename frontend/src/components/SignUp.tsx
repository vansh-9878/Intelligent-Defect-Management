import { useState } from "react";
import { motion } from "motion/react";
import { Lock, User, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface SignupPageProps {
  onSignup: () => void;
  onGoLogin: () => void;
}

export function SignupPage({ onSignup, onGoLogin }: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "USER", // always USER
        }),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      const data = await res.json();

      // ✅ IMPORTANT: store role
      Cookies.set("role", "USER", {
        expires: 1,
        sameSite: "lax",
      });

      // ✅ store token if returned
      if (data.access_token) {
        Cookies.set("token", data.access_token, {
          expires: 1,
          secure: false,
          sameSite: "lax",
        });
      }

      onSignup();
    } catch (err) {
      console.error(err);
      alert("Signup failed");
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
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl text-gray-100 mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">Sign up to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <motion.div
                animate={{
                  scale: focusedField === "email" ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full bg-[#2A2A2A] border ${
                      focusedField === "email"
                        ? "border-[#3B9EBF]"
                        : "border-gray-700"
                    } rounded-lg px-10 py-3 text-gray-100 focus:outline-none transition-all`}
                    placeholder="Enter your email"
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
                    placeholder="Create a password"
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
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Sign up</span>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onGoLogin}
              className="text-sm text-[#3B9EBF] hover:text-[#45B0D1] transition-colors"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
