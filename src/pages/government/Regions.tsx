import { useState } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Globe,
  ArrowRightLeft,
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import CategoryBadge from '../../components/common/CategoryBadge';

export default function Regions() {
  const allRegions = analyticsService.getRegions();
  const countries = analyticsService.getCountries();

  const [selectedCountry, setSelectedCountry] = useState('All');
  const [regionAId, setRegionAId] = useState<string>(allRegions[0].id);
  const [regionBId, setRegionBId] = useState<string>(allRegions[1].id);
  const [compareMode, setCompareMode] = useState(true);

  const filteredRegions = selectedCountry === 'All' ? allRegions : allRegions.filter(r => r.country === selectedCountry);

  const regionA = allRegions.find(r => r.id === regionAId) || allRegions[0];
  const regionB = allRegions.find(r => r.id === regionBId) || allRegions[1];

  const radarCompareData = [
    { subject: 'Roads', regionA: regionA.roadCoverage, regionB: regionB.roadCoverage },
    { subject: 'Water', regionA: regionA.waterAccess, regionB: regionB.waterAccess },
    { subject: 'Digital', regionA: regionA.digitalConnectivity, regionB: regionB.digitalConnectivity },
    { subject: 'Health Index', regionA: Math.min(regionA.healthcareFacilities * 3, 100), regionB: Math.min(regionB.healthcareFacilities * 3, 100) },
    { subject: 'Citizen Demand', regionA: regionA.citizenDemand, regionB: regionB.citizenDemand },
    { subject: 'Infra Index', regionA: regionA.infrastructureIndex, regionB: regionB.infrastructureIndex },
  ];

  const barCompareData = [
    { metric: 'Infra Gap (%)', regionA: regionA.infrastructureGap, regionB: regionB.infrastructureGap },
    { metric: 'Priority Score', regionA: regionA.priorityScore, regionB: regionB.priorityScore },
    { metric: 'Demand (%)', regionA: regionA.citizenDemand, regionB: regionB.citizenDemand },
    { metric: 'Road Paved (%)', regionA: regionA.roadCoverage, regionB: regionB.roadCoverage },
    { metric: 'Water Access (%)', regionA: regionA.waterAccess, regionB: regionB.waterAccess },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <Globe size={13} />
            Cross-Jurisdiction Telemetry
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
            REGION INTELLIGENCE & COMPARISON
          </h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Compare infrastructure deficits, demographic vulnerability, and resolution performance across districts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border-2 transition-all flex items-center gap-1.5 ${
              compareMode ? 'bg-black text-brand-yellow border-black shadow-brutal-sm' : 'bg-white text-black'
            }`}
          >
            <ArrowRightLeft size={14} />
            <span>{compareMode ? 'Comparison Mode Active' : 'Enable Side-by-Side'}</span>
          </button>
        </div>
      </div>

      {/* Region Selectors Header */}
      <div className="bg-white card-brutal rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Region A Selector */}
        <div className="p-4 bg-brand-yellow/30 border-2 border-black rounded-xl space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-black/60">Selected Primary Region</span>
          <select
            value={regionAId}
            onChange={e => setRegionAId(e.target.value)}
            className="w-full bg-white border-2 border-black rounded-xl p-2.5 font-heading font-extrabold text-sm focus:outline-none"
          >
            {allRegions.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.country})
              </option>
            ))}
          </select>
        </div>

        {/* Region B Selector */}
        <div className="p-4 bg-gray-50 border-2 border-black rounded-xl space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-black/60">Comparison Benchmark Region</span>
          <select
            value={regionBId}
            onChange={e => setRegionBId(e.target.value)}
            className="w-full bg-white border-2 border-black rounded-xl p-2.5 font-heading font-extrabold text-sm focus:outline-none"
          >
            {allRegions.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Region A Card */}
        <div className="bg-brand-charcoal text-white card-brutal-lg rounded-3xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/20">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-yellow uppercase">Region A Overview</span>
              <h3 className="font-heading font-extrabold text-2xl text-white mt-0.5">{regionA.name}</h3>
              <p className="text-xs font-bold text-brand-sage">{regionA.country} • {(regionA.population / 1000000).toFixed(2)}M Citizens</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-brand-yellow text-black rounded-lg text-xs font-extrabold">
                Priority: {regionA.priorityScore}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 bg-white/10 border border-white/20 rounded-xl">
              <p className="text-[10px] text-brand-sage uppercase font-bold">Grievances</p>
              <p className="font-heading font-extrabold text-xl text-brand-yellow mt-0.5">{regionA.requestCount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/10 border border-white/20 rounded-xl">
              <p className="text-[10px] text-brand-sage uppercase font-bold">Infra Gap</p>
              <p className="font-heading font-extrabold text-xl text-red-400 mt-0.5">{regionA.infrastructureGap}%</p>
            </div>
            <div className="p-3 bg-white/10 border border-white/20 rounded-xl">
              <p className="text-[10px] text-brand-sage uppercase font-bold">Resolution Rate</p>
              <p className="font-heading font-extrabold text-xl text-emerald-400 mt-0.5">
                {Math.round(((regionA.resolvedCount || 1200) / regionA.requestCount) * 100)}%
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-brand-sage">Top Demanded Category:</span>
              <span className="font-extrabold text-brand-yellow">{regionA.topCategory || 'Roads'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-brand-sage">Population Density:</span>
              <span className="font-extrabold text-white">{regionA.populationDensity} citizens/km²</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-brand-sage">Road Network Coverage:</span>
              <span className="font-extrabold text-white">{regionA.roadCoverage}% paved</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-brand-sage">Clean Drinking Water Access:</span>
              <span className="font-extrabold text-white">{regionA.waterAccess}%</span>
            </div>
          </div>
        </div>

        {/* Region B Card */}
        <div className="bg-white card-brutal-lg rounded-3xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-2 pb-3 border-b-2 border-black/10">
            <div>
              <span className="text-[10px] font-mono font-bold text-black/60 uppercase">Region B Benchmark</span>
              <h3 className="font-heading font-extrabold text-2xl text-black mt-0.5">{regionB.name}</h3>
              <p className="text-xs font-bold text-black/60">{regionB.country} • {(regionB.population / 1000000).toFixed(2)}M Citizens</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-black text-white rounded-lg text-xs font-extrabold">
                Priority: {regionB.priorityScore}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 bg-gray-50 border-2 border-black/20 rounded-xl">
              <p className="text-[10px] text-black/60 uppercase font-bold">Grievances</p>
              <p className="font-heading font-extrabold text-xl text-black mt-0.5">{regionB.requestCount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-50 border-2 border-black/20 rounded-xl">
              <p className="text-[10px] text-black/60 uppercase font-bold">Infra Gap</p>
              <p className="font-heading font-extrabold text-xl text-orange-600 mt-0.5">{regionB.infrastructureGap}%</p>
            </div>
            <div className="p-3 bg-gray-50 border-2 border-black/20 rounded-xl">
              <p className="text-[10px] text-black/60 uppercase font-bold">Resolution Rate</p>
              <p className="font-heading font-extrabold text-xl text-emerald-700 mt-0.5">
                {Math.round(((regionB.resolvedCount || 1100) / regionB.requestCount) * 100)}%
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-black/60">Top Demanded Category:</span>
              <span className="font-extrabold text-black">{regionB.topCategory || 'Water'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-black/60">Population Density:</span>
              <span className="font-extrabold text-black">{regionB.populationDensity} citizens/km²</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-black/60">Road Network Coverage:</span>
              <span className="font-extrabold text-black">{regionB.roadCoverage}% paved</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-black/60">Clean Drinking Water Access:</span>
              <span className="font-extrabold text-black">{regionB.waterAccess}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Charts (Radar & Bar Comparison) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Comparison Chart */}
        <div className="bg-white card-brutal rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl">MULTI-SECTOR RADAR COMPARISON</h3>
              <p className="text-xs font-bold text-black/60">Comparing indices across infrastructure pillars</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-extrabold">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-brand-yellow border border-black rounded-sm" /> {regionA.name.split(' ')[0]}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-black border border-black rounded-sm" /> {regionB.name.split(' ')[0]}</span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarCompareData}>
                <PolarGrid stroke="#000000" strokeOpacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#000000' }} />
                <Radar name={regionA.name} dataKey="regionA" stroke="#000000" strokeWidth={2} fill="#ffe17c" fillOpacity={0.7} />
                <Radar name={regionB.name} dataKey="regionB" stroke="#000000" strokeWidth={2} fill="#000000" fillOpacity={0.3} />
                <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontWeight: 700, boxShadow: '4px 4px 0px #000' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Comparison Chart */}
        <div className="bg-white card-brutal rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl">KEY METRICS BENCHMARK</h3>
              <p className="text-xs font-bold text-black/60">Gaps vs priority score index</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barCompareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
                <XAxis dataKey="metric" tick={{ fontSize: 10, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontWeight: 700, boxShadow: '4px 4px 0px #000' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="regionA" name={regionA.name} fill="#ffe17c" stroke="#000000" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                <Bar dataKey="regionB" name={regionB.name} fill="#000000" stroke="#000000" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comprehensive Region Table */}
      <div className="bg-white card-brutal-lg rounded-3xl overflow-hidden border-2 border-black">
        <div className="p-5 bg-brand-yellow/30 border-b-2 border-black flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-extrabold text-xl">ALL JURISDICTIONS TABLE</h3>
            <p className="text-xs font-bold text-black/60">Comparative breakdown across all monitored territories</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
            >
              <option value="All">All BRICS Countries</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="font-mono text-xs font-bold bg-white px-3 py-1.5 border border-black rounded-lg">
              {filteredRegions.length} Regions
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black text-black">
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4 text-right">Population</th>
                <th className="py-3 px-4 text-right">Total Grievances</th>
                <th className="py-3 px-4 text-right">Infra Deficit</th>
                <th className="py-3 px-4 text-center">Top Category</th>
                <th className="py-3 px-4 text-right">Priority Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredRegions.map(r => (
                <tr key={r.id} className="hover:bg-brand-yellow/15 transition-colors">
                  <td className="py-3.5 px-4 font-heading font-extrabold text-sm text-black">{r.name}</td>
                  <td className="py-3.5 px-4 text-black/70">{r.country}</td>
                  <td className="py-3.5 px-4 text-right font-mono">{(r.population / 1000000).toFixed(2)}M</td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-black">
                    {r.requestCount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-red-600 font-extrabold">
                    {r.infrastructureGap}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <CategoryBadge category={r.topCategory || 'Roads'} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-black">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg border ${
                        r.priorityScore >= 80
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : r.priorityScore >= 70
                            ? 'bg-brand-yellow border-black text-black'
                            : 'bg-gray-100 border-black/30 text-black'
                      }`}
                    >
                      {r.priorityScore} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
