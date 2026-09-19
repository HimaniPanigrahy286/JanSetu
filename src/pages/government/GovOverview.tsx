import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { Users, AlertTriangle, TrendingDown, CheckCircle, ArrowUp } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

const STAT_CARDS = [
  { label: 'Total Citizen Requests', value: '12,458', icon: Users, change: '+8.2%', color: 'blue', bg: 'bg-blue-600' },
  { label: 'High Priority Areas', value: '27', icon: AlertTriangle, change: '+3 this month', color: 'orange', bg: 'bg-orange-500' },
  { label: 'Infrastructure Gap', value: '67%', icon: TrendingDown, change: '-2.1% improved', color: 'red', bg: 'bg-red-500' },
  { label: 'Resolved Requests', value: '4,892', icon: CheckCircle, change: '+12.5%', color: 'green', bg: 'bg-green-600' },
];

const REGION_HEATMAP = [
  { region: 'Kalahandi', score: 86, requests: 2450 },
  { region: 'Koraput', score: 81, requests: 1820 },
  { region: 'Malkangiri', score: 74, requests: 1240 },
  { region: 'Rayagada', score: 65, requests: 980 },
  { region: 'Nuapada', score: 69, requests: 850 },
  { region: 'Bolangir', score: 58, requests: 720 },
];

export default function GovOverview() {
  const requestsOverTime = analyticsService.getRequestsOverTime();
  const byCategory = analyticsService.getByCategory();
  const severity = analyticsService.getSeverityDistribution();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Overview Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Real-time infrastructure demand intelligence across BRICS regions</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                <card.icon size={20} className="text-white" />
              </div>
              <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                <ArrowUp size={11} />
                {card.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
            <p className="text-sm text-slate-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Requests Over Time */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800">Citizen Requests Over Time</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly trend: submitted vs. resolved</p>
            </div>
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={requestsOverTime}>
              <defs>
                <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="requests" name="Submitted" stroke="#3b82f6" fill="url(#reqGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" fill="url(#resGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1">Severity Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">By request severity level</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={severity} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                {severity.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {severity.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.fill }} />
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Requests by Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1">Requests by Category</h3>
          <p className="text-xs text-slate-500 mb-4">Total citizen requests per infrastructure sector</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {byCategory.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Demand Heatmap */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1">Regional Priority Heatmap</h3>
          <p className="text-xs text-slate-500 mb-4">Priority score by district (India — Odisha)</p>
          <div className="space-y-2">
            {REGION_HEATMAP.map(region => (
              <div key={region.region}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-700 font-medium">{region.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{region.requests.toLocaleString()} reqs</span>
                    <span className={`text-xs font-bold ${region.score >= 80 ? 'text-red-600' : region.score >= 70 ? 'text-orange-600' : 'text-yellow-600'}`}>
                      {region.score}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${region.score}%`,
                      background: region.score >= 80 ? '#dc2626' : region.score >= 70 ? '#f97316' : '#eab308'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 text-right">Higher score = Higher priority</p>
        </div>
      </div>
    </div>
  );
}
