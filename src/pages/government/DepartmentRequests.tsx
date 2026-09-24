import { useState } from 'react';
import {
  Search,
  CheckCircle,
  X,
  UserPlus,
  AlertCircle,
  Building,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService, useCitizenRequests } from '../../services/requestService';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import type { CitizenRequest, RequestStatus } from '../../types';
import { DISTRICTS, DESIGNATIONS } from '../../types';

export default function DepartmentRequests() {
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
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');

  // Assign Modal
  const [assignReq, setAssignReq] = useState<CitizenRequest | null>(null);
  const [officerName, setOfficerName] = useState(currentUser.name);
  const [officerDesignation, setOfficerDesignation] = useState(DESIGNATIONS[0]);
  const [assignSuccess, setAssignSuccess] = useState(false);

  const deptRequests = requestService.getByDepartment(currentUser.department, districtFilter !== 'All' ? districtFilter : undefined);

  const filtered = deptRequests.filter(req => {
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
        req.category.toLowerCase().includes(q) ||
        (req.assignedOfficerName && req.assignedOfficerName.toLowerCase().includes(q));
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

  const handleAssign = () => {
    if (!assignReq) return;
    requestService.assignOfficer(assignReq.id, `OFF-${Date.now().toString().slice(-4)}`, officerName.trim(), officerDesignation);
    setAssignSuccess(true);
    setTimeout(() => {
      setAssignSuccess(false);
      setAssignReq(null);
    }, 900);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <Building size={13} className="text-black" />
            Department Triage Registry
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
            {currentUser.department || 'DEPARTMENT'} GRIEVANCES
          </h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Department-wide civic requests auto-routed from citizen categories and clustered by regional jurisdictions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {loading && (
            <span className="px-3 py-1.5 bg-black text-brand-yellow rounded-xl text-xs font-mono font-bold animate-pulse">
              Syncing Live...
            </span>
          )}
          <div className="bg-black text-white px-4 py-2.5 rounded-xl border-2 border-black shadow-brutal-sm font-mono text-xs font-extrabold">
            <span>Total in Department: {deptRequests.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white card-brutal rounded-2xl p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, keyword, officer..."
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
              <option value="High">High / Critical</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="All">All Districts</option>
              {DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
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

      {/* Main Table */}
      <div className="bg-white card-brutal-lg rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-xl">DEPARTMENT REGISTRY QUEUE</h3>
          <span className="text-xs font-bold text-black/60">Showing {filtered.length} of {deptRequests.length}</span>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-black/60 space-y-2 border-2 border-dashed border-black/20 rounded-2xl">
              <AlertCircle className="mx-auto text-black/40" size={32} />
              <p className="font-bold text-sm">No department grievances found</p>
              <p className="text-xs">Citizen grievances in {currentUser.department} will be automatically routed here.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b-2 border-black bg-brand-yellow/30 text-black">
                  <th className="py-3 px-3">Tracking ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">District / Ward</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Assigned Officer</th>
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
                      {req.assignedOfficerName ? (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold border border-blue-400">
                          👤 {req.assignedOfficerName}
                        </span>
                      ) : (
                        <span className="text-black/40 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setAssignReq(req);
                          setOfficerName(req.assignedOfficerName || currentUser.name);
                        }}
                        className="btn-brutal-secondary px-3 py-1.5 rounded-lg text-xs font-extrabold inline-flex items-center gap-1"
                      >
                        <UserPlus size={12} />
                        <span>Assign / Route</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {assignReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setAssignReq(null)}>
          <div className="bg-white card-brutal-xl rounded-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-2 border-b-2 border-black">
              <div>
                <span className="font-mono text-xs font-extrabold text-black/60">{assignReq.id}</span>
                <h3 className="font-heading font-extrabold text-xl mt-0.5">Assign Officer to Request</h3>
              </div>
              <button onClick={() => setAssignReq(null)} className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center hover:bg-black hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-xs uppercase tracking-wider block mb-1">Officer Name</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={e => setOfficerName(e.target.value)}
                  placeholder="Officer name"
                  className="w-full border-2 border-black rounded-xl p-2.5 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-xs uppercase tracking-wider block mb-1">Designation</label>
                <select
                  value={officerDesignation}
                  onChange={e => setOfficerDesignation(e.target.value)}
                  className="w-full border-2 border-black rounded-xl p-2.5 text-xs font-bold focus:outline-none"
                >
                  {DESIGNATIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {assignSuccess && (
              <div className="p-2.5 bg-emerald-100 border-2 border-emerald-600 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle size={14} />
                <span>Assigned successfully! Status changed to 'Assigned'.</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button onClick={() => setAssignReq(null)} className="btn-brutal-secondary flex-1 py-2.5 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleAssign} className="btn-brutal-primary flex-1 py-2.5 rounded-xl text-xs font-extrabold">
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
