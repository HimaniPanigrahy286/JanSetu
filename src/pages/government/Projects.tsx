import { useState } from 'react';
import {
  FolderKanban,
  Search,
  MapPin,
  Eye,
  X,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import CategoryBadge from '../../components/common/CategoryBadge';
import type { Project } from '../../types';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(projectService.getAll());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Selected project for view/update modal
  const [selectedProj, setSelectedProj] = useState<Project | null>(null);
  const [newStatus, setNewStatus] = useState<Project['status']>('in_progress');
  const [newProgress, setNewProgress] = useState<number>(50);

  const stats = projectService.getStats();

  const handleUpdateStatus = () => {
    if (!selectedProj) return;
    const updated = projectService.updateProjectStatus(selectedProj.id, newStatus, newProgress);
    if (updated) {
      setSelectedProj(updated);
      setProjects(projectService.getAll());
    }
  };

  const filtered = projects.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const formatBudget = (b: number) => {
    if (b >= 10000000) return `₹${(b / 10000000).toFixed(1)} Cr`;
    if (b >= 100000) return `₹${(b / 100000).toFixed(1)} Lakh`;
    return `₹${b.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <FolderKanban size={13} />
            Public Works Project Pipeline
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
            INFRASTRUCTURE PROJECTS PIPELINE
          </h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Capital projects directly derived from citizen demand clusters and explainable AI prioritization.
          </p>
        </div>

        <div className="p-3 bg-white border-2 border-black rounded-xl shadow-brutal-sm text-xs font-bold text-black/80">
          Total Sanctioned Budget: <span className="font-extrabold text-black font-mono">{formatBudget(stats.totalBudget)}</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white card-brutal rounded-2xl p-4 text-center">
          <p className="font-heading font-extrabold text-3xl text-black">{stats.total}</p>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/60 mt-1">Total Projects</p>
        </div>
        <div className="bg-brand-yellow card-brutal rounded-2xl p-4 text-center">
          <p className="font-heading font-extrabold text-3xl text-black">{stats.proposed + stats.planning}</p>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/70 mt-1">Proposed / Planning</p>
        </div>
        <div className="bg-brand-charcoal text-white card-brutal rounded-2xl p-4 text-center">
          <p className="font-heading font-extrabold text-3xl text-brand-yellow">{stats.inProgress}</p>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-sage mt-1">In Execution</p>
        </div>
        <div className="bg-white card-brutal rounded-2xl p-4 text-center">
          <p className="font-heading font-extrabold text-3xl text-emerald-700">{stats.completed}</p>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/60 mt-1">Completed</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white card-brutal rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects by name, district, category..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Roads">Roads & Transport</option>
            <option value="Water">Water Supply</option>
            <option value="Electricity">Electricity & Energy</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Sanitation">Sanitation</option>
          </select>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'proposed', 'planning', 'in_progress', 'completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 transition-all capitalize ${
                  statusFilter === st
                    ? 'bg-black text-white border-black shadow-brutal-sm'
                    : 'bg-white text-black border-black/20 hover:border-black'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(proj => (
          <div
            key={proj.id}
            onClick={() => {
              setSelectedProj(proj);
              setNewStatus(proj.status);
              setNewProgress(proj.progress || 50);
            }}
            className="bg-white card-brutal-lg rounded-3xl p-6 flex flex-col justify-between transition-all hover:border-black cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-2">
                <CategoryBadge category={proj.category} size="sm" />
                <span
                  className={`px-2.5 py-0.5 rounded-lg border-2 text-[10px] font-extrabold uppercase shadow-brutal-sm ${
                    proj.status === 'completed'
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-800'
                      : proj.status === 'in_progress'
                        ? 'bg-brand-yellow border-black text-black'
                        : proj.status === 'planning'
                          ? 'bg-brand-sage border-black text-black'
                          : 'bg-white border-black text-black'
                  }`}
                >
                  {proj.status.replace('_', ' ')}
                </span>
              </div>

              {/* Title & Region */}
              <div>
                <h3 className="font-heading font-extrabold text-lg text-black leading-tight">{proj.title}</h3>
                <p className="text-xs font-bold text-black/60 mt-1 flex items-center gap-1">
                  <MapPin size={12} className="text-red-500" />
                  {proj.region} Region
                </p>
              </div>

              <p className="text-xs font-medium text-black/75 line-clamp-2 leading-relaxed">{proj.description}</p>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-extrabold">
                  <span className="text-black/60">Execution Progress</span>
                  <span className="font-mono text-black">{proj.progress || (proj.status === 'completed' ? 100 : 45)}%</span>
                </div>
                <div className="w-full bg-black/10 h-2.5 rounded-full border border-black/20 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{
                      width: `${proj.progress || (proj.status === 'completed' ? 100 : 45)}%`,
                      backgroundColor: proj.status === 'completed' ? '#10b981' : '#000000',
                    }}
                  />
                </div>
              </div>

              {/* Key Project Numbers */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 bg-gray-50 border border-black/20 rounded-xl">
                  <span className="text-[10px] font-extrabold uppercase text-black/50 block">Sanctioned Budget</span>
                  <span className="font-heading font-extrabold text-sm text-black font-mono">
                    {formatBudget(proj.budget)}
                  </span>
                </div>
                <div className="p-2.5 bg-gray-50 border border-black/20 rounded-xl">
                  <span className="text-[10px] font-extrabold uppercase text-black/50 block">Complaints Solved</span>
                  <span className="font-heading font-extrabold text-sm text-emerald-700 font-mono">
                    {proj.requestsAddressed} Grievances
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-black/50">ID: {proj.id}</span>
              <button
                type="button"
                className="btn-brutal-secondary px-3 py-1.5 rounded-lg text-xs font-extrabold inline-flex items-center gap-1"
              >
                <Eye size={12} />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details & Status Modifier Modal */}
      {selectedProj && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedProj(null)}
        >
          <div
            className="bg-white card-brutal-xl rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 pb-3 border-b-2 border-black">
              <div>
                <span className="font-mono text-xs font-extrabold bg-brand-yellow px-2 py-0.5 border border-black rounded">
                  {selectedProj.id}
                </span>
                <h3 className="font-heading font-extrabold text-xl text-black mt-1">{selectedProj.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProj(null)}
                className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center font-extrabold hover:bg-black hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="font-medium text-sm text-black leading-relaxed">{selectedProj.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="p-3 bg-gray-50 border border-black rounded-xl">
                  <span className="text-[10px] text-black/60 block">Region Jurisdiction</span>
                  <span className="text-black">{selectedProj.region}</span>
                </div>
                <div className="p-3 bg-gray-50 border border-black rounded-xl">
                  <span className="text-[10px] text-black/60 block">Total Budget</span>
                  <span className="text-black font-mono">{formatBudget(selectedProj.budget)}</span>
                </div>
                <div className="p-3 bg-gray-50 border border-black rounded-xl">
                  <span className="text-[10px] text-black/60 block">Addressed Complaints</span>
                  <span className="text-black">{selectedProj.requestsAddressed} verified logs</span>
                </div>
                <div className="p-3 bg-gray-50 border border-black rounded-xl">
                  <span className="text-[10px] text-black/60 block">Citizens Benefited</span>
                  <span className="text-black">~{(selectedProj.affectedPopulation || 12000).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="p-4 bg-brand-yellow/30 border-2 border-black rounded-2xl space-y-3">
                <span className="font-heading font-extrabold text-xs uppercase text-black">
                  Update Project Lifecycle State
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-black/70 mb-1">Status State</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as Project['status'])}
                      className="w-full bg-white border-2 border-black rounded-xl p-2 font-bold text-xs"
                    >
                      <option value="proposed">PROPOSED</option>
                      <option value="planning">PLANNED</option>
                      <option value="in_progress">IN PROGRESS</option>
                      <option value="completed">COMPLETED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-black/70 mb-1">Progress ({newProgress}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newProgress}
                      onChange={e => setNewProgress(Number(e.target.value))}
                      className="w-full accent-black mt-2 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  className="btn-brutal-primary w-full py-2.5 rounded-xl text-xs font-extrabold"
                >
                  Save Project Milestone &rarr;
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-black/10">
              <button
                onClick={() => setSelectedProj(null)}
                className="btn-brutal-secondary px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
