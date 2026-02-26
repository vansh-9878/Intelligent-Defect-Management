import {
  LayoutDashboard,
  FileText,
  ListChecks,
  BarChart3,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { canAccessScreen } from "../utils/rbac";

type Screen =
  | "dashboard"
  | "report-defect"
  | "defect-list"
  | "analytics"
  | "defect-details";

interface TopNavProps {
  onNavigate: (screen: Screen) => void;
  currentScreen?: Screen;
  onLogout: () => void;
  role: string | null | undefined;
}

export function TopNav({
  onNavigate,
  currentScreen,
  onLogout,
  role,
}: TopNavProps) {
  const navItems = [
    { id: "dashboard" as Screen, label: "Dashboard", icon: LayoutDashboard },
    { id: "report-defect" as Screen, label: "Report Defect", icon: FileText },
    { id: "defect-list" as Screen, label: "Defects", icon: ListChecks },
    { id: "analytics" as Screen, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="bg-[#1A1A1A] border-b border-gray-800 h-16 px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <h1 className="text-xl text-gray-100">
          Intelligent Defect Management Platform
        </h1>
        <div className="flex items-center gap-1">
          {navItems
            .filter((item) => role && canAccessScreen(role as any, item.id))
            .map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors relative ${
                    isActive
                      ? "text-[#3B9EBF]"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B9EBF]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onLogout}
          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-sm hover:bg-red-500/20 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Logout
        </motion.button>

        <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
          <User className="w-5 h-5 text-gray-300" />
        </div>
      </div>
    </nav>
  );
}
