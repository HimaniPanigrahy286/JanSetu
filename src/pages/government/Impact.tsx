import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell
} from 'recharts';
import { TrendingDown, TrendingUp, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { projectService } from '../../services/projectService';

const BEFORE_AFTER_DATA = [
  { name: 'Kalahandi\n(Roads)', before: 1247, after: 310, color: '#3b82f6' },
  { name: 'Koraput\n(Water)', before: 890, after: 180, color: '#06b6d4' },
  { name: 'Malkangiri\n(Health)', before: 620, after: 95, color: '#ef4444' },
  { name: 'Rayagada\n(Energy)', before: 480, after: 120, color: '#f59e0b' },
];

const INFRA_INDEX_TREND = [
  { month: 'Jan', kalahandi: 24, koraput: 30, malkangiri: 19 },
  { month: 'Feb', kalahandi: 24, koraput: 31, malkangiri: 19 },
  { month: 'Mar', kalahandi: 25, koraput: 33, malkangiri: 20 },
  { month: 'Apr', kalahandi: 25, koraput: 38, malkangiri: 21 },
  { month: 'May', kalahandi: 26, koraput: 44, malkangiri: 23 },
  { month: 'Jun', kalahandi: 26, koraput: 52, malkangiri: 30 },
  { month: 'Jul', kalahandi: 27, koraput: 58, malkangiri: 38 },
  { month: 'Aug', kalahandi: 27, koraput: 62, malkangiri: 48 },
  { month: 'Sep', kalahandi: 28, koraput: 66, malkangiri: 58 },
];

const POPULATION_AFFECTED = [
  { region: 'Kalahandi', before: 850000, after: 210000 },
  { region: 'Koraput', before: 720000, after: 180000 },
  { region: 'Malkangiri', before: 480000, after: 120000 },
  { region: 'Rayagada', before: 380000, after: 95000 },
];

export default function Impact() {
  const projects = projectService.getAll();
  const completedProjects = projects.filter(p => p.status === 'completed' || p.status === 'in_progress');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Impact Dashboard</h1>
          <p className="text-slate-500 text-sm">Before/after analysis of government infrastructure interventions</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <Info size={14} className="text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">Illustrative Demo Data</span>
        </div>
      </div>

      {/* Summary Impact Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Complaints Reduced', before: '3,237', after: '705', icon: TrendingDown, color: 'text-green-600', bg: 'bg-green-600' },
          { label: 'Avg. Infra. Index', before: '25%', after: '59%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-600' },
          { label: 'People Benefited', before: '2.43M', after: '1.89M saved', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-600' },
          { label: 'Projects Active', before: '0', after: completedProjects.length.toString(), icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon size={16} className="text-white" />
            </div>
            <p className="text-xs text-slate-500 mb-2">{card.label}</p>
            <div className="flex items-end gap-2">
              <div>
                <p className="text-xs text-red-500 line-through">{card.before}</p>
                <p className={`text-xl font-bold ${card.color}`}>{card.after}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Before/After Requests Chart */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1">Citizen Complaints — Before vs. After</h3>
          <p className="text-xs text-slate-500 mb-4">Number of active complaints before and after project implementation</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BEFORE_AFTER_DATA} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="before" name="Before" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="after" name="After" fill="#86efac" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Infrastructure Index Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1">Infrastructure Index Trend</h3>
          <p className="text-xs text-slate-500 mb-4">Monthly improvement after investment (Jan–Sep 2026)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={INFRA_INDEX_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="kalahandi" name="Kalahandi" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="koraput" name="Koraput" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="malkangiri" name="Malkangiri" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Population Affected Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-1">Population Affected — Before vs. After</h3>
        <p className="text-xs text-slate-500 mb-4">Number of people affected by infrastructure gaps before and after project completion</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={POPULATION_AFFECTED} layout="vertical" barCategoryGap={15}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="region" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={v => `${(Number(v) / 1000).toFixed(0)}K people`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="before" name="Before" fill="#fca5a5" radius={[0, 4, 4, 0]} />
            <Bar dataKey="after" name="After" fill="#86efac" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Completion Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Project Impact Summary</h3>
          <p className="text-xs text-slate-500 mt-0.5">Before and after metrics per completed/active project</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Region</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Complaints Before</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Complaints After</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Reduction</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Infra Before</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Infra After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedProjects.map(p => {
                const reduction = p.beforeRequests && p.afterRequests
                  ? Math.round(((p.beforeRequests - p.afterRequests) / p.beforeRequests) * 100)
                  : 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 text-sm">{p.title.split(' — ')[0]}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{p.region.replace(' District', '')}</td>
                    <td className="px-4 py-3 text-right text-red-600 font-semibold">{p.beforeRequests?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-semibold">{p.afterRequests?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-green-600 font-bold">↓ {reduction}%</span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">{p.beforeScore}%</td>
                    <td className="px-4 py-3 text-right text-blue-600 font-semibold">{p.afterScore}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
          <p className="text-xs text-amber-700">
            📊 <strong>Illustrative Demo Data:</strong> The before/after figures shown here are simulated for demonstration purposes based on realistic infrastructure improvement patterns.
          </p>
        </div>
      </div>
    </div>
  );
}
