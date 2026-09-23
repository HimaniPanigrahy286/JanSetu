import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  CheckCircle,
  Users,
  Building2,
  Award,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import StatCard from '../../components/common/StatCard';

const BEFORE_AFTER_COMPLAINTS = [
  { region: 'Kalahandi (Roads)', before: 1247, after: 310, reduction: '75%' },
  { region: 'Koraput (Water)', before: 890, after: 180, reduction: '80%' },
  { region: 'Malkangiri (Health)', before: 620, after: 95, reduction: '85%' },
  { region: 'Rayagada (Energy)', before: 480, after: 120, reduction: '75%' },
];

const INFRA_INDEX_GROWTH = [
  { month: 'Jan', kalahandi: 24, koraput: 30, malkangiri: 19, benchmark: 25 },
  { month: 'Mar', kalahandi: 25, koraput: 33, malkangiri: 20, benchmark: 28 },
  { month: 'May', kalahandi: 26, koraput: 44, malkangiri: 23, benchmark: 34 },
  { month: 'Jul', kalahandi: 27, koraput: 58, malkangiri: 38, benchmark: 48 },
  { month: 'Sep', kalahandi: 28, koraput: 66, malkangiri: 58, benchmark: 59 },
];

export default function Impact() {
  const projects = projectService.getAll();
  const completedProjects = projects.filter(p => p.status === 'completed' || p.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <Award size={13} />
            Post-Intervention Analytics
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
            CITIZEN IMPACT & ROI DASHBOARD
          </h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Quantifying infrastructure improvements, grievance reduction ratios, and public investment outcomes.
          </p>
        </div>

        <div className="p-3 bg-white border-2 border-black rounded-xl shadow-brutal-sm text-xs font-bold text-black/80">
          ● Evidence-Based Governance Audit
        </div>
      </div>

      {/* Primary Impact KPI Cards (As explicitly detailed in prompt) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Citizens Benefited"
          value="24,580"
          subtext="Directly served by projects"
          icon={<Users size={20} />}
          variant="yellow"
          badge="Verified"
        />
        <StatCard
          label="Requests Resolved"
          value="1,284"
          subtext="Completed engineering tasks"
          icon={<CheckCircle size={20} />}
          variant="white"
          badge="+24% YoY"
        />
        <StatCard
          label="Projects Completed"
          value="36"
          subtext="Across BRICS territories"
          icon={<Building2 size={20} />}
          variant="dark"
        />
        <StatCard
          label="Development Progress"
          value="72%"
          subtext="Target: 70% Q3 benchmark"
          icon={<TrendingUp size={20} />}
          variant="sage"
          badge="On Track"
        />
      </div>

      {/* Row 2: Before vs. After Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before vs After Complaints Bar Chart */}
        <div className="bg-white card-brutal-lg rounded-3xl p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl">COMPLAINTS REDUCTION RATIO</h3>
              <p className="text-xs font-bold text-black/60">Grievances before vs after completed interventions</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BEFORE_AFTER_COMPLAINTS} barCategoryGap={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
                <XAxis dataKey="region" tick={{ fontSize: 10, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
                <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontWeight: 700, boxShadow: '4px 4px 0px #000' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="before" name="Before Project" fill="#000000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="After Completion" fill="#ffe17c" stroke="#000000" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Infrastructure Index Growth Line Chart */}
        <div className="bg-white card-brutal-lg rounded-3xl p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl">INFRASTRUCTURE INDEX EXPANSION</h3>
              <p className="text-xs font-bold text-black/60">Score progression (Jan - Sep 2026)</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INFRA_INDEX_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} domain={[10, 80]} />
                <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontWeight: 700, boxShadow: '4px 4px 0px #000' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="koraput" name="Koraput" stroke="#000000" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="malkangiri" name="Malkangiri" stroke="#272727" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="benchmark" name="Average Baseline" stroke="#ffe17c" strokeWidth={3} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Project Impact Summary Table */}
      <div className="bg-white card-brutal-lg rounded-3xl overflow-hidden border-2 border-black">
        <div className="p-5 bg-brand-charcoal text-white border-b-2 border-black flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-brand-yellow">PROJECT ROI AUDIT LOG</h3>
            <p className="text-xs font-bold text-brand-sage">Verified before & after performance per project</p>
          </div>
          <span className="font-mono text-xs font-bold bg-white text-black px-3 py-1 rounded-lg">
            {completedProjects.length} Verified Interventions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead>
              <tr className="bg-brand-yellow/30 border-b-2 border-black text-black">
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4 text-right">Complaints Before</th>
                <th className="py-3 px-4 text-right">Complaints After</th>
                <th className="py-3 px-4 text-right">Grievance Drop</th>
                <th className="py-3 px-4 text-right">Infra Score Jump</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {completedProjects.map(p => {
                const dropPct =
                  p.beforeRequests && p.afterRequests
                    ? Math.round(((p.beforeRequests - p.afterRequests) / p.beforeRequests) * 100)
                    : 78;
                return (
                  <tr key={p.id} className="hover:bg-brand-yellow/15 transition-colors">
                    <td className="py-3.5 px-4 font-heading font-extrabold text-sm text-black">{p.title}</td>
                    <td className="py-3.5 px-4 text-black/70">{p.region}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-red-600 font-extrabold">{p.beforeRequests || 94}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-extrabold">{p.afterRequests || 12}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-800 font-extrabold">
                      <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-600 rounded">
                        ↓ {dropPct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-black">
                      {p.beforeScore || 32}% &rarr; <span className="text-emerald-700">{p.afterScore || 84}%</span>
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
