import { useEffect, useState, useMemo } from "react";
import { TopNav } from "./TopNav";
import { motion } from "motion/react";
import { RotateCcw, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Cookies from "js-cookie";

type Screen =
  | "dashboard"
  | "report-defect"
  | "defect-list"
  | "analytics"
  | "defect-details";

interface AnalyticsProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

interface MetricsResponse {
  mttr_hours: number;
  recurrence_rate_percent: number;
  status_summary: Record<string, number>;
}

interface Defect {
  id: string;
  severity: string;
  created_at: string;
  reopen_count?: number;
}

/* ===================== HELPERS ===================== */

// 🔥 handle AI formatted severity like ["CRITICAL",0.41]
function normalizeSeverity(sev?: string): string {
  if (!sev) return "MEDIUM";

  try {
    if (sev.startsWith("[")) {
      const parsed = JSON.parse(sev);
      return parsed?.[0] ?? "MEDIUM";
    }
  } catch {}

  return sev.toUpperCase();
}

const SEVERITY_WEIGHTS: Record<string, number> = {
  CRITICAL: 1.0,
  HIGH: 0.8,
  MEDIUM: 0.5,
  LOW: 0.2,
};

function computeRisk(defect: Defect) {
  const severityKey = normalizeSeverity(defect.severity);
  const severityWeight = SEVERITY_WEIGHTS[severityKey] ?? 0.5;

  const reopenFactor = Math.min((defect.reopen_count ?? 0) / 3, 1);

  const created = new Date(defect.created_at).getTime();
  const now = Date.now();
  const hoursOpen = (now - created) / (1000 * 60 * 60);
  const ageFactor = Math.min(hoursOpen / 72, 1);

  return severityWeight * 0.6 + reopenFactor * 0.25 + ageFactor * 0.15;
}

/* ===================== COMPONENT ===================== */

export function Analytics({ onNavigate, onLogout }: AnalyticsProps) {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");

  /* ===================== FETCH ===================== */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // 🔹 metrics
        const metricsRes = await fetch("http://127.0.0.1:8000/metrics/", {
          headers,
        });

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }

        // 🔹 defects (for graph)
        const defectsRes = await fetch("http://127.0.0.1:8000/defects/", {
          headers,
        });

        if (defectsRes.ok) {
          const defectsData = await defectsRes.json();
          setDefects(defectsData || []);
        }

        // 🔹 project risk
        const riskRes = await fetch("http://127.0.0.1:8000/risk/project", {
          headers,
        });

        if (riskRes.ok) {
          const riskData = await riskRes.json();
          setRiskScore(riskData?.project_risk ?? 0);
        }
      } catch (err) {
        console.error("Analytics fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  /* ===================== DERIVED ===================== */

  const mttrDays = metrics ? (metrics.mttr_hours / 24).toFixed(2) : "0";
  const recurrenceRate = metrics
    ? metrics.recurrence_rate_percent.toFixed(2)
    : "0";
  const totalClosed = metrics?.status_summary?.CLOSED ?? 0;

  /* ===================== REAL RISK TREND ===================== */

  const riskTrendData = useMemo(() => {
    if (!defects.length) return [];

    const monthMap: Record<string, number[]> = {};

    defects.forEach((d) => {
      if (!d.created_at) return;

      const date = new Date(d.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      const risk = computeRisk(d);

      if (!monthMap[monthKey]) monthMap[monthKey] = [];
      monthMap[monthKey].push(risk);
    });

    // ✅ sort chronologically
    return Object.entries(monthMap)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([key, risks]) => {
        const [year, month] = key.split("-");
        const label = new Date(Number(year), Number(month)).toLocaleString(
          "default",
          { month: "short" },
        );

        return {
          month: label,
          score: risks.reduce((x, y) => x + y, 0) / risks.length,
        };
      });
  }, [defects]);

  /* ===================== LOADING ===================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading analytics...
      </div>
    );
  }

  /* ===================== UI ===================== */

  const metricsCards = [
    {
      title: "Mean Time to Resolve (MTTR)",
      value: `${mttrDays} days`,
      icon: Clock,
      iconBg: "bg-[#3B9EBF]/10",
      iconColor: "text-[#3B9EBF]",
    },
    {
      title: "Defect Recurrence Rate",
      value: `${recurrenceRate}%`,
      icon: RotateCcw,
      iconBg: "bg-[#10B981]/10",
      iconColor: "text-[#10B981]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      <TopNav
        onNavigate={onNavigate}
        currentScreen="analytics"
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto p-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl text-gray-100 mb-8"
        >
          Analytics & Metrics
        </motion.h2>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {metricsCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${metric.iconBg} flex items-center justify-center mb-6`}
                >
                  <Icon className={`w-7 h-7 ${metric.iconColor}`} />
                </div>

                <p className="text-gray-400 text-sm mb-2">{metric.title}</p>
                <p className="text-4xl text-gray-100">{metric.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* small metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <MetricBox
            label="Total Defects Closed"
            value={totalClosed}
            color="text-green-400"
          />
          <MetricBox
            label="Project Risk Score"
            value={riskScore.toFixed(3)}
            color="text-yellow-400"
          />
        </div>

        {/* 🔥 REAL GRAPH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8"
        >
          <h3 className="text-xl text-gray-100 mb-6">Risk Trend Over Time</h3>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[0, 1]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B9EBF"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

/* ===================== SMALL COMPONENT ===================== */

function MetricBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-6">
      <p className="text-gray-400 text-xs mb-2">{label}</p>
      <p className={`text-2xl ${color}`}>{value}</p>
    </div>
  );
}
