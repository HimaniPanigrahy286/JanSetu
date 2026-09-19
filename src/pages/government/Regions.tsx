import React, { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import { MapPin, Users, Activity, Wifi, Droplets, Zap, BookOpen, Heart, ChevronDown } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

const INDICATOR_ICONS: Record<string, React.ReactNode> = {
  'Road Coverage': <MapPin size={14} />,
  'Water Access': <Droplets size={14} />,
  'Electricity': <Zap size={14} />,
  'Healthcare': <Heart size={14} />,
  'Education': <BookOpen size={14} />,
  'Digital Connectivity': <Wifi size={14} />,
};

export default function Regions() {
  const regions = analyticsService.getRegions();
  const countries = analyticsService.getCountries();
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedId, setSelectedId] = useState(regions[0].id);

  const filtered = selectedCountry === 'All' ? regions : regions.filter(r => r.country === selectedCountry);
  const selected = regions.find(r => r.id === selectedId) || regions[0];

  const radarData = [
    { subject: 'Roads', value: selected.roadCoverage },
    { subject: 'Water', value: selected.waterAccess },
    { subject: 'Digital', value: selected.digitalConnectivity },
    { subject: 'Healthcare', value: Math.round(selected.healthcareFacilities / 2) },
    { subject: 'Education', value: Math.min(selected.educationFacilities / 5, 100) },
    { subject: 'Investment', value: Math.min(selected.publicInvestment / 5, 100) },
  ];

  const barData = [
    { name: 'Road Coverage', value: selected.roadCoverage, fill: '#3b82f6' },
    { name: 'Water Access', value: selected.waterAccess, fill: '#06b6d4' },
    { name: 'Digital', value: selected.digitalConnectivity, fill: '#6366f1' },
    { name: 'Infra Index', value: selected.infrastructureIndex, fill: '#f97316' },
    { name: 'Citizen Demand', value: selected.citizenDemand, fill: '#ef4444' },
  ];

  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Region Intelligence</h1>
          <p className="text-slate-500 text-sm">Demographic & infrastructure data by region</p>
        </div>
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-400 cursor-pointer"
          >
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Region List */}
        <div className="col-span-1 space-y-2">
          {filtered.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedId(region.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedId === region.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
              }`}
            >
              <p className="font-semibold text-sm truncate">{region.name}</p>
              <p className={`text-xs mt-0.5 ${selectedId === region.id ? 'text-blue-200' : 'text-slate-400'}`}>{region.country}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${selectedId === region.id ? 'bg-blue-500 text-white' : getPriorityColor(region.priorityScore)}`}>
                  {region.priorityScore}
                </span>
                <span className={`text-xs ${selectedId === region.id ? 'text-blue-200' : 'text-slate-400'}`}>{region.requestCount.toLocaleString()} reqs</span>
              </div>
            </button>
          ))}
        </div>

        {/* Region Details */}
        <div className="col-span-3 space-y-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <p className="text-slate-400 text-sm">{selected.country} • Population: {(selected.population / 1000000).toFixed(2)}M</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${getPriorityColor(selected.priorityScore)}`}>
                Priority: {selected.priorityScore}/100
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5">
              {[
                { label: 'Infrastructure Index', value: `${selected.infrastructureIndex}%`, icon: Activity },
                { label: 'Population Density', value: `${selected.populationDensity}/km²`, icon: Users },
                { label: 'Infra Gap', value: `${selected.infrastructureGap}%`, icon: MapPin },
                { label: 'Citizen Demand', value: `${selected.citizenDemand}%`, icon: Activity },
              ].map(item => (
                <div key={item.label} className="bg-white/10 rounded-lg p-3">
                  <item.icon size={16} className="text-blue-300 mb-1" />
                  <p className="text-xl font-bold">{item.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Infrastructure Indicators */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4 text-sm">Infrastructure Indicators</h3>
              <div className="space-y-3">
                {[
                  { label: 'Road Coverage', value: selected.roadCoverage, unit: '%' },
                  { label: 'Water Access', value: selected.waterAccess, unit: '%' },
                  { label: 'Digital Connectivity', value: selected.digitalConnectivity, unit: '%' },
                  { label: 'Healthcare Facilities', value: selected.healthcareFacilities, unit: ' facilities' },
                  { label: 'Education Facilities', value: selected.educationFacilities, unit: ' facilities' },
                  { label: 'Public Investment', value: `₹${(selected.publicInvestment / 10).toFixed(0)}Cr`, unit: '' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>{item.label}</span>
                      <span className="font-semibold">{typeof item.value === 'number' ? item.value : item.value}{item.unit}</span>
                    </div>
                    {typeof item.value === 'number' && item.unit === '%' && (
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.value}%`,
                            background: item.value < 40 ? '#ef4444' : item.value < 60 ? '#f97316' : '#22c55e'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2 text-sm">Multi-dimensional Analysis</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 text-sm">Key Metrics Comparison (% scores)</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
