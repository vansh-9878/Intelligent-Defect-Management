import { useState } from 'react';
import { TopNav } from './TopNav';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';

type Screen = 'dashboard' | 'report-defect' | 'defect-list' | 'analytics' | 'defect-details';

interface DefectDetailsProps {
  onNavigate: (screen: Screen) => void;
}

export function DefectDetails({ onNavigate }: DefectDetailsProps) {
  const [comment, setComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);

  const handleAddComment = () => {
    setIsAddingComment(true);
    setTimeout(() => {
      setIsAddingComment(false);
      setComment('');
    }, 1000);
  };

  const handleUpdateStatus = () => {
    setIsUpdatingStatus(true);
    setTimeout(() => {
      setIsUpdatingStatus(false);
      setStatusUpdated(true);
      setTimeout(() => setStatusUpdated(false), 2000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <TopNav onNavigate={onNavigate} />
      
      <div className="max-w-5xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <motion.button
            onClick={() => onNavigate('defect-list')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-4"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Defect List</span>
          </motion.button>
          <h2 className="text-3xl text-gray-100">Defect Details</h2>
        </motion.div>

        {/* Defect Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#3B9EBF] font-mono text-lg">DEF-1234</span>
                <span className="px-3 py-1 rounded-full text-xs border bg-red-500/10 text-red-400 border-red-500/20">
                  Critical
                </span>
                <span className="px-3 py-1 rounded-full text-xs border bg-purple-500/10 text-purple-400 border-purple-500/20">
                  Open
                </span>
              </div>
              <h3 className="text-2xl text-gray-100 mb-4">Login authentication fails on Safari</h3>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: Jan 15, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Assigned: Auth Team</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
            <div>
              <p className="text-xs text-gray-500 mb-1">Reporter</p>
              <p className="text-gray-200">John Smith</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Environment</p>
              <p className="text-gray-200">Production, Safari 17</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Module</p>
              <p className="text-gray-200">Authentication</p>
            </div>
          </div>
        </motion.div>

        {/* Defect Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8 mb-6"
        >
          <h4 className="text-lg text-gray-100 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#3B9EBF]" />
            Defect Description
          </h4>
          <div className="text-gray-300 leading-relaxed space-y-3">
            <p>
              When users attempt to log in using Safari browser (version 17.x), the authentication process fails with a CORS error. 
              This issue does not occur in Chrome, Firefox, or Edge browsers.
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-300">Steps to reproduce:</strong><br />
              1. Open Safari browser<br />
              2. Navigate to login page<br />
              3. Enter valid credentials<br />
              4. Click "Login" button<br />
              5. Observe CORS error in console
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-300">Expected:</strong> User should be authenticated and redirected to dashboard<br />
              <strong className="text-gray-300">Actual:</strong> CORS error prevents authentication
            </p>
          </div>
        </motion.div>

        {/* Resolution Comments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-8 mb-6"
        >
          <h4 className="text-lg text-gray-100 mb-4">Resolution Comments</h4>
          
          <div className="space-y-4 mb-6">
            <div className="bg-[#252525] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#3B9EBF] rounded-full flex items-center justify-center text-white text-sm">
                  JS
                </div>
                <div>
                  <p className="text-sm text-gray-200">Jane Developer</p>
                  <p className="text-xs text-gray-500">Jan 16, 2026 at 10:30 AM</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Investigating the CORS configuration on the authentication service. This appears to be related to Safari's strict cookie policies.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Add Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-[#3B9EBF] transition-colors resize-none"
              rows={4}
              placeholder="Enter your comment or update..."
            />
            <motion.button
              onClick={handleAddComment}
              disabled={isAddingComment || !comment.trim()}
              whileHover={{ scale: isAddingComment ? 1 : 1.02 }}
              whileTap={{ scale: isAddingComment ? 1 : 0.98 }}
              className="mt-3 bg-[#2A2A2A] text-gray-300 px-6 py-2 rounded-lg hover:bg-[#333333] transition-all border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAddingComment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Comment</span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex gap-4"
        >
          <motion.button
            onClick={handleUpdateStatus}
            disabled={isUpdatingStatus || statusUpdated}
            whileHover={{ scale: isUpdatingStatus || statusUpdated ? 1 : 1.02 }}
            whileTap={{ scale: isUpdatingStatus || statusUpdated ? 1 : 0.98 }}
            className="bg-gradient-to-r from-[#3B9EBF] to-[#2A7A94] text-white px-6 py-3 rounded-lg font-medium hover:from-[#45B0D1] hover:to-[#3188A6] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdatingStatus ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : statusUpdated ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Status Updated!</span>
              </>
            ) : (
              <span>Update Status</span>
            )}
          </motion.button>
          
          <motion.button
            onClick={() => onNavigate('defect-list')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#2A2A2A] text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-[#333333] transition-all border border-gray-700"
          >
            Back to List
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
