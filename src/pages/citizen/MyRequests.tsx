import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';
import type { RequestStatus } from '../../types';

const CATEGORY_ICONS: Record<string, string> = {
  Roads: '🛣️', Water: '💧', Electricity: '⚡', Healthcare: '🏥',
  Education: '🏫', Transport: '🚌', Sanitation: '🗑️',
  'Digital Infrastructure': '📡', 'Public Facilities': '🏛️',
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; border: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-brand-yellow', border: 'border-black', text: 'text-black' },
  under_review: { label: 'Under Review', bg: 'bg-brand-sage', border: 'border-black', text: 'text-black' },
  in_progress: { label: 'In Progress', bg: 'bg-black', border: 'border-black', text: 'text-brand-yellow' },
  resolved: { label: 'Resolved', bg: 'bg-white', border: 'border-green-600', text: 'text-green-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', border: 'border-red-600', text: 'text-red-700' },
};

const SEV_CONFIG: Record<string, { label: string; color: string }> = {
  critical: { label: '🔴 Critical', color: 'text-red-600' },
  high: { label: '🟠 High', color: 'text-orange-600' },
  medium: { label: '🟡 Medium', color: 'text-yellow-700' },
  low: { label: '🟢 Low', color: 'text-green-700' },
};

export default function MyRequests() {
  const user = authService.getCurrentUser()!;
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  let requests = requestService.getByUserId(user.id);
  if (filter !== 'all') requests = requests.filter(r => r.status === filter);
  if (search.trim()) {
    const q = search.toLowerCase();
    requests = requests.filter(r =>
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    );
  }

  const statuses: (RequestStatus | 'all')[] = ['all', 'pending', 'under_review', 'in_progress', 'resolved'];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6">
        <h1 className="font-heading font-extrabold text-3xl">MY REQUESTS</h1>
        <p className="font-medium text-sm mt-1 text-black/70">
          {requests.length} request{requests.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by category, location, description..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-black rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
              filter === s
                ? 'bg-black text-white border-black shadow-brutal-sm'
                : 'bg-white text-black border-black/30 hover:border-black'
            }`}
          >
            {s === 'all' ? 'All Requests' : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white card-brutal rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-heading font-extrabold text-2xl">No Requests Found</h3>
          <p className="font-medium text-sm text-black/60 mt-2">
            {search ? 'Try a different search term or clear the filter.' : 'You have no requests in this category.'}
          </p>
          <Link to="/citizen/submit" className="btn-brutal-primary mt-6 px-8 py-3 rounded-xl font-extrabold inline-flex">
            Submit New Request →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const sc = STATUS_CONFIG[req.status];
            const sev = SEV_CONFIG[req.aiAnalysis.severity];
            return (
              <div key={req.id} className="bg-white card-brutal rounded-xl p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-brand-sage border-2 border-black rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {CATEGORY_ICONS[req.category] ?? '📌'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-brand-yellow border-2 border-black rounded-lg text-[10px] font-extrabold uppercase tracking-wide">
                        {req.category}
                      </span>
                      {req.isVoice && (
                        <span className="px-2.5 py-1 bg-black text-white border-2 border-black rounded-lg text-[10px] font-extrabold">
                          🎤 VOICE
                        </span>
                      )}
                      <span className={`px-2.5 py-1 ${sc.bg} ${sc.text} border-2 ${sc.border} rounded-lg text-[10px] font-extrabold uppercase`}>
                        {sc.label}
                      </span>
                      <span className={`text-xs font-bold ${sev.color}`}>{sev.label}</span>
                    </div>

                    <p className="font-medium text-sm text-black line-clamp-2">
                      {req.aiAnalysis.summary || req.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-black/50 font-medium">
                      <span>📍 {req.location}</span>
                      <span>🗓 {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="font-mono text-black/30">{req.id}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    to={`/citizen/requests/${req.id}`}
                    className="btn-brutal-primary px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0"
                  >
                    Track →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
