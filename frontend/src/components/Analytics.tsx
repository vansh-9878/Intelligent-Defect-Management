import { TopNav } from './TopNav';
import { motion } from 'motion/react';
import { TrendingDown, RotateCcw, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Screen = 'dashboard' | 'report-defect' | 'defect-list' | 'analytics' | 'defect-details';

interface AnalyticsProps {
  onNavigate: (screen: Screen) => void;
}

const riskTrendData = [
  { month: 'Jul', score: 7.2 },
  { month: 'Aug', score: 7.8 },
  { month: 'Sep', score: 7.1 },
  { month: 'Oct', score: 6.9 },
  { month: 'Nov', score: 6.5 },
  { month: 'Dec', score: 6.2 },
  { month: 'Jan', score: 6.8 },
];

export function Analytics({ onNavigate }: AnalyticsProps) {
  const metrics = [
    {
      title: 'Mean Time to Resolve (MTTR)',
      value: '3.2 days',
      change: '-12%',
      trend: 'down',
      icon: Clock,
      color: 'from-[#3B9EBF] to-[#2A7A94]',
      iconBg: 'bg-[#3B9EBF]/10',
      iconColor: 'text-[#3B9EBF]',
    },
    {
      title: 'Defect Recurrence Rate',
      value: '8.5%',
      change: '-3%',
      trend: 'down',
      icon: RotateCcw,
      color: 'from-[#10B981] to-[#059669]',
      iconBg: 'bg-[#10B981]/10',
      iconColor: 'text-[#10B981]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      <TopNav onNavigate={onNavigate} currentScreen="analytics" />
      
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl text-gray-100 mb-8">Analytics & Metrics</h2>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl ${metric.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${metric.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">{metric.title}</p>
                  <p className="text-4xl text-gray-100">{metric.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Defects Closed', value: '342', color: 'text-green-400' },
            { label: 'Average Response Time', value: '2.1h', color: 'text-blue-400' },
            { label: 'Team Efficiency', value: '94%', color: 'text-purple-400' },
            { label: 'Customer Satisfaction', value: '4.7/5', color: 'text-yellow-400' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-6"
            >
              <p className="text-gray-400 text-xs mb-2">{item.label}</p>
              <p className={`text-2xl ${item.color}`}>{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Risk Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl text-gray-100 mb-1">Risk Trend Over Time</h3>
              <p className="text-sm text-gray-400">Project risk score tracking (lower is better)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2A2A2A] rounded-lg border border-gray-700">
                <div className="w-3 h-3 rounded-full bg-[#3B9EBF]"></div>
                <span className="text-sm text-gray-300">Risk Score</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF' }}
                domain={[0, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6',
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B9EBF"
                strokeWidth={3}
                dot={{ fill: '#3B9EBF', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="grid grid-cols-3 gap-6 mt-8"
        >
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-gray-800 rounded-xl p-6">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingDown className="w-5 h-5 text-green-400" />
            </div>
            <h4 className="text-sm text-gray-400 mb-2">Performance Trend</h4>
            <p className="text-lg text-gray-100 mb-1">Improving</p>
            <p className="text-xs text-green-400">↓ 15% reduction in defects</p>
          </div>

          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-gray-800 rounded-xl p-6">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="text-sm text-gray-400 mb-2">Resolution Speed</h4>
            <p className="text-lg text-gray-100 mb-1">Fast</p>
            <p className="text-xs text-blue-400">↓ 12% faster than last month</p>
          </div>

          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-gray-800 rounded-xl p-6">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <RotateCcw className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="text-sm text-gray-400 mb-2">Quality Score</h4>
            <p className="text-lg text-gray-100 mb-1">Excellent</p>
            <p className="text-xs text-purple-400">↓ Low recurrence rate</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
