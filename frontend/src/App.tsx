import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignUp";
import { Dashboard } from "./components/Dashboard";
import { ReportDefect } from "./components/ReportDefect";
import { DefectList } from "./components/DefectList";
import { DefectDetails } from "./components/DefectDetails";
import { Analytics } from "./components/Analytics";
import { motion, AnimatePresence } from "motion/react";
import Cookies from "js-cookie";

type Screen =
  | "login"
  | "signup"
  | "dashboard"
  | "report-defect"
  | "defect-list"
  | "defect-details"
  | "analytics";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
      setCurrentScreen("dashboard");
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setSelectedDefectId(null);
    setCurrentScreen("login");
  };

  const goToSignup = () => setCurrentScreen("signup");
  const goToLogin = () => setCurrentScreen("login");

  const navigateTo = (screen: Screen, defectId?: string) => {
    if (defectId) {
      setSelectedDefectId(defectId);
    }
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <AnimatePresence mode="wait">
        {currentScreen === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage onLogin={handleLogin} onGoSignup={goToSignup} />
          </motion.div>
        )}
        {currentScreen === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SignupPage onSignup={handleSignup} onGoLogin={goToLogin} />
          </motion.div>
        )}
        {currentScreen === "dashboard" && isLoggedIn && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard onNavigate={navigateTo} onLogout={handleLogout} />
          </motion.div>
        )}
        {currentScreen === "report-defect" && isLoggedIn && (
          <motion.div
            key="report-defect"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReportDefect onNavigate={navigateTo} onLogout={handleLogout} />
          </motion.div>
        )}
        {currentScreen === "defect-list" && isLoggedIn && (
          <motion.div
            key="defect-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DefectList onNavigate={navigateTo} onLogout={handleLogout} />
          </motion.div>
        )}
        {currentScreen === "defect-details" &&
          isLoggedIn &&
          selectedDefectId && (
            <motion.div
              key="defect-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DefectDetails
                onNavigate={navigateTo}
                defectId={selectedDefectId ?? undefined}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        {currentScreen === "analytics" && isLoggedIn && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Analytics onNavigate={navigateTo} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
