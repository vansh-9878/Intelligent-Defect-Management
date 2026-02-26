import { useEffect, useState } from "react";
import { TopNav } from "./TopNav";
import { motion } from "motion/react";
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Cookies from "js-cookie";

type Screen =
  | "dashboard"
  | "report-defect"
  | "defect-list"
  | "analytics"
  | "defect-details";

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

interface Defect {
  id: string;
  severity: string;
  status: string;
  created_at?: string;
  resolved_at?: string;
}

export function Dashboard({ onNavigate, onLogout }: DashboardProps) {
  const [defects, setDefects] = useState<Defect[]>([]);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const defectsRes = await fetch("http://127.0.0.1:8000/defects/", {
          headers,
        });
        const defectsData = await defectsRes.json();
        setDefects(defectsData || []);

        try {
          const riskRes = await fetch("http://127.0.0.1:8000/risk/project", {
            headers,
          });
          if (riskRes.ok) {
            const riskData = await riskRes.json();
            setRiskScore(riskData?.project_risk ?? 0);
          }
        } catch (e) {
          console.warn("Risk API not accessible for this role");
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const totalDefects = defects.length;
  const openDefects = defects.filter(
    (d) => !["CLOSED", "FIXED"].includes(d.status),
  ).length;

  const resolvedDefects = defects.filter((d) => d.created_at && d.resolved_at);

  const avgMTTR =
    resolvedDefects.length > 0
      ? (
          resolvedDefects.reduce((acc, d) => {
            const start = new Date(d.created_at!).getTime();
            const end = new Date(d.resolved_at!).getTime();
            return acc + (end - start);
          }, 0) /
          resolvedDefects.length /
          (1000 * 60 * 60 * 24)
        ).toFixed(1)
      : "0";

  const severityMap: Record<string, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  defects.forEach((d) => {
    const key = d.severity?.toUpperCase();
    if (severityMap[key] !== undefined) severityMap[key]++;
  });

  const severityData = [
    { name: "Critical", value: severityMap.CRITICAL, color: "#EF4444" },
    { name: "High", value: severityMap.HIGH, color: "#F97316" },
    { name: "Medium", value: severityMap.MEDIUM, color: "#F59E0B" },
    { name: "Low", value: severityMap.LOW, color: "#3B9EBF" },
  ];

  const kpis = [
    {
      title: "Total Defects",
      value: totalDefects,
      icon: AlertCircle,
      iconBg: "bg-[#3B9EBF]/10",
      iconColor: "text-[#3B9EBF]",
    },
    {
      title: "Open Defects",
      value: openDefects,
      icon: CheckCircle2,
      iconBg: "bg-[#F59E0B]/10",
      iconColor: "text-[#F59E0B]",
    },
    {
      title: "Average MTTR",
      value: `${avgMTTR}d`,
      icon: Clock,
      iconBg: "bg-[#8B5CF6]/10",
      iconColor: "text-[#8B5CF6]",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <TopNav
        onNavigate={onNavigate}
        currentScreen="dashboard"
        onLogout={onLogout}
      />
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl text-gray-100 mb-8">Dashboard</h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-6"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${kpi.iconBg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                </div>
                <p className="text-gray-400 text-sm mb-1">{kpi.title}</p>
                <p className="text-3xl text-gray-100">{kpi.value}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-gray-800 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl text-gray-100 mb-2">Project Risk Score</h3>
              <p className="text-gray-400 text-sm mb-4">
                Overall health indicator
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl text-[#F59E0B]">
                  {riskScore || 0}
                </span>
                <span className="text-gray-400">/10</span>
              </div>
            </div>
            <TrendingUp className="w-10 h-10 text-[#F59E0B]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8"
        >
          <h3 className="text-xl text-gray-100 mb-6">Defects by Severity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip cursor={false} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {severityData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
