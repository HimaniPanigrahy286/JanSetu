import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, ArrowRight, Mic, PlusCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';
import type { RequestStatus } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';

const STATUS_FILTERS: { value: RequestStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Requests' },
  { value: 'pending', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

const CATEGORY_FILTERS = [
  'All',
  'Roads',
  'Water',
  'Streetlights',
  'Drainage',
  'Public Transport',
  'Schools & Hospitals',
  'Electricity',
  'Sanitation',
];

export default function MyRequests() {
  const user = authService.getCurrentUser() || {
    id: 'u1',
    name: 'Priya Sharma',
    email: 'citizen@demo.com',
    role: 'citizen',
    location: 'Bhubaneswar, Odisha',
    language: 'Odia',
  };

  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  const allRequests = requestService.getByUserId(user.id);

  const filtered = allRequests.filter(req => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && req.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        req.id.toLowerCase().includes(q) ||
        req.category.toLowerCase().includes(q) ||
        req.description.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl">TRACK & GRIEVANCE HISTORY</h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Monitor real-time status, timeline milestones, and municipal engineering responses.
          </p>
        </div>
        <Link
          to="/citizen/submit"
          className="btn-brutal-primary px-5 py-3 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle size={15} />
          <span>New Grievance</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white card-brutal rounded-2xl p-4 md:p-5 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/50 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Tracking ID (e.g. REQ-2026-0891), category, keywords, location..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-extrabold uppercase tracking-wider text-black/60 shrink-0 mr-1 flex items-center gap-1">
            <Filter size={12} />
            Status:
          </span>
          {STATUS_FILTERS.map(f => {
            const isSelected = statusFilter === f.value;
            const count =
              f.value === 'all' ? allRequests.length : allRequests.filter(r => r.status === f.value).length;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-brutal-sm'
                    : 'bg-white text-black border-black/20 hover:border-black'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/10 text-black'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin pt-1 border-t border-black/10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-black/60 shrink-0 mr-1">
            Category:
          </span>
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all shrink-0 ${
                categoryFilter === cat
                  ? 'bg-brand-yellow text-black border-black font-extrabold'
                  : 'bg-gray-100 text-black/70 border-transparent hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Stream / List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white card-brutal-lg rounded-2xl p-12 text-center space-y-4">
            <div className="text-5xl">🔍</div>
            <div>
              <h3 className="font-heading font-extrabold text-2xl">No Grievances Match Filters</h3>
              <p className="text-xs font-bold text-black/60 max-w-sm mx-auto mt-1">
                Try selecting a different status filter or search keyword.
              </p>
            </div>
            <button
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('All');
                setSearch('');
              }}
              className="btn-brutal-secondary px-6 py-2.5 rounded-xl text-xs font-extrabold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map(req => {
            const hasResponse = !!req.officialResponse;
            return (
              <div
                key={req.id}
                className="bg-white card-brutal rounded-2xl p-5 md:p-6 transition-all hover:border-black space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b-2 border-black/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-black bg-gray-100 border border-black/30 px-2.5 py-1 rounded-lg">
                      {req.id}
                    </span>
                    <CategoryBadge category={req.category} size="md" />
                    {req.isVoice && (
                      <span className="px-2 py-0.5 bg-black text-brand-yellow border border-black rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1">
                        <Mic size={10} />
                        VOICE RECORDING
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={req.priority || 'medium'} size="sm" />
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                </div>

                {/* Description & Image Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div className={req.imageUrl ? 'md:col-span-3 space-y-2' : 'md:col-span-4 space-y-2'}>
                    <p className="font-bold text-sm text-black leading-relaxed">
                      {req.aiAnalysis.summary || req.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black/60 font-bold pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-red-500" />
                        {req.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Logged on {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span>Dialect: {req.language}</span>
                    </div>
                  </div>

                  {req.imageUrl && (
                    <div className="md:col-span-1 border-2 border-black rounded-xl overflow-hidden shadow-brutal-sm">
                      <img src={req.imageUrl} alt="Evidence" className="w-full h-24 object-cover" />
                    </div>
                  )}
                </div>

                {/* Official Update Snippet */}
                {hasResponse && (
                  <div className="p-3 bg-brand-yellow/20 border-2 border-black/40 rounded-xl flex items-start gap-2 text-xs">
                    <span className="font-extrabold text-black">🏛️ Gov Update:</span>
                    <p className="font-medium text-black/80 flex-1">{req.officialResponse?.message}</p>
                    {req.officialResponse?.estimatedResolution && (
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 border border-black rounded shrink-0">
                        Target: {req.officialResponse.estimatedResolution}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Tracker Link */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Visual 4-Stage Mini Indicator */}
                    <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono font-bold text-black/50">
                      <span className={req.status === 'pending' || req.status === 'under_review' || req.status === 'in_progress' || req.status === 'resolved' ? 'text-black font-extrabold' : ''}>
                        ● Submitted
                      </span>
                      <span>&rarr;</span>
                      <span className={req.status === 'under_review' || req.status === 'in_progress' || req.status === 'resolved' ? 'text-black font-extrabold' : ''}>
                        ● Review
                      </span>
                      <span>&rarr;</span>
                      <span className={req.status === 'in_progress' || req.status === 'resolved' ? 'text-black font-extrabold' : ''}>
                        ● Action
                      </span>
                      <span>&rarr;</span>
                      <span className={req.status === 'resolved' ? 'text-emerald-700 font-extrabold' : ''}>
                        ● Resolved
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/citizen/requests/${req.id}`}
                    className="btn-brutal-primary px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5"
                  >
                    <span>Track Full Timeline</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
