import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Mic, FileText, Clock, CheckCircle, AlertCircle, MapPin, Globe, ChevronRight, TrendingUp } from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';

const CATEGORY_COLORS: Record<string, string> = {
  Roads: 'bg-blue-100 text-blue-700',
  Water: 'bg-cyan-100 text-cyan-700',
  Electricity: 'bg-yellow-100 text-yellow-700',
  Healthcare: 'bg-red-100 text-red-700',
  Education: 'bg-purple-100 text-purple-700',
  Transport: 'bg-orange-100 text-orange-700',
  Sanitation: 'bg-green-100 text-green-700',
  'Digital Infrastructure': 'bg-indigo-100 text-indigo-700',
  'Public Facilities': 'bg-teal-100 text-teal-700',
};

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending', icon: <Clock size={12} /> },
  under_review: { color: 'bg-blue-100 text-blue-700', label: 'Under Review', icon: <AlertCircle size={12} /> },
  in_progress: { color: 'bg-orange-100 text-orange-700', label: 'In Progress', icon: <TrendingUp size={12} /> },
  resolved: { color: 'bg-green-100 text-green-700', label: 'Resolved', icon: <CheckCircle size={12} /> },
  rejected: { color: 'bg-red-100 text-red-700', label: 'Rejected', icon: <AlertCircle size={12} /> },
};

export default function CitizenDashboard() {
  const user = authService.getCurrentUser()!;
  const stats = requestService.getStats(user.id);
  const recentRequests = requestService.getByUserId(user.id).slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-5">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 right-8 w-20 h-20 bg-white/5 rounded-full translate-y-6" />
        <p className="text-blue-200 text-sm">{greeting},</p>
        <h2 className="text-2xl font-bold mt-0.5">{user.name.split(' ')[0]} 👋</h2>
        <div className="flex items-center gap-4 mt-3 text-sm text-blue-200">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} />
            {user.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Globe size={13} />
            {user.language}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <span className="text-xs bg-blue-500/50 text-blue-100 px-2 py-1 rounded-full border border-blue-400/30">
            Citizen Portal
          </span>
          <span className="text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded-full border border-green-400/30">
            ● Platform Active
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center">
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending + stats.underReview + stats.inProgress}</p>
          <p className="text-xs text-slate-500 mt-0.5">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          <p className="text-xs text-slate-500 mt-0.5">Resolved</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/citizen/submit"
            className="bg-white border-2 border-blue-100 hover:border-blue-300 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:shadow-md group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Send size={18} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <p className="font-semibold text-sm text-slate-800 leading-tight">Submit Development Request</p>
            <p className="text-xs text-slate-500">Report infrastructure issues</p>
          </Link>
          <Link
            to="/citizen/voice"
            className="bg-white border-2 border-purple-100 hover:border-purple-300 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:shadow-md group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
              <Mic size={18} className="text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <p className="font-semibold text-sm text-slate-800 leading-tight">Submit Voice Request</p>
            <p className="text-xs text-slate-500">Speak in your language</p>
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <Link
              key={cat}
              to={`/citizen/submit?category=${encodeURIComponent(cat)}`}
              className={`text-xs px-3 py-1.5 rounded-full font-medium ${color} hover:opacity-80 transition-opacity`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Recent Requests</h3>
          <Link to="/citizen/requests" className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentRequests.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center border border-slate-200">
              <FileText size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No requests yet</p>
              <Link to="/citizen/submit" className="text-blue-600 text-sm font-medium mt-1 inline-block">Submit your first request →</Link>
            </div>
          ) : (
            recentRequests.map(req => {
              const status = STATUS_CONFIG[req.status];
              return (
                <Link
                  key={req.id}
                  to={`/citizen/requests/${req.id}`}
                  className="bg-white rounded-xl p-4 border border-slate-200 block hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[req.category] || 'bg-slate-100 text-slate-600'}`}>
                          {req.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2">{req.description}</p>
                      <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                        <MapPin size={11} />
                        {req.location}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 shrink-0 mt-1" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
