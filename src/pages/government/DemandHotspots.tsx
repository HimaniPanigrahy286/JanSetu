import React, { useState } from 'react';
import { MapPin, Filter, ChevronDown, Info } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { analyticsService } from '../../services/analyticsService';

const SCORE_BREAKDOWN = [
  { label: 'Citizen Demand', weight: 35, color: 'bg-brand-yellow' },
  { label: 'Infrastructure Gap', weight: 25, color: 'bg-brand-sage' },
  { label: 'Population Impact', weight: 20, color: 'bg-black' },
  { label: 'Severity Level', weight: 10, color: 'bg-red-500' },
  { label: 'Investment Gap', weight: 10, color: 'bg-orange-500' },
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
    if (score >= 80) return { text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-600', bar: 'bg-red-600' };
    if (score >= 70) return { text: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-600', bar: 'bg-orange-500' };
    if (score >= 60) return { text: 'text-black', bg: 'bg-brand-yellow', border: 'border-black', bar: 'bg-brand-yellow' };
    return { text: 'text-black', bg: 'bg-brand-sage', border: 'border-black', bar: 'bg-brand-sage' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6">
        <h1 className="font-heading font-extrabold text-3xl">DEMAND HOTSPOTS</h1>
        <p className="font-medium text-sm mt-1 text-black/70">AI-identified high-priority infrastructure deficit zones</p>
      </div>

      {/* Filters */}
      <div className="bg-white card-brutal rounded-2xl p-4 flex gap-3 flex-wrap">
        {[
          { label: 'Country', value: countryFilter, onChange: setCountryFilter, options: ['All', 'India', 'Brazil', 'China', 'South Africa'] },
          { label: 'Category', value: categoryFilter, onChange: setCategoryFilter, options: ['All', 'Roads', 'Water', 'Electricity', 'Healthcare', 'Education'] },
        ].map(f => (
          <div key={f.label} className="relative">
            <select
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              className="appearance-none bg-white border-2 border-black rounded-xl px-4 py-2.5 pr-10 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
          </div>
        ))}
        <button className="btn-brutal-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm ml-auto">
          <Filter size={16} />
          Apply Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hotspot Table */}
        <div className="lg:col-span-2 bg-white card-brutal rounded-2xl overflow-hidden">
          <div className="bg-brand-charcoal px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-yellow border-2 border-brand-yellow rounded-lg flex items-center justify-center font-extrabold text-sm">🗺️</div>
            <div>
              <p className="text-white font-heading font-extrabold">REGION ANALYSIS</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b-2 border-black bg-brand-sage">
                  <th className="text-left px-5 py-3 font-extrabold text-xs uppercase tracking-widest">Region</th>
                  <th className="text-right px-5 py-3 font-extrabold text-xs uppercase tracking-widest">Requests</th>
                  <th className="text-right px-5 py-3 font-extrabold text-xs uppercase tracking-widest">Infra Gap</th>
                  <th className="text-right px-5 py-3 font-extrabold text-xs uppercase tracking-widest">Priority</th>
                </tr>
              </thead>
              <tbody>
                {hotspots.map((region, i) => {
                  const pc = getPriorityColor(region.priorityScore);
                  const isSelected = selectedRegion.id === region.id;
                  return (
                    <tr
                      key={region.id}
                      onClick={() => setSelectedRegion(region)}
                      className={`cursor-pointer border-b border-black/10 transition-colors ${
                        isSelected ? 'bg-black text-white' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } ${!isSelected && 'hover:bg-brand-yellow/20'}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 border-2 border-black rounded-full ${pc.bar}`} />
                          <div>
                            <p className={`font-bold ${isSelected ? 'text-brand-yellow' : 'text-black'}`}>{region.name}</p>
                            <p className={`text-xs font-medium ${isSelected ? 'text-white/60' : 'text-black/50'}`}>{region.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-5 py-4 text-right font-bold ${isSelected ? 'text-white' : 'text-black'}`}>
                        {region.requestCount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-orange-600">{region.infrastructureGap}%</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`px-2.5 py-1 border-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                          isSelected ? 'bg-white border-white text-black' : `${pc.bg} ${pc.border} ${pc.text}`
                        }`}>
                          {region.priorityScore}/100
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Score Breakdown Panel */}
        <div className="space-y-5">
          {/* Selected Region Details */}
          <div className="bg-white card-brutal rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-sage border-2 border-black rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-black" />
              </div>
              <h3 className="font-heading font-extrabold text-xl">{selectedRegion.name}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 border-2 border-black rounded-xl bg-brand-yellow">
                <p className="text-3xl font-heading font-extrabold">{selectedRegion.priorityScore}</p>
                <p className="font-bold text-xs uppercase tracking-widest mt-1">Priority</p>
              </div>
              <div className="text-center p-3 border-2 border-black rounded-xl bg-black text-white">
                <p className="text-3xl font-heading font-extrabold text-brand-yellow">{selectedRegion.requestCount.toLocaleString()}</p>
                <p className="font-bold text-xs uppercase tracking-widest mt-1">Requests</p>
              </div>
            </div>
            <div className="border-2 border-black rounded-xl overflow-hidden pt-2 bg-gray-50">
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#000000" strokeOpacity={0.2} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#000000' }} />
                  <Radar dataKey="value" stroke="#000000" strokeWidth={2} fill="#ffe17c" fillOpacity={0.8} />
                  <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700, backgroundColor: '#fff' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white card-brutal rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-brand-yellow border-2 border-black rounded-lg flex items-center justify-center">
                <Info size={16} className="text-black" />
              </div>
              <h3 className="font-heading font-extrabold text-lg uppercase">Score Breakdown</h3>
            </div>
            <div className="space-y-4">
              {SCORE_BREAKDOWN.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between font-bold text-xs uppercase tracking-wider mb-1.5">
                    <span>{item.label}</span>
                    <span>{item.weight}%</span>
                  </div>
                  <div className="h-2.5 bg-black/10 border border-black/20 rounded-full">
                    <div className={`h-full ${item.color} rounded-full border-r border-black`} style={{ width: `${item.weight * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t-2 border-black/10">
              <p className="font-medium text-xs text-black/60 leading-relaxed">
                <span className="font-extrabold text-black uppercase tracking-wider">Note:</span> This is a decision-support indicator. Final decisions remain with authorized officials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

