import { useEffect, useState } from "react";
import { TopNav } from "./TopNav";
import { motion } from "motion/react";
import { Filter, Search } from "lucide-react";
import Cookies from "js-cookie";

type Screen =
  | "dashboard"
  | "report-defect"
  | "defect-list"
  | "analytics"
  | "defect-details";

interface DefectListProps {
  onNavigate: (screen: Screen, defectId?: string) => void;
  onLogout: () => void;
}

interface Defect {
  id: string;
  title: string;
  severity: string;
  status: string;
  assigned_team?: string;
}

const getSeverityColor = (severity: string) => {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "HIGH":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "LOW":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "IN_PROGRESS":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "FIXED":
    case "RESOLVED":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "CLOSED":
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const formatStatus = (status: string) => {
  return status?.replace("_", " ");
};

const formatSeverity = (sev: string) => {
  return sev?.charAt(0).toUpperCase() + sev?.slice(1).toLowerCase();
};

export function DefectList({ onNavigate, onLogout }: DefectListProps) {
  const [defects, setDefects] = useState<Defect[]>([]);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchDefects = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://127.0.0.1:8000/defects/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch defects");

        const data = await res.json();
        setDefects(data || []);
      } catch (err) {
        console.error("Defects fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefects();
  }, [token]);

  const filteredDefects = defects.filter((defect) => {
    const matchesSeverity =
      severityFilter === "all" ||
      defect.severity?.toUpperCase() === severityFilter.toUpperCase();

    const matchesStatus =
      statusFilter === "all" ||
      defect.status?.toUpperCase() === statusFilter.toUpperCase();

    const matchesSearch =
      defect.title?.toLowerCase().includes(search.toLowerCase()) ||
      defect.id?.toLowerCase().includes(search.toLowerCase());

    return matchesSeverity && matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading defects...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <TopNav
        onNavigate={onNavigate}
        currentScreen="defect-list"
        onLogout={onLogout}
        role={Cookies.get("role")}
      />

      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-3xl text-gray-100">Defect List</h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search defects..."
              className="bg-[#2A2A2A] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:outline-none focus:border-[#3B9EBF] w-64"
            />
          </div>
        </motion.div>

        <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-6 mb-6 flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-300">
            <Filter className="w-5 h-5" />
            <span>Filters:</span>
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#2A2A2A] border border-gray-700 rounded-lg px-3 py-1.5 text-gray-100 text-sm"
          >
            <option value="all">All Severity</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#2A2A2A] border border-gray-700 rounded-lg px-3 py-1.5 text-gray-100 text-sm"
          >
            <option value="all">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FIXED">Fixed</option>
            <option value="CLOSED">Closed</option>
          </select>

          <div className="ml-auto text-sm text-gray-400">
            Showing {filteredDefects.length} of {defects.length}
          </div>
        </div>

        <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-[#252525]">
                  <th className="text-left px-6 py-4 text-sm text-gray-400">
                    ID
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-gray-400">
                    Title
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-gray-400">
                    Severity
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-gray-400">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-gray-400">
                    Assigned Team
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDefects.map((defect, index) => (
                  <motion.tr
                    key={defect.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onMouseEnter={() => setHoveredRow(defect.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => {
                      console.log("CLICKED ID:", defect.id);
                      onNavigate("defect-details", defect.id);
                    }}
                    className={`border-b border-gray-800 cursor-pointer ${
                      hoveredRow === defect.id ? "bg-[#252525]" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-[#3B9EBF] font-mono text-sm">
                      {defect.id}
                    </td>

                    <td className="px-6 py-4 text-gray-100">{defect.title}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${getSeverityColor(
                          defect.severity,
                        )}`}
                      >
                        {formatSeverity(defect.severity)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                          defect.status,
                        )}`}
                      >
                        {formatStatus(defect.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {defect.assigned_team || "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
