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
    { name: 'Road Coverage', value: selected.roadCoverage, fill: '#000000' },
    { name: 'Water Access', value: selected.waterAccess, fill: '#b7c6c2' },
    { name: 'Digital', value: selected.digitalConnectivity, fill: '#ffe17c' },
    { name: 'Infra Index', value: selected.infrastructureIndex, fill: '#272727' },
    { name: 'Citizen Demand', value: selected.citizenDemand, fill: '#000000' },
  ];

  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'text-red-700 bg-red-100 border-red-600';
    if (score >= 70) return 'text-orange-700 bg-orange-100 border-orange-600';
    if (score >= 60) return 'text-black bg-brand-yellow border-black';
    return 'text-black bg-brand-sage border-black';
  };

  return (
    <div className="space-y-6">
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl">REGION INTELLIGENCE</h1>
          <p className="font-medium text-sm mt-1 text-black/70">Demographic & infrastructure data by region</p>
        </div>
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={e => {
              setSelectedCountry(e.target.value);
              const newFiltered = e.target.value === 'All' ? regions : regions.filter(r => r.country === e.target.value);
              if (newFiltered.length > 0) setSelectedId(newFiltered[0].id);
            }}
            className="appearance-none bg-white border-2 border-black rounded-xl px-4 py-2.5 pr-10 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-brutal-sm"
          >
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Region List */}
        <div className="lg:col-span-1 space-y-3 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin">
          {filtered.map(region => {
            const isSelected = selectedId === region.id;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedId(region.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-black border-black text-white shadow-brutal-sm'
                    : 'bg-white border-black/30 hover:border-black text-black hover:bg-brand-yellow/20'
                }`}
              >
                <p className="font-heading font-extrabold text-lg truncate">{region.name}</p>
                <p className={`text-xs font-bold mt-0.5 ${isSelected ? 'text-brand-yellow' : 'text-black/50'}`}>{region.country}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] px-2 py-1 rounded-lg font-extrabold uppercase border-2 ${
                    isSelected ? 'bg-white text-black border-white' : getPriorityColor(region.priorityScore)
                  }`}>
                    Score: {region.priorityScore}
                  </span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-white/70' : 'text-black/50'}`}>
                    {region.requestCount.toLocaleString()} reqs
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Region Details */}
        <div className="lg:col-span-3 space-y-5">
          {/* Header */}
          <div className="bg-brand-charcoal card-brutal-lg rounded-2xl p-6 text-white border-black">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-3xl text-brand-yellow">{selected.name}</h2>
                <p className="font-bold text-sm text-brand-sage mt-1">{selected.country} &bull; Population: {(selected.population / 1000000).toFixed(2)}M</p>
              </div>
              <div className={`px-4 py-2 border-2 rounded-xl text-sm font-extrabold uppercase tracking-widest ${getPriorityColor(selected.priorityScore)}`}>
                Priority Score: {selected.priorityScore}/100
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Infrastructure Index', value: `${selected.infrastructureIndex}%`, icon: Activity },
                { label: 'Population Density', value: `${selected.populationDensity}/km²`, icon: Users },
                { label: 'Infra Gap', value: `${selected.infrastructureGap}%`, icon: MapPin },
                { label: 'Citizen Demand', value: `${selected.citizenDemand}%`, icon: Activity },
              ].map(item => (
                <div key={item.label} className="bg-white/10 border-2 border-white/20 rounded-xl p-4">
                  <item.icon size={20} className="text-brand-yellow mb-2" />
                  <p className="font-heading font-extrabold text-2xl">{item.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-sage mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Infrastructure Indicators */}
            <div className="bg-white card-brutal rounded-2xl p-5">
              <h3 className="font-heading font-extrabold text-xl mb-5 uppercase">Infrastructure Indicators</h3>
              <div className="space-y-4">
                {[
                  { label: 'Road Coverage', value: selected.roadCoverage, unit: '%' },
                  { label: 'Water Access', value: selected.waterAccess, unit: '%' },
                  { label: 'Digital Connectivity', value: selected.digitalConnectivity, unit: '%' },
                  { label: 'Healthcare Facilities', value: selected.healthcareFacilities, unit: ' facilities' },
                  { label: 'Education Facilities', value: selected.educationFacilities, unit: ' facilities' },
                  { label: 'Public Investment', value: `₹${(selected.publicInvestment / 10).toFixed(0)}Cr`, unit: '' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between font-bold text-xs uppercase tracking-wider mb-1.5 text-black">
                      <span>{item.label}</span>
                      <span>{typeof item.value === 'number' ? item.value : item.value}{item.unit}</span>
                    </div>
                    {typeof item.value === 'number' && item.unit === '%' && (
                      <div className="h-2.5 bg-black/10 border border-black/20 rounded-full">
                        <div
                          className="h-full rounded-full border-r border-black"
                          style={{
                            width: `${item.value}%`,
                            background: item.value < 40 ? '#ef4444' : item.value < 60 ? '#f97316' : '#ffe17c'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-white card-brutal rounded-2xl p-5">
              <h3 className="font-heading font-extrabold text-xl mb-4 uppercase">Multi-dimensional Analysis</h3>
              <div className="border-2 border-black rounded-xl overflow-hidden pt-2 bg-gray-50">
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#000000" strokeOpacity={0.2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#000000' }} />
                    <Radar dataKey="value" stroke="#000000" strokeWidth={2} fill="#ffe17c" fillOpacity={0.8} />
                    <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700, backgroundColor: '#fff' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white card-brutal rounded-2xl p-5">
            <h3 className="font-heading font-extrabold text-xl mb-5 uppercase">Key Metrics Comparison (% scores)</h3>
            <div className="border-2 border-black rounded-xl overflow-hidden pt-4 bg-gray-50 px-2">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#000' }} axisLine={{ stroke: '#000' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#000' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700 }} cursor={{ fill: '#00000010' }} />
                  <Bar dataKey="value" stroke="#000000" strokeWidth={2} radius={[4, 4, 0, 0]}>
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
    </div>
  );
}
