import React, { useState } from 'react';
import { MapPin, Filter, ChevronDown, Info, TrendingUp, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { analyticsService } from '../../services/analyticsService';

const SCORE_BREAKDOWN = [
  { label: 'Citizen Demand', weight: 35, color: 'bg-blue-500' },
  { label: 'Infrastructure Gap', weight: 25, color: 'bg-orange-500' },
  { label: 'Population Impact', weight: 20, color: 'bg-red-500' },
  { label: 'Severity Level', weight: 10, color: 'bg-yellow-500' },
  { label: 'Investment Gap', weight: 10, color: 'bg-purple-500' },
];

export default function DemandHotspots() {
  const hotspots = analyticsService.getHotspots();
  const [selectedRegion, setSelectedRegion] = useState(hotspots[0]);
  const [countryFilter, setCountryFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const radarData = [
    { subject: 'Citizen\nDemand', value: selectedRegion.citizenDemand },
    { subject: 'Infra Gap', value: selectedRegion.infrastructureGap },
    { subject: 'Population\nImpact', value: selectedRegion.populationImpact },
    { subject: 'Investment\nGap', value: selectedRegion.investmentGap },
    { subject: 'Requests', value: Math.round(selectedRegion.requestCount / 30) },
  ];

  const getPriorityColor = (score: number) => {
    if (score >= 80) return { text: 'text-red-600', bg: 'bg-red-100', bar: '#dc2626' };
    if (score >= 70) return { text: 'text-orange-600', bg: 'bg-orange-100', bar: '#f97316' };
    if (score >= 60) return { text: 'text-yellow-600', bg: 'bg-yellow-100', bar: '#eab308' };
    return { text: 'text-green-600', bg: 'bg-green-100', bar: '#22c55e' };
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Demand Hotspots</h1>
        <p className="text-slate-500 text-sm">AI-identified high-priority infrastructure deficit zones</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex gap-3 flex-wrap">
        {[
          { label: 'Country', value: countryFilter, onChange: setCountryFilter, options: ['All', 'India', 'Brazil', 'China', 'South Africa'] },
          { label: 'Category', value: categoryFilter, onChange: setCategoryFilter, options: ['All', 'Roads', 'Water', 'Electricity', 'Healthcare', 'Education'] },
        ].map(f => (
          <div key={f.label} className="relative">
            <select
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        ))}
        <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors ml-auto">
          <Filter size={14} />
          Apply Filters
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Hotspot Table */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Region</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Requests</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Infra Gap</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pop. Impact</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Inv. Gap</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotspots.map(region => {
                  const pc = getPriorityColor(region.priorityScore);
                  return (
                    <tr
                      key={region.id}
                      onClick={() => setSelectedRegion(region)}
                      className={`cursor-pointer transition-colors hover:bg-blue-50 ${selectedRegion.id === region.id ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${region.priorityScore >= 80 ? 'bg-red-500' : region.priorityScore >= 70 ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{region.name}</p>
                            <p className="text-xs text-slate-400">{region.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700">{region.requestCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-orange-600">{region.infrastructureGap}%</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700">{region.populationImpact}%</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700">{region.investmentGap}%</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold text-lg ${pc.text}`}>{region.priorityScore}</span>
                        <span className="text-slate-400 text-xs">/100</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Score Breakdown Panel */}
        <div className="space-y-4">
          {/* Selected Region Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800 text-sm">{selectedRegion.name}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center">
                <p className={`text-3xl font-bold ${getPriorityColor(selectedRegion.priorityScore).text}`}>{selectedRegion.priorityScore}</p>
                <p className="text-xs text-slate-500">Priority Score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{selectedRegion.requestCount.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Requests</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b' }} />
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info size={15} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Priority Score Breakdown</h3>
            </div>
            <div className="space-y-2.5">
              {SCORE_BREAKDOWN.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.weight}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className={`h-1.5 ${item.color} rounded-full`} style={{ width: `${item.weight * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-400 italic">
                ⚠️ This is a decision-support indicator. Final decisions remain with authorized officials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
