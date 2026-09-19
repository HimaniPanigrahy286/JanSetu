import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Clock, CheckCircle, AlertCircle, TrendingUp, MapPin, ChevronRight, Mic } from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';
import type { RequestStatus } from '../../types';

const STATUS_CONFIG: Record<string, { color: string; label: string; dot: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending', dot: 'bg-yellow-500' },
  under_review: { color: 'bg-blue-100 text-blue-700', label: 'Under Review', dot: 'bg-blue-500' },
  in_progress: { color: 'bg-orange-100 text-orange-700', label: 'In Progress', dot: 'bg-orange-500' },
  resolved: { color: 'bg-green-100 text-green-700', label: 'Resolved', dot: 'bg-green-500' },
  rejected: { color: 'bg-red-100 text-red-700', label: 'Rejected', dot: 'bg-red-500' },
};

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

const SEV_COLOR: Record<string, string> = {
  critical: 'text-red-600',
  high: 'text-orange-600',
  medium: 'text-yellow-600',
  low: 'text-green-600',
};

export default function MyRequests() {
  const user = authService.getCurrentUser()!;
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  let requests = requestService.getByUserId(user.id);
  if (filter !== 'all') requests = requests.filter(r => r.status === filter);
  if (search) requests = requests.filter(r =>
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  const statuses: (RequestStatus | 'all')[] = ['all', 'pending', 'under_review', 'in_progress', 'resolved'];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">My Requests</h2>
        <p className="text-slate-500 text-sm mt-0.5">{requests.length} request{requests.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by category, location..."
          className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Filter size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No requests found</p>
          <p className="text-slate-400 text-sm mt-1">
            {search ? 'Try a different search term' : 'Submit your first request!'}
          </p>
          <Link to="/citizen/submit" className="inline-block mt-3 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            Submit Request
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const status = STATUS_CONFIG[req.status];
            return (
              <Link
                key={req.id}
                to={`/citizen/requests/${req.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 block hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${status.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[req.category] || 'bg-slate-100 text-slate-600'}`}>
                        {req.category}
                      </span>
                      {req.isVoice && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
                          <Mic size={10} /> Voice
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{req.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin size={11} />{req.location}</span>
                        <span className={`font-medium ${SEV_COLOR[req.aiAnalysis.severity]} capitalize`}>
                          ● {req.aiAnalysis.severity}
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
