import { useState } from 'react';
import { TopNav } from './TopNav';
import { motion } from 'motion/react';
import { Filter, Search } from 'lucide-react';

type Screen = 'dashboard' | 'report-defect' | 'defect-list' | 'analytics' | 'defect-details';

interface DefectListProps {
  onNavigate: (screen: Screen) => void;
}

interface Defect {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTeam: string;
}

const mockDefects: Defect[] = [
  { id: 'DEF-1234', title: 'Login authentication fails on Safari', severity: 'Critical', status: 'Open', assignedTeam: 'Auth Team' },
  { id: 'DEF-1235', title: 'Dashboard charts not loading', severity: 'High', status: 'In Progress', assignedTeam: 'Frontend Team' },
  { id: 'DEF-1236', title: 'Export functionality timeout error', severity: 'High', status: 'Open', assignedTeam: 'Backend Team' },
  { id: 'DEF-1237', title: 'Mobile responsive issues on tablet', severity: 'Medium', status: 'In Progress', assignedTeam: 'Frontend Team' },
  { id: 'DEF-1238', title: 'Email notifications delayed', severity: 'Medium', status: 'Resolved', assignedTeam: 'Platform Team' },
  { id: 'DEF-1239', title: 'Profile image upload size limit', severity: 'Low', status: 'Open', assignedTeam: 'Backend Team' },
  { id: 'DEF-1240', title: 'Search results pagination broken', severity: 'High', status: 'In Progress', assignedTeam: 'Backend Team' },
  { id: 'DEF-1241', title: 'Minor UI alignment issues', severity: 'Low', status: 'Closed', assignedTeam: 'Frontend Team' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'Low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'Closed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

export function DefectList({ onNavigate }: DefectListProps) {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const filteredDefects = mockDefects.filter(defect => {
    const matchesSeverity = severityFilter === 'all' || defect.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || defect.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#121212]">
      <TopNav onNavigate={onNavigate} currentScreen="defect-list" />
      
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
              type="text"
              placeholder="Search defects..."
              className="bg-[#2A2A2A] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:outline-none focus:border-[#3B9EBF] transition-colors w-64"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-6 mb-6 flex items-center gap-6"
        >
          <div className="flex items-center gap-2 text-gray-300">
            <Filter className="w-5 h-5" />
            <span>Filters:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Severity:</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#2A2A2A] border border-gray-700 rounded-lg px-3 py-1.5 text-gray-100 focus:outline-none focus:border-[#3B9EBF] transition-colors text-sm"
            >
              <option value="all">All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#2A2A2A] border border-gray-700 rounded-lg px-3 py-1.5 text-gray-100 focus:outline-none focus:border-[#3B9EBF] transition-colors text-sm"
            >
              <option value="all">All</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-400">
            Showing {filteredDefects.length} of {mockDefects.length} defects
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-[#252525]">
                  <th className="text-left px-6 py-4 text-sm text-gray-400">ID</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-400">Title</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-400">Severity</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-400">Assigned Team</th>
                </tr>
              </thead>
              <tbody>
                {filteredDefects.map((defect, index) => (
                  <motion.tr
                    key={defect.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                    onMouseEnter={() => setHoveredRow(defect.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onNavigate('defect-details')}
                    className={`border-b border-gray-800 cursor-pointer transition-all ${
                      hoveredRow === defect.id ? 'bg-[#252525]' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-[#3B9EBF] font-mono text-sm">{defect.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-100">{defect.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getSeverityColor(defect.severity)}`}>
                        {defect.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(defect.status)}`}>
                        {defect.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{defect.assignedTeam}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
