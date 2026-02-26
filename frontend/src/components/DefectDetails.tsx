import { useEffect, useState } from "react";
import { TopNav } from "./TopNav";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import Cookies from "js-cookie";
import { canUpdateStatus } from "../utils/rbac";

type Screen =
  | "dashboard"
  | "report-defect"
  | "defect-list"
  | "analytics"
  | "defect-details";

interface DefectDetailsProps {
  onNavigate: (screen: Screen) => void;
  defectId?: string;
  onLogout: () => void;
}

interface Defect {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  module?: string;
  environment?: string;
  assigned_team?: string;
  created_at?: string;
  reopen_count?: number;
}

export function DefectDetails({
  onNavigate,
  defectId,
  onLogout,
}: DefectDetailsProps) {
  const [defect, setDefect] = useState<Defect | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const role = Cookies.get("role") as any;
  console.log(defectId);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchDefect = async () => {
      if (!defectId) return;

      try {
        setLoading(true);

        const res = await fetch(`http://127.0.0.1:8000/defects/${defectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch defect");

        const data = await res.json();
        setDefect(data);
      } catch (err) {
        console.error("Fetch defect failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefect();
  }, [defectId, token]);

  const getNextStatusEndpoint = (status: string) => {
    const s = status?.toUpperCase();

    if (s === "ASSIGNED") return "start";
    if (s === "IN_PROGRESS") return "fixed";
    if (s === "FIXED") return "verify";
    if (s === "VERIFICATION") return "closed";
    if (s === "CLOSED") return "reopen";
    if (s === "REOPENED") return "start";

    return null;
  };

  const getNextStatusLabel = (status: string) => {
    const s = status?.toUpperCase();

    if (s === "ASSIGNED") return "Start Progress";
    if (s === "IN_PROGRESS") return "Mark as Fixed";
    if (s === "FIXED") return "Send to Verification";
    if (s === "VERIFICATION") return "Close Defect";
    if (s === "CLOSED") return "Reopen Defect";
    if (s === "REOPENED") return "Start Progress";

    return "Update Status";
  };

  const handleUpdateStatus = async () => {
    if (!defect) return;

    const endpoint = getNextStatusEndpoint(defect.status);
    if (!endpoint) return;

    try {
      setIsUpdatingStatus(true);

      const res = await fetch(
        `http://127.0.0.1:8000/defects/${defect.id}/${endpoint}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Status update failed");

      const updated = await res.json();
      setDefect(updated);

      setStatusUpdated(true);
      setTimeout(() => setStatusUpdated(false), 2000);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("You may not have permission for this action.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  const pretty = (s?: string) => (s ? s.replace("_", " ") : "—");

  if (loading || !defect) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading defect...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <TopNav
        onNavigate={onNavigate}
        currentScreen="defect-details"
        onLogout={onLogout}
        role={Cookies.get("role")}
      />

      <div className="max-w-5xl mx-auto p-8">
        <motion.button
          onClick={() => onNavigate("defect-list")}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Defect List
        </motion.button>

        <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[#3B9EBF] font-mono text-lg">
              {defect.id.slice(0, 8)}
            </span>

            <span className="px-3 py-1 rounded-full text-xs border text-yellow-400 border-yellow-500/30">
              {pretty(defect.severity)}
            </span>

            <span className="px-3 py-1 rounded-full text-xs border text-purple-400 border-purple-500/30">
              {pretty(defect.status)}
            </span>
          </div>

          <h3 className="text-2xl text-gray-100 mb-4">{defect.title}</h3>

          <p className="text-gray-300 mb-6">{defect.description}</p>

          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-800">
            <div>
              <p className="text-xs text-gray-500 mb-1">Created</p>
              <p className="text-gray-200 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(defect.created_at)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Environment</p>
              <p className="text-gray-200">{defect.environment}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Module</p>
              <p className="text-gray-200">{defect.module}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Assigned Team</p>
              <p className="text-gray-200">
                {defect.assigned_team || "Unassigned"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            onClick={handleUpdateStatus}
            disabled={
              isUpdatingStatus ||
              statusUpdated ||
              !getNextStatusEndpoint(defect.status) ||
              !canUpdateStatus(role, defect.status)
            }
            className="bg-gradient-to-r from-[#3B9EBF] to-[#2A7A94] text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdatingStatus ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : statusUpdated ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Status Updated!
              </>
            ) : (
              getNextStatusLabel(defect.status)
            )}
          </motion.button>

          <button
            onClick={() => onNavigate("defect-list")}
            className="bg-[#2A2A2A] text-gray-300 px-6 py-3 rounded-lg border border-gray-700"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}
