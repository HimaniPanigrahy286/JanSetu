import { useState } from 'react';
import {
  Search,
  Eye,
  CheckCircle,
  X,
  Send,
  Sparkles,
  UserCheck,
  Building,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService, useCitizenRequests } from '../../services/requestService';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import type { CitizenRequest, RequestStatus } from '../../types';

export default function MyRequestsGov() {
  const rawUser = authService.getCurrentUser();
  const currentUser = {
    id: rawUser?.id || 'gov-user',
    name: rawUser?.name || 'Government Official',
    email: rawUser?.email || '',
    role: rawUser?.role || 'official',
    employeeId: rawUser?.employeeId || 'GOV-OFFICER',
    department: rawUser?.department || 'Public Works Department (PWD)',
    designation: rawUser?.designation || 'Government Officer',
    location: rawUser?.location || rawUser?.district || 'Odisha State',
    district: rawUser?.district || 'State Jurisdiction',
    language: rawUser?.language || 'English',
  };

  const { loading } = useCitizenRequests();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');

  // Modal detail & live status updater
  const [selectedReq, setSelectedReq] = useState<CitizenRequest | null>(null);
  const [newStatus, setNewStatus] = useState<RequestStatus>('in_progress');
  const [officialNote, setOfficialNote] = useState('');
  const [resolutionDate, setResolutionDate] = useState('2026-10-15');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Filter requests for this specific officer
  const myOfficerRequests = requestService.getByOfficer(currentUser);

  const filtered = myOfficerRequests.filter(req => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending' && req.status !== 'pending' && req.status !== 'new') return false;
      if (statusFilter !== 'pending' && req.status !== statusFilter) return false;
    }
    if (priorityFilter !== 'All' && req.priority !== priorityFilter.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        req.id.toLowerCase().includes(q) ||
        req.description.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q) ||
        req.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (dateFilter !== 'All') {
      const reqDate = new Date(req.createdAt || 0);
      const now = new Date();
      if (dateFilter === 'Today') {
        if (reqDate.toDateString() !== now.toDateString()) return false;
      } else if (dateFilter === 'This Week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (reqDate < weekAgo) return false;
      } else if (dateFilter === 'This Month') {
        if (reqDate.getMonth() !== now.getMonth() || reqDate.getFullYear() !== now.getFullYear()) return false;
      }
    }
    return true;
  });

  const handleOpenModal = (req: CitizenRequest) => {
    setSelectedReq(req);
    setNewStatus(req.status);
    setOfficialNote(req.officialResponse?.message || '');
    setResolutionDate(req.officialResponse?.estimatedResolution || '2026-10-15');
    setUpdateSuccess(false);
  };

  const handleUpdateStatus = () => {
    if (!selectedReq) return;
    setUpdating(true);

    setTimeout(() => {
      const updated = requestService.updateStatus(selectedReq.id, newStatus, {
        message: officialNote.trim() || `Status updated to ${newStatus.replace('_', ' ').toUpperCase()} by ${currentUser.name}.`,
        updatedAt: new Date().toISOString(),
        officialName: currentUser.name,
        officialRole: `${currentUser.designation || 'Officer'} • ${currentUser.department || 'Govt'}`,
        estimatedResolution: resolutionDate,
      });

      setUpdating(false);
      setUpdateSuccess(true);
      if (updated) {
        setSelectedReq(updated);
      }
    }, 400);
  };

  const pendingCount = myOfficerRequests.filter(r => r.status === 'pending' || r.status === 'new').length;
  const inProgressCount = myOfficerRequests.filter(r => r.status === 'in_progress' || r.status === 'assigned').length;
  const resolvedCount = myOfficerRequests.filter(r => r.status === 'resolved').length;

  return (
    <div className="space-y-6 font-body">
      {/* Officer Header Card */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <UserCheck size={13} className="text-emerald-600" />
            Officer Action Desk
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
            MY ASSIGNED GRIEVANCES
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-bold text-black/80">
            <span className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-black/20">
              <Briefcase size={12} />
              {currentUser.designation || 'Field Engineer'}
            </span>
            <span className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-black/20">
              <Building size={12} />
              {currentUser.department || 'Public Works'}
            </span>
            <span className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-black/20">
              <MapPin size={12} />
              {currentUser.district || currentUser.location || 'Odisha'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {loading && (
            <span className="px-3 py-1.5 bg-black text-brand-yellow rounded-xl text-xs font-mono font-bold animate-pulse">
              Syncing...
            </span>
          )}
          <div className="bg-black text-white px-4 py-2.5 rounded-xl border-2 border-black shadow-brutal-sm font-mono text-xs font-extrabold">
            <span>Assigned to Me: {myOfficerRequests.length}</span>
          </div>
        </div>
      </div>

      {/* Quick Status KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white card-brutal rounded-xl p-4 border-2 border-black flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-black/60 uppercase tracking-wider">Awaiting Action</p>
            <p className="font-heading font-extrabold text-2xl text-red-600 mt-0.5">{pendingCount}</p>
          </div>
          <div className="w-9 h-9 bg-red-100 border border-red-400 rounded-lg flex items-center justify-center text-red-700">
            <Clock size={18} />
          </div>
        </div>

        <div className="bg-white card-brutal rounded-xl p-4 border-2 border-black flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-black/60 uppercase tracking-wider">In Progress</p>
            <p className="font-heading font-extrabold text-2xl text-amber-600 mt-0.5">{inProgressCount}</p>
          </div>
          <div className="w-9 h-9 bg-amber-100 border border-amber-400 rounded-lg flex items-center justify-center text-amber-700">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="bg-white card-brutal rounded-xl p-4 border-2 border-black flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-black/60 uppercase tracking-wider">Resolved by Me</p>
            <p className="font-heading font-extrabold text-2xl text-emerald-700 mt-0.5">{resolvedCount}</p>
          </div>
          <div className="w-9 h-9 bg-emerald-100 border border-emerald-400 rounded-lg flex items-center justify-center text-emerald-700">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white card-brutal rounded-2xl p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, keyword, location..."
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">New / Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority / Critical</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Requests */}
      <div className="bg-white card-brutal-lg rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-xl">TASK EXECUTION QUEUE</h3>
          <span className="text-xs font-bold text-black/60">Showing {filtered.length} requests</span>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-black/60 space-y-2 border-2 border-dashed border-black/20 rounded-2xl">
              <AlertCircle className="mx-auto text-black/40" size={32} />
              <p className="font-bold text-sm">No requests assigned matching the selected filters</p>
              <p className="text-xs">Incoming citizen requests in your department and region will be routed here.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b-2 border-black bg-brand-yellow/30 text-black">
                  <th className="py-3 px-3">Tracking ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Location / Ward</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {filtered.map(req => (
                  <tr key={req.id} className="hover:bg-brand-yellow/10 transition-colors">
                    <td className="py-3 px-3 font-mono text-black font-extrabold">{req.id}</td>
                    <td className="py-3 px-3">
                      <CategoryBadge category={req.category} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-black/80">{req.location}</td>
                    <td className="py-3 px-3">
                      <PriorityBadge priority={req.priority || 'medium'} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenModal(req)}
                        className="btn-brutal-primary px-3 py-1.5 rounded-lg text-xs font-extrabold inline-flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status Workflow Update Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setSelectedReq(null)}>
          <div className="bg-white card-brutal-xl rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-5 animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-2 pb-3 border-b-2 border-black">
              <div>
                <span className="font-mono text-xs font-extrabold text-black/60">{selectedReq.id}</span>
                <h3 className="font-heading font-extrabold text-2xl mt-0.5">{selectedReq.category}</h3>
                <p className="text-xs font-bold text-black/60 mt-0.5">{selectedReq.location}</p>
              </div>
              <button onClick={() => setSelectedReq(null)} className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center hover:bg-black hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Description */}
            <div className="p-3.5 bg-gray-50 border-2 border-black/20 rounded-xl space-y-1">
              <p className="text-[10px] font-extrabold uppercase text-black/60">Citizen Grievance Description</p>
              <p className="text-xs font-medium text-black leading-relaxed">{selectedReq.description}</p>
            </div>

            {/* Workflow Transition Stepper: New -> Assigned -> In Progress -> Resolved */}
            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider block">Workflow Status</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'pending', label: '1. New' },
                  { key: 'assigned', label: '2. Assigned' },
                  { key: 'in_progress', label: '3. In Progress' },
                  { key: 'resolved', label: '4. Resolved' },
                ].map(s => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setNewStatus(s.key as RequestStatus)}
                    className={`py-2 px-2 rounded-xl border-2 font-bold text-xs transition-all text-center ${
                      newStatus === s.key
                        ? 'bg-brand-yellow border-black shadow-brutal-sm text-black font-extrabold'
                        : 'bg-gray-50 border-black/30 hover:border-black'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Engineering Note / Response */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs uppercase tracking-wider block">
                Official Engineering Note / Status Update (Visible to Citizen) *
              </label>
              <textarea
                rows={3}
                value={officialNote}
                onChange={e => setOfficialNote(e.target.value)}
                placeholder="e.g. Work order issued to junior engineer team for asphalt patching."
                className="w-full border-2 border-black rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Estimated Resolution Date */}
            <div>
              <label className="font-bold text-xs uppercase tracking-wider block mb-1">
                Target Resolution Date
              </label>
              <input
                type="date"
                value={resolutionDate}
                onChange={e => setResolutionDate(e.target.value)}
                className="w-full border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
              />
            </div>

            {updateSuccess && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-600 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle size={15} />
                <span>Status successfully updated & synced with Citizen Portal in real-time!</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedReq(null)}
                className="btn-brutal-secondary flex-1 py-3 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="btn-brutal-primary flex-1 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5"
              >
                <Send size={13} />
                <span>{updating ? 'Updating...' : 'Publish Official Update'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
