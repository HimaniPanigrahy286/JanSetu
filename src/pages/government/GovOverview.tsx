import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Clock,
  RefreshCw,
  CheckCircle2,
  Smile,
  ChevronDown,
  ArrowRight,
  Flame,
  Eye,
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { requestService } from '../../services/requestService';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import type { CitizenRequest } from '../../types';

export default function GovOverview() {
  const [timeRange, setTimeRange] = useState('Sep 2026');
  const [selectedReq, setSelectedReq] = useState<CitizenRequest | null>(null);

  const stats = analyticsService.getOverviewStats();
  const trendData = analyticsService.getRequestsOverTime();
  const categoryData = analyticsService.getByCategory();
  const allRequests = requestService.getAll();
  const recentComplaints = allRequests.slice(0, 5);
  const hotspots = analyticsService.getHotspots();

  return (
    <div className="space-y-6">
      {/* Page Title & Time Range Filter */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            MP Intelligence & Decision Support
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
            GOVERNMENT OVERVIEW INTELLIGENCE
          </h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Aggregated citizen demand telemetry, service-level compliance, and hotspot prioritization.
          </p>
        </div>

        {/* Date Filter */}
        <div className="relative self-start md:self-auto">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="appearance-none bg-white border-2 border-black rounded-xl px-4 py-2.5 pr-10 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-brutal-sm"
          >
            <option value="Sep 2026">Sep 01 - Sep 30, 2026</option>
            <option value="Q3 2026">Q3 (Jul - Sep 2026)</option>
            <option value="YTD 2026">Year to Date (2026)</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
        </div>
      </div>

      {/* Row 1: KPI Stats (Matching Reference Dashboard Structure & Layout) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Pending */}
        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-brand-yellow border-2 border-black rounded-xl flex items-center justify-center">
              <Clock size={18} className="text-black" />
            </div>
            <span className="text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-500 px-2 py-0.5 rounded">
              +70%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-extrabold text-black/60 uppercase tracking-wider">Pending Grievances</p>
            <p className="font-heading font-extrabold text-3xl md:text-4xl text-black mt-1">
              {stats.pendingRequests.toLocaleString()}
            </p>
            <p className="text-[10px] font-bold text-black/50 mt-1">Last 7 days backlog</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-brand-sage border-2 border-black rounded-xl flex items-center justify-center">
              <RefreshCw size={18} className="text-black" />
            </div>
            <span className="text-[10px] font-extrabold bg-brand-yellow text-black border border-black px-2 py-0.5 rounded">
              +20%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-extrabold text-black/60 uppercase tracking-wider">In Progress</p>
            <p className="font-heading font-extrabold text-3xl md:text-4xl text-black mt-1">
              {stats.inProgressRequests.toLocaleString()}
            </p>
            <p className="text-[10px] font-bold text-black/50 mt-1">Contractor work orders</p>
          </div>
        </div>

        {/* Solved / Resolved */}
        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-emerald-400 border-2 border-black rounded-xl flex items-center justify-center">
              <CheckCircle2 size={18} className="text-black" />
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-500 px-2 py-0.5 rounded">
              +12%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-extrabold text-black/60 uppercase tracking-wider">Resolved</p>
            <p className="font-heading font-extrabold text-3xl md:text-4xl text-emerald-800 mt-1">
              {stats.resolvedRequests.toLocaleString()}
            </p>
            <p className="text-[10px] font-bold text-black/50 mt-1">Verified on ground</p>
          </div>
        </div>

        {/* Service Level SLA Ring Indicator (Inspired by reference screenshot) */}
        <div className="bg-brand-charcoal text-white card-brutal rounded-2xl p-5 border-2 border-black flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="relative flex items-center justify-center w-20 h-20">
            {/* Circular Progress Ring */}
            <svg className="w-20 h-20 transform -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="#ffffff20" strokeWidth="6" fill="transparent" />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="#ffe17c"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={200}
                strokeDashoffset={200 - (200 * stats.serviceLevelRate) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute font-heading font-extrabold text-base text-brand-yellow">
              {stats.serviceLevelRate}%
            </span>
          </div>
          <p className="font-heading font-extrabold text-xs text-white uppercase tracking-wider mt-2">Service Level SLA</p>
          <p className="text-[10px] font-bold text-brand-sage">Target: 75% Benchmark</p>
        </div>

        {/* Feedback Rating */}
        <div className="bg-brand-yellow text-black card-brutal rounded-2xl p-5 border-2 border-black flex flex-col items-center justify-center text-center">
          <div className="w-11 h-11 bg-black text-brand-yellow border-2 border-black rounded-full flex items-center justify-center shadow-brutal-sm mb-1">
            <Smile size={24} />
          </div>
          <p className="font-heading font-extrabold text-3xl md:text-4xl leading-tight">{stats.feedbackRating}</p>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/70">
            Citizen Satisfaction (out of 5)
          </p>
        </div>
      </div>

      {/* Row 2: Total Complaints Trend Chart (Inspired by reference line chart) */}
      <div className="bg-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-extrabold text-2xl">TOTAL CITIZEN GRIEVANCE TREND</h3>
            <p className="text-xs font-bold text-black/60 mt-0.5">
              Monthly inflow: Total Logged vs. In Progress vs. Resolved
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-extrabold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-black border border-black rounded" />
              <span>Total Submitted (2,140)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-brand-yellow border border-black rounded" />
              <span>Resolved (920)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-brand-sage border border-black rounded" />
              <span>In Progress (940)</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
              <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: '12px',
                  fontWeight: 800,
                  boxShadow: '4px 4px 0px #000000',
                }}
              />
              <Area type="monotone" dataKey="requests" name="Total Logged" stroke="#000000" strokeWidth={2.5} fill="#00000015" />
              <Area type="monotone" dataKey="inProgress" name="In Progress" stroke="#272727" strokeWidth={2} fill="#b7c6c280" />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#000000" strokeWidth={2} fill="#ffe17c" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Recent Complaints Table + Complaints in Category (Inspired by Reference Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints Table (2 cols) */}
        <div className="lg:col-span-2 bg-white card-brutal-lg rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl">RECENT CITIZEN COMPLAINTS</h3>
              <p className="text-xs font-bold text-black/60">Live triage queue across Odisha districts</p>
            </div>
            <Link
              to="/government/requests"
              className="btn-brutal-secondary px-3.5 py-1.5 text-xs font-extrabold rounded-xl inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b-2 border-black bg-brand-yellow/30 text-black">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Citizen</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Region</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {recentComplaints.map(req => (
                  <tr key={req.id} className="hover:bg-brand-yellow/10 transition-colors">
                    <td className="py-3 px-3 font-mono text-black/70">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="py-3 px-3 text-black">{req.userName || 'Priya S.'}</td>
                    <td className="py-3 px-3">
                      <CategoryBadge category={req.category} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-black/70">{req.location.split(',')[0]}</td>
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
          </div>
        </div>

        {/* Complaints in Category (Inspired by Reference Screenshot Progress Bars) */}
        <div className="bg-white card-brutal-lg rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="font-heading font-extrabold text-xl">COMPLAINTS IN CATEGORY</h3>
            <p className="text-xs font-bold text-black/60">Relative concentration of demand</p>
          </div>

          <div className="space-y-3.5">
            {categoryData.slice(0, 6).map(cat => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="truncate">{cat.category}</span>
                  <span className="font-mono text-black">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-black/10 h-3 rounded-full border border-black/20 overflow-hidden">
                  <div
                    className="h-full bg-black border-r border-black rounded-full"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor:
                        cat.category === 'Roads'
                          ? '#000000'
                          : cat.category === 'Water'
                            ? '#ffe17c'
                            : cat.category === 'Drainage'
                              ? '#b7c6c2'
                              : '#272727',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/government/hotspots"
            className="btn-brutal-primary w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 mt-4"
          >
            <Flame size={14} />
            <span>Inspect Demand Hotspots &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Row 4: Top Demand Hotspots Preview */}
      <div className="bg-brand-charcoal text-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-yellow text-black border-2 border-brand-yellow rounded-xl flex items-center justify-center font-heading font-extrabold">
              🔥
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-brand-yellow">TOP INFRASTRUCTURE DEMAND HOTSPOTS</h3>
              <p className="text-xs font-bold text-brand-sage">AI Clustered problem zones requiring capital intervention</p>
            </div>
          </div>
          <Link
            to="/government/hotspots"
            className="btn-brutal-secondary bg-white text-black px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5"
          >
            <span>Interactive Map &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotspots.slice(0, 3).map((h, i) => (
            <div
              key={h.id}
              className="p-4 bg-white/10 border-2 border-white/20 rounded-2xl space-y-3 hover:border-brand-yellow transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] font-extrabold bg-brand-yellow text-black px-2 py-0.5 rounded">
                  HOTSPOT #{i + 1}
                </span>
                <PriorityBadge priority={h.priority} size="sm" />
              </div>

              <div>
                <h4 className="font-heading font-extrabold text-base text-white">{h.region}</h4>
                <p className="text-xs font-bold text-brand-sage mt-0.5">{h.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <p className="text-[10px] text-brand-sage uppercase">Requests</p>
                  <p className="font-heading font-extrabold text-lg text-brand-yellow">{h.requestCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-brand-sage uppercase">Citizens</p>
                  <p className="font-heading font-extrabold text-lg text-white">{(h.affectedPopulation / 1000).toFixed(1)}k</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Modal View */}
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

            <div className="p-3 bg-brand-yellow/30 border-2 border-black rounded-xl text-xs space-y-1">
              <p className="font-extrabold text-black">AI Assessment Summary:</p>
              <p className="font-medium text-black/80">{selectedReq.aiAnalysis.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="p-2.5 bg-gray-50 border rounded-xl">
                <span className="text-black/60 block text-[10px]">Location</span>
                <span className="text-black truncate block">{selectedReq.location}</span>
              </div>
              <div className="p-2.5 bg-gray-50 border rounded-xl">
                <span className="text-black/60 block text-[10px]">Severity</span>
                <span className="text-black block capitalize">{selectedReq.aiAnalysis.severity}</span>
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
                to={`/government/requests`}
                className="btn-brutal-primary flex-1 py-2.5 rounded-xl text-xs font-extrabold text-center"
              >
                Manage in Requests &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
