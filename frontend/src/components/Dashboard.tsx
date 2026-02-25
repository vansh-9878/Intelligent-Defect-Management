import { TopNav } from './TopNav';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Screen = 'dashboard' | 'report-defect' | 'defect-list' | 'analytics' | 'defect-details';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

const severityData = [
  { name: 'Critical', value: 12, color: '#EF4444' },
  { name: 'High', value: 28, color: '#F97316' },
  { name: 'Medium', value: 45, color: '#F59E0B' },
  { name: 'Low', value: 34, color: '#3B9EBF' },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const kpis = [
    {
      title: 'Total Defects',
      value: '119',
      icon: AlertCircle,
      color: 'from-[#3B9EBF] to-[#2A7A94]',
      iconBg: 'bg-[#3B9EBF]/10',
      iconColor: 'text-[#3B9EBF]',
    },
    {
      title: 'Open Defects',
      value: '87',
      icon: CheckCircle2,
      color: 'from-[#F59E0B] to-[#D97706]',
      iconBg: 'bg-[#F59E0B]/10',
      iconColor: 'text-[#F59E0B]',
    },
    {
      title: 'Average MTTR',
      value: '3.2d',
      icon: Clock,
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      iconBg: 'bg-[#8B5CF6]/10',
      iconColor: 'text-[#8B5CF6]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      <TopNav onNavigate={onNavigate} currentScreen="dashboard" />
      
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl text-gray-100 mb-8">Dashboard</h2>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-6 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">{kpi.title}</p>
                  <p className="text-3xl text-gray-100">{kpi.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Project Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-gray-800 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl text-gray-100 mb-2">Project Risk Score</h3>
              <p className="text-gray-400 text-sm mb-4">Overall health indicator</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl text-[#F59E0B]">6.8</span>
                <span className="text-gray-400">/10</span>
              </div>
            </div>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#2A2A2A"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '352', strokeDashoffset: '352' }}
                  animate={{ strokeDashoffset: '112' }}
                  transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#F59E0B]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Defects by Severity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8"
        >
          <h3 className="text-xl text-gray-100 mb-6">Defects by Severity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
