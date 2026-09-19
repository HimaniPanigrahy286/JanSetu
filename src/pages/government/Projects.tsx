import React, { useState } from 'react';
import { FolderKanban, Filter, Search, Calendar, DollarSign, MapPin, ChevronDown, CheckCircle, Clock, TrendingUp, PauseCircle } from 'lucide-react';
import { projectService } from '../../services/projectService';
import type { Project } from '../../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  planning: { label: 'Planning', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Clock size={13} /> },
  in_progress: { label: 'In Progress', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <TrendingUp size={13} /> },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle size={13} /> },
  on_hold: { label: 'On Hold', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: <PauseCircle size={13} /> },
};

const CAT_COLORS: Record<string, string> = {
  Roads: 'bg-blue-100 text-blue-700',
  Water: 'bg-cyan-100 text-cyan-700',
  Electricity: 'bg-yellow-100 text-yellow-700',
  Healthcare: 'bg-red-100 text-red-700',
  Education: 'bg-purple-100 text-purple-700',
  'Digital Infrastructure': 'bg-indigo-100 text-indigo-700',
};

export default function Projects() {
  const projects = projectService.getAll();
  const stats = projectService.getStats();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);

  let filtered = projects;
  if (filter !== 'all') filtered = filtered.filter(p => p.status === filter);
  if (search) filtered = filtered.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.region.toLowerCase().includes(search.toLowerCase())
  );

  const formatBudget = (b: number) => {
    if (b >= 10000000) return `₹${(b / 10000000).toFixed(1)} Cr`;
    if (b >= 100000) return `₹${(b / 100000).toFixed(1)} L`;
    return `₹${b.toLocaleString()}`;
  };

  const getProgress = (p: Project) => {
    if (p.status === 'completed') return 100;
    if (p.status === 'on_hold') return 30;
    if (p.status === 'in_progress') return 60;
    return 10;
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
        <p className="text-slate-500 text-sm">Track infrastructure projects funded by government investment</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Projects', value: stats.total, color: 'text-slate-800' },
          { label: 'Planning', value: stats.planning, color: 'text-blue-600' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-orange-600' },
          { label: 'Completed', value: stats.completed, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'planning', 'in_progress', 'completed', 'on_hold'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(project => {
          const status = STATUS_CONFIG[project.status];
          const progress = getProgress(project);
          return (
            <div
              key={project.id}
              onClick={() => setSelected(project)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_COLORS[project.category] || 'bg-slate-100 text-slate-600'}`}>
                  {project.category}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 ${status.color}`}>
                  {status.icon}
                  {status.label}
                </span>
              </div>

              <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{project.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">{project.description}</p>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                      background: project.status === 'completed' ? '#22c55e' : project.status === 'in_progress' ? '#f97316' : project.status === 'on_hold' ? '#94a3b8' : '#3b82f6'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <DollarSign size={12} className="text-green-500" />
                  {formatBudget(project.budget)}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin size={12} className="text-blue-500" />
                  <span className="truncate">{project.region}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar size={12} className="text-purple-500" />
                  {new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle size={12} className="text-orange-500" />
                  {project.requestsAddressed.toLocaleString()} requests
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-800 text-lg leading-tight max-w-xs">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-light shrink-0">×</button>
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_COLORS[selected.category]}`}>{selected.category}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 ${STATUS_CONFIG[selected.status].color}`}>
                {STATUS_CONFIG[selected.status].icon}
                {STATUS_CONFIG[selected.status].label}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{selected.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Budget', value: formatBudget(selected.budget) },
                { label: 'Region', value: selected.region },
                { label: 'Start Date', value: new Date(selected.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Completion', value: new Date(selected.completionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Requests Addressed', value: selected.requestsAddressed.toLocaleString() },
                { label: 'Progress', value: `${getProgress(selected)}%` },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                  <p className="font-semibold text-sm text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
