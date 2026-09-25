import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Smile,
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { useCitizenRequests } from '../../services/requestService';
import { DISTRICTS, DEPARTMENTS } from '../../types';

export default function GovAnalytics() {
  const { requests } = useCitizenRequests();

  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('All');

  // Filter requests based on selection
  const filteredRequests = requests.filter(r => {
    if (departmentFilter !== 'All') {
      const d = (r.department || '').toLowerCase();
      if (!d.includes(departmentFilter.toLowerCase())) return false;
    }
    if (districtFilter !== 'All') {
      const loc = (r.location + ' ' + (r.region || '')).toLowerCase();
      if (!loc.includes(districtFilter.toLowerCase())) return false;
    }
    return true;
  });

  const stats = analyticsService.getOverviewStats(filteredRequests);
  const trendData = analyticsService.getRequestsOverTime(filteredRequests);
  const categoryData = analyticsService.getByCategory(filteredRequests);
  const severityData = analyticsService.getSeverityDistribution(filteredRequests);

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <Activity size={13} className="text-black" />
            Performance & Turnaround Telemetry
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
            GOVERNMENT ANALYTICS & SLA AUDIT
          </h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Quantitative analysis of resolution turnaround times, grievance volume, and department performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none shadow-brutal-sm"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none shadow-brutal-sm"
          >
            <option value="All">All Districts</option>
            {DISTRICTS.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Analytics KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-black/60">Sample Volume</span>
            <span className="text-xs font-mono font-bold bg-brand-yellow px-2 py-0.5 rounded">Live</span>
          </div>
          <p className="font-heading font-extrabold text-3xl mt-2">{filteredRequests.length}</p>
          <p className="text-[10px] font-bold text-black/50 mt-1">Filtered grievances analyzed</p>
        </div>

        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-black/60">SLA Resolution Rate</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <p className="font-heading font-extrabold text-3xl mt-2 text-emerald-800">{stats.serviceLevelRate}%</p>
          <p className="text-[10px] font-bold text-black/50 mt-1">Benchmark target: 75%</p>
        </div>

        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-black/60">High Priority Load</span>
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <p className="font-heading font-extrabold text-3xl mt-2 text-red-600">{stats.highPriorityRequests}</p>
          <p className="text-[10px] font-bold text-black/50 mt-1">Critical & high severity</p>
        </div>

        <div className="bg-white card-brutal rounded-2xl p-5 border-2 border-black">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-black/60">Citizen Satisfaction</span>
            <Smile size={16} className="text-brand-yellow" />
          </div>
          <p className="font-heading font-extrabold text-3xl mt-2">{stats.feedbackRating} / 5.0</p>
          <p className="text-[10px] font-bold text-black/50 mt-1">Post-resolution score</p>
        </div>
      </div>

      {/* Row 2: Inflow Over Time & Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl">GRIEVANCE INFLOW & RESOLUTION TIMELINE</h3>
              <p className="text-xs font-bold text-black/60">Tracking incoming citizen demands against resolution velocity</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
                <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
                <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontWeight: 800 }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="requests" name="Total Inflow" stroke="#000" fill="#00000015" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" name="Resolved Tasks" stroke="#16a34a" fill="#bbf7d080" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white card-brutal-lg rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="font-heading font-extrabold text-xl">SEVERITY MATRIX</h3>
            <p className="text-xs font-bold text-black/60">AI triage classification breakdown</p>
          </div>

          <div className="space-y-4 pt-2">
            {severityData.map(sev => (
              <div key={sev.level} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span>{sev.level} ({sev.count})</span>
                  <span className="font-mono">{sev.percentage}%</span>
                </div>
                <div className="w-full bg-black/10 h-3 rounded-full border border-black/20 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{
                      width: `${sev.percentage}%`,
                      backgroundColor:
                        sev.level === 'Critical'
                          ? '#dc2626'
                          : sev.level === 'High Priority'
                            ? '#ea580c'
                            : sev.level === 'Medium'
                              ? '#eab308'
                              : '#16a34a',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Category Volume Breakdown */}
      <div className="bg-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-4">
        <div>
          <h3 className="font-heading font-extrabold text-xl">DOMAIN VOLUME DISTRIBUTION</h3>
          <p className="text-xs font-bold text-black/60">Comparative demand volume across civic categories</p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} barCategoryGap={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
              <XAxis dataKey="category" tick={{ fontSize: 10, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
              <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
              <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontWeight: 800 }} />
              <Bar dataKey="count" name="Total Grievances" fill="#ffe17c" stroke="#000" strokeWidth={2} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
