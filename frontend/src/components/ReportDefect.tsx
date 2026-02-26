import { useState } from "react";
import { TopNav } from "./TopNav";
import { motion } from "motion/react";
import { FileText, Loader2, CheckCircle2 } from "lucide-react";
import Cookies from "js-cookie";

type Screen =
  | "dashboard"
  | "report-defect"
  | "defect-list"
  | "analytics"
  | "defect-details";

interface ReportDefectProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function ReportDefect({ onNavigate, onLogout }: ReportDefectProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState("");
  const [environment, setEnvironment] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = Cookies.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/defects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          module,
          environment,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create defect");
      }

      setIsSuccess(true);

      setTitle("");
      setDescription("");
      setModule("");
      setEnvironment("");

      setTimeout(() => {
        onNavigate("dashboard");
      }, 1200);
    } catch (err) {
      console.error("Create defect failed:", err);
      alert("Failed to submit defect");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <TopNav
        onNavigate={onNavigate}
        currentScreen="report-defect"
        onLogout={onLogout}
      />

      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl text-gray-100 mb-8">Report Defect</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800">
            <div className="w-10 h-10 bg-[#3B9EBF]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#3B9EBF]" />
            </div>
            <div>
              <h3 className="text-lg text-gray-100">New Defect Report</h3>
              <p className="text-sm text-gray-400">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Defect Title *
              </label>
              <motion.input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
                animate={{ scale: focusedField === "title" ? 1.01 : 1 }}
                className={`w-full bg-[#2A2A2A] border ${
                  focusedField === "title"
                    ? "border-[#3B9EBF]"
                    : "border-gray-700"
                } rounded-lg px-4 py-3 text-gray-100 focus:outline-none`}
                placeholder="Brief description of the defect"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Description *
              </label>
              <motion.textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                animate={{ scale: focusedField === "description" ? 1.01 : 1 }}
                rows={6}
                className={`w-full bg-[#2A2A2A] border ${
                  focusedField === "description"
                    ? "border-[#3B9EBF]"
                    : "border-gray-700"
                } rounded-lg px-4 py-3 text-gray-100 focus:outline-none resize-none`}
                placeholder="Steps to reproduce..."
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Affected Module *
              </label>
              <motion.select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                onFocus={() => setFocusedField("module")}
                onBlur={() => setFocusedField(null)}
                animate={{ scale: focusedField === "module" ? 1.01 : 1 }}
                className={`w-full bg-[#2A2A2A] border ${
                  focusedField === "module"
                    ? "border-[#3B9EBF]"
                    : "border-gray-700"
                } rounded-lg px-4 py-3 text-gray-100 focus:outline-none`}
                required
              >
                <option value="">Select module...</option>
                <option value="authentication">Authentication</option>
                <option value="user-management">User Management</option>
                <option value="reporting">Reporting</option>
                <option value="analytics">Analytics</option>
                <option value="api">API</option>
                <option value="ui">User Interface</option>
              </motion.select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Environment Details *
              </label>
              <motion.input
                type="text"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                onFocus={() => setFocusedField("environment")}
                onBlur={() => setFocusedField(null)}
                animate={{ scale: focusedField === "environment" ? 1.01 : 1 }}
                className={`w-full bg-[#2A2A2A] border ${
                  focusedField === "environment"
                    ? "border-[#3B9EBF]"
                    : "border-gray-700"
                } rounded-lg px-4 py-3 text-gray-100 focus:outline-none`}
                placeholder="e.g., Production, Chrome 120"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="flex-1 bg-gradient-to-r from-[#3B9EBF] to-[#2A7A94] text-white py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Submitted!</span>
                  </>
                ) : (
                  <span>Submit Defect</span>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8 bg-[#2A2A2A] text-gray-300 py-3 rounded-lg font-medium border border-gray-700 disabled:opacity-50"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
