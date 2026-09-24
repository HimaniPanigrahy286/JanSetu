import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Eye,
  AlertCircle,
  Building,
  MapPin,
  Briefcase,
  UserCheck,
  Activity,
  Globe,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService, useCitizenRequests } from '../../services/requestService';
import StatusBadge from '../../components/common/StatusBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import type { CitizenRequest } from '../../types';

export default function GovOverview() {
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
  const [selectedReq, setSelectedReq] = useState<CitizenRequest | null>(null);

  const isSenior = requestService.isSeniorOfficer(currentUser);
  const myAssignedRequests = requestService.getByOfficer(currentUser);
  const deptRequests = requestService.getByDepartment(currentUser.department);

  const pendingAssigned = myAssignedRequests.filter(r => r.status === 'pending' || r.status === 'new').length;
  const resolvedAssigned = myAssignedRequests.filter(r => r.status === 'resolved').length;

  const deptPending = deptRequests.filter(r => r.status === 'pending' || r.status === 'new').length;
  const deptResolved = deptRequests.filter(r => r.status === 'resolved').length;
  const deptResolutionRate = deptRequests.length > 0 ? Math.round((deptResolved / deptRequests.length) * 100) : 100;

  const recentTriageQueue = myAssignedRequests.slice(0, 5);

  return (
    <div className="space-y-6 font-body">
      {/* Officer Jurisdiction Banner */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {isSenior ? 'Senior Administrator Console' : 'Officer Workstation'}
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
            WELCOME, {currentUser.name.toUpperCase()}
          </h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Assigned to <strong>{currentUser.department || 'Public Works'}</strong> covering <strong>{currentUser.district || currentUser.location || 'Odisha'}</strong> jurisdiction.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Briefcase size={12} className="text-brand-yellow" />
              {currentUser.designation || 'Government Official'}
            </span>
            <span className="bg-white border-2 border-black px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-brutal-sm">
              <Building size={12} />
              {currentUser.department || 'Public Works'}
            </span>
            <span className="bg-white border-2 border-black px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-brutal-sm">
              <MapPin size={12} className="text-red-600" />
              {currentUser.district || currentUser.location || 'Odisha State'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          {loading && (
            <span className="px-3 py-1.5 bg-black text-brand-yellow rounded-xl text-xs font-mono font-bold animate-pulse">
              Syncing Live Telemetry...
            </span>
          )}
          <div className="p-3 bg-white border-2 border-black rounded-xl shadow-brutal-sm text-xs font-mono font-bold">
            ID: <span className="text-black">{currentUser.employeeId || 'GOV-8921'}</span>
          </div>
        </div>
      </div>

      {/* Row 1: Role-Contextual Workload Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* My Queue */}
        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-black/60">My Active Tasks</span>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-500 px-2 py-0.5 rounded">
              Assigned
            </span>
          </div>
          <p className="font-heading font-extrabold text-3xl mt-2 text-black">{myAssignedRequests.length}</p>
          <p className="text-[10px] font-bold text-black/50 mt-1">{pendingAssigned} pending verification</p>
        </div>

        {/* Department Total */}
        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-black/60">Department Volume</span>
            <Building size={16} className="text-black" />
          </div>
          <p className="font-heading font-extrabold text-3xl mt-2 text-black">{deptRequests.length}</p>
          <p className="text-[10px] font-bold text-black/50 mt-1">{deptPending} unassigned / pending</p>
        </div>

        {/* Resolved Rate */}
        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-black/60">Resolution Rate</span>
            <CheckCircle2 size={16} className="text-emerald-700" />
          </div>
          <p className="font-heading font-extrabold text-3xl mt-2 text-emerald-800">{deptResolutionRate}%</p>
          <p className="text-[10px] font-bold text-black/50 mt-1">{resolvedAssigned} tasks resolved</p>
        </div>

        {/* High Priority Alerts */}
        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-black/60">High Priority Grievances</span>
            <span className="text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-500 px-2 py-0.5 rounded">
              Alert
            </span>
          </div>
          <p className="font-heading font-extrabold text-3xl mt-2 text-red-600">
            {myAssignedRequests.filter(r => r.priority === 'high' || r.aiAnalysis?.severity === 'critical').length}
          </p>
          <p className="text-[10px] font-bold text-black/50 mt-1">Requires immediate site visit</p>
        </div>
      </div>

      {/* Row 2: Portal Navigation Modules */}
      <div className="space-y-3">
        <h3 className="font-heading font-extrabold text-xl">DEPARTMENT DESK & WORKFLOW MODULES</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/government/my-requests"
            className="p-5 bg-white card-brutal rounded-2xl space-y-2 hover:bg-brand-yellow/30 transition-all group"
          >
            <div className="w-10 h-10 bg-brand-yellow border-2 border-black rounded-xl flex items-center justify-center font-bold shadow-brutal-sm">
              <UserCheck size={20} />
            </div>
            <h4 className="font-heading font-extrabold text-base group-hover:underline">My Requests Queue &rarr;</h4>
            <p className="text-xs text-black/70">Execute action on assigned complaints & update live status to citizen.</p>
          </Link>

          <Link
            to="/government/department-requests"
            className="p-5 bg-white card-brutal rounded-2xl space-y-2 hover:bg-brand-yellow/30 transition-all group"
          >
            <div className="w-10 h-10 bg-brand-sage border-2 border-black rounded-xl flex items-center justify-center font-bold shadow-brutal-sm">
              <Building size={20} />
            </div>
            <h4 className="font-heading font-extrabold text-base group-hover:underline">Department Registry &rarr;</h4>
            <p className="text-xs text-black/70">Triage and assign unrouted complaints across {currentUser.department}.</p>
          </Link>

          <Link
            to="/government/analytics"
            className="p-5 bg-white card-brutal rounded-2xl space-y-2 hover:bg-brand-yellow/30 transition-all group"
          >
            <div className="w-10 h-10 bg-black text-brand-yellow border-2 border-black rounded-xl flex items-center justify-center font-bold shadow-brutal-sm">
              <Activity size={20} />
            </div>
            <h4 className="font-heading font-extrabold text-base group-hover:underline">SLA Analytics &rarr;</h4>
            <p className="text-xs text-black/70">Detailed turnaround metrics, category volumes, and compliance audits.</p>
          </Link>

          <Link
            to="/government/regions"
            className="p-5 bg-white card-brutal rounded-2xl space-y-2 hover:bg-brand-yellow/30 transition-all group"
          >
            <div className="w-10 h-10 bg-emerald-300 border-2 border-black rounded-xl flex items-center justify-center font-bold shadow-brutal-sm">
              <Globe size={20} />
            </div>
            <h4 className="font-heading font-extrabold text-base group-hover:underline">Regional Analysis &rarr;</h4>
            <p className="text-xs text-black/70">Demographic density maps and infrastructure deficit scorecards.</p>
          </Link>
        </div>
      </div>

      {/* Row 3: Live Triage Queue */}
      <div className="bg-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-xl">RECENT JURISDICTION COMPLAINTS</h3>
            <p className="text-xs font-bold text-black/60">Live feed filtered for {currentUser.department} • {currentUser.district}</p>
          </div>
          <Link
            to="/government/my-requests"
            className="btn-brutal-secondary px-3.5 py-1.5 text-xs font-extrabold rounded-xl inline-flex items-center gap-1"
          >
            <span>Open Desk</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentTriageQueue.length === 0 ? (
            <div className="py-10 text-center text-black/60 space-y-2 border-2 border-dashed border-black/20 rounded-2xl">
              <AlertCircle className="mx-auto text-black/40" size={32} />
              <p className="font-bold text-sm">No complaints currently queued in your jurisdiction</p>
              <p className="text-xs">New citizen submissions in {currentUser.department} will appear here instantly.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b-2 border-black bg-brand-yellow/30 text-black">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Tracking ID</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {recentTriageQueue.map(req => (
                  <tr key={req.id} className="hover:bg-brand-yellow/10 transition-colors">
                    <td className="py-3 px-3 font-mono text-black/70">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="py-3 px-3 font-mono font-extrabold text-black">{req.id}</td>
                    <td className="py-3 px-3">
                      <CategoryBadge category={req.category} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-black/80">{req.location}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedReq(req)}
                        className="btn-brutal-secondary px-2.5 py-1 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1"
                      >
                        <Eye size={11} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setSelectedReq(null)}>
          <div className="bg-white card-brutal-xl rounded-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-2 pb-2 border-b-2 border-black">
              <div>
                <span className="font-mono text-xs font-extrabold text-black/60">{selectedReq.id}</span>
                <h3 className="font-heading font-extrabold text-xl mt-0.5">{selectedReq.category}</h3>
              </div>
              <StatusBadge status={selectedReq.status} size="md" />
            </div>

            <p className="text-sm font-medium text-black leading-relaxed">{selectedReq.description}</p>

            {selectedReq.aiAnalysis && (
              <div className="p-3 bg-brand-yellow/30 border-2 border-black rounded-xl text-xs space-y-1">
                <p className="font-extrabold text-black">AI Assessment Summary:</p>
                <p className="font-medium text-black/80">{selectedReq.aiAnalysis.summary}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="p-2.5 bg-gray-50 border rounded-xl">
                <span className="text-black/60 block text-[10px]">Department</span>
                <span className="text-black truncate block">{selectedReq.department || currentUser.department}</span>
              </div>
              <div className="p-2.5 bg-gray-50 border rounded-xl">
                <span className="text-black/60 block text-[10px]">Location</span>
                <span className="text-black truncate block">{selectedReq.location}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedReq(null)}
                className="btn-brutal-secondary flex-1 py-2.5 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <Link
                to="/government/my-requests"
                className="btn-brutal-primary flex-1 py-2.5 rounded-xl text-xs font-extrabold text-center"
              >
                Open in My Requests &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
