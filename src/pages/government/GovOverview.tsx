import { analyticsService } from '../../services/analyticsService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

const STAT_CARDS = [
  { label: 'Total Citizen Requests', value: '12,458', change: '+8.2% this month', bg: 'bg-brand-yellow', border: 'border-black', icon: '📋' },
  { label: 'High Priority Areas', value: '27', change: '+3 this month', bg: 'bg-black', border: 'border-black', textClass: 'text-white', changeClass: 'text-brand-yellow', icon: '🚨' },
  { label: 'Infrastructure Gap', value: '67%', change: '-2.1% improved', bg: 'bg-brand-sage', border: 'border-black', icon: '🏗️' },
  { label: 'Resolved Requests', value: '4,892', change: '+12.5%', bg: 'bg-white', border: 'border-black', icon: '✅' },
];

const REGION_HEATMAP = [
  { region: 'Kalahandi', score: 86, requests: 2450 },
  { region: 'Koraput', score: 81, requests: 1820 },
  { region: 'Malkangiri', score: 74, requests: 1240 },
  { region: 'Rayagada', score: 65, requests: 980 },
  { region: 'Nuapada', score: 69, requests: 850 },
  { region: 'Bolangir', score: 58, requests: 720 },
];

const PIE_COLORS = ['#000000', '#ffe17c', '#b7c6c2', '#272727', '#ffffff'];

export default function GovOverview() {
  const requestsOverTime = analyticsService.getRequestsOverTime();
  const byCategory = analyticsService.getByCategory();
  const severity = analyticsService.getSeverityDistribution();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6">
        <h1 className="font-heading font-extrabold text-3xl">OVERVIEW DASHBOARD</h1>
        <p className="font-medium text-sm mt-1 text-black/70">Real-time infrastructure demand intelligence across BRICS regions</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => (
          <div key={card.label} className={`${card.bg} ${card.border} card-brutal rounded-2xl p-5`}>
            <div className="text-3xl mb-3">{card.icon}</div>
            <p className={`font-heading font-extrabold text-3xl ${card.textClass ?? 'text-black'}`}>{card.value}</p>
            <p className={`font-bold text-xs uppercase tracking-wider mt-1 ${card.textClass ?? 'text-black'}`}>{card.label}</p>
            <p className={`text-xs font-medium mt-1 ${card.changeClass ?? 'text-black/50'}`}>{card.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Requests Over Time */}
        <div className="lg:col-span-2 bg-white card-brutal rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-extrabold text-lg">CITIZEN REQUESTS OVER TIME</h3>
              <p className="text-xs font-medium text-black/50 mt-0.5">Monthly trend: submitted vs. resolved</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={requestsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 11, fontWeight: 700 }} />
              <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700 }} />
              <Area type="monotone" dataKey="requests" stroke="#000000" fill="#ffe17c" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved" stroke="#b7c6c2" fill="#b7c6c280" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution Pie */}
        <div className="bg-white card-brutal rounded-2xl p-5">
          <h3 className="font-heading font-extrabold text-lg mb-4">SEVERITY DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={severity} cx="50%" cy="50%" outerRadius={70} dataKey="value" stroke="#000000" strokeWidth={2}>
                {severity.map((_: unknown, index: number) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700 }} />
              <Legend formatter={(v: string) => <span className="font-bold text-xs">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Bar Chart */}
      <div className="bg-white card-brutal rounded-2xl p-5">
        <h3 className="font-heading font-extrabold text-lg mb-4">REQUESTS BY CATEGORY</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={byCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
            <XAxis dataKey="category" tick={{ fontSize: 11, fontWeight: 700 }} />
            <YAxis tick={{ fontSize: 11, fontWeight: 700 }} />
            <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700 }} />
            <Bar dataKey="requests" fill="#ffe17c" stroke="#000000" strokeWidth={2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Region Hotspot Table */}
      <div className="bg-white card-brutal rounded-2xl overflow-hidden">
        <div className="bg-brand-charcoal px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-yellow border-2 border-brand-yellow rounded-lg flex items-center justify-center font-extrabold text-sm">🔥</div>
          <div>
            <p className="text-white font-heading font-extrabold">TOP PRIORITY HOTSPOTS</p>
            <p className="text-brand-sage text-xs">Highest infrastructure deficit regions</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b-2 border-black bg-brand-sage">
                <th className="text-left px-5 py-3 font-extrabold text-xs uppercase tracking-widest">Region</th>
                <th className="text-left px-5 py-3 font-extrabold text-xs uppercase tracking-widest">Priority Score</th>
                <th className="text-left px-5 py-3 font-extrabold text-xs uppercase tracking-widest">Requests</th>
                <th className="text-left px-5 py-3 font-extrabold text-xs uppercase tracking-widest">Action Level</th>
              </tr>
            </thead>
            <tbody>
              {REGION_HEATMAP.map((r, i) => {
                const isCritical = r.score >= 80;
                const isHigh = r.score >= 70;
                return (
                  <tr key={r.region} className={`border-b border-black/10 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-brand-yellow/20 transition-colors`}>
                    <td className="px-5 py-3 font-bold">{r.region}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-black/10 rounded-full h-2 border border-black/20 max-w-24">
                          <div
                            className={`h-2 rounded-full ${isCritical ? 'bg-red-600' : isHigh ? 'bg-orange-500' : 'bg-brand-yellow'}`}
                            style={{ width: `${r.score}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-xs">{r.score}/100</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold">{r.requests.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 border-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                        isCritical ? 'bg-red-100 border-red-600 text-red-700' :
                        isHigh ? 'bg-orange-100 border-orange-600 text-orange-700' :
                        'bg-brand-yellow border-black text-black'
                      }`}>
                        {isCritical ? 'Immediate' : isHigh ? 'High Priority' : 'Monitor'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
