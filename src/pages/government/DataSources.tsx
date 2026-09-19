import React from 'react';
import { Database, Users, BarChart2, Building, DollarSign, RefreshCw, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { MOCK_DATA_SOURCES } from '../../data/mockData';

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  'users': <Users size={24} className="text-blue-600" />,
  'bar-chart': <BarChart2 size={24} className="text-purple-600" />,
  'building': <Building size={24} className="text-orange-600" />,
  'dollar-sign': <DollarSign size={24} className="text-green-600" />,
};

const SOURCE_COLORS = [
  { border: 'border-blue-200', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  { border: 'border-purple-200', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
  { border: 'border-orange-200', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  { border: 'border-green-200', bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' },
];

const PIPELINE_STEPS = [
  { label: 'Data Collection', desc: 'Citizen requests, voice inputs, field surveys, government databases', color: 'bg-blue-600' },
  { label: 'AI Processing', desc: 'Language detection, translation, NLP classification, severity analysis', color: 'bg-indigo-600' },
  { label: 'Data Integration', desc: 'Merging citizen feedback with demographic and infrastructure data', color: 'bg-purple-600' },
  { label: 'Priority Scoring', desc: 'Weighted multi-factor priority score computation per region', color: 'bg-orange-600' },
  { label: 'Insight Generation', desc: 'AI recommendations, hotspot detection, trend analysis', color: 'bg-green-600' },
];

export default function DataSources() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Database size={24} className="text-blue-600" />
          Data Sources
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">How NexGen Governance collects and combines data to generate infrastructure insights</p>
      </div>

      {/* How It Works Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-bold mb-2">Data Intelligence Pipeline</h2>
        <p className="text-blue-200 text-sm mb-6">
          NexGen Governance combines multiple data sources using AI to generate actionable infrastructure insights for government officials.
        </p>
        <div className="flex items-center gap-0 overflow-x-auto">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {i + 1}
                </div>
                <div className="mt-2 text-center max-w-24">
                  <p className="text-xs font-semibold text-white leading-tight">{step.label}</p>
                  <p className="text-xs text-blue-300 mt-0.5 leading-tight hidden xl:block">{step.desc}</p>
                </div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <ArrowRight size={20} className="text-blue-300 mx-3 shrink-0 mb-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Cards */}
      <div className="grid grid-cols-2 gap-4">
        {MOCK_DATA_SOURCES.map((source, i) => {
          const color = SOURCE_COLORS[i] || SOURCE_COLORS[0];
          return (
            <div key={source.id} className={`bg-white rounded-xl border-2 ${color.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  {SOURCE_ICONS[source.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-slate-800">{source.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color.badge}`}>
                      {source.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{source.description}</p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={13} className="text-green-500" />
                      <span className="text-xs text-slate-600">{source.recordCount.toLocaleString()} records</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RefreshCw size={13} className="text-blue-500" />
                      <span className="text-xs text-slate-600">Updated {source.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How Data Combines */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-lg mb-2">How Data Sources Combine</h3>
        <p className="text-slate-500 text-sm mb-6">
          These four data sources are fused through the NexGen AI pipeline to produce comprehensive infrastructure gap analysis and prioritized investment recommendations.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              title: 'Priority Score',
              desc: 'Weighted average of citizen demand (35%), infrastructure gap (25%), population impact (20%), severity (10%), and investment gap (10%).',
              icon: '📊',
            },
            {
              title: 'AI Recommendations',
              desc: 'Natural language recommendations generated from pattern recognition across all data sources, validated against historical outcomes.',
              icon: '🤖',
            },
            {
              title: 'Demand Hotspots',
              desc: 'Geographic clusters of high citizen demand co-located with infrastructure deficits and low investment, ranked by composite score.',
              icon: '🗺️',
            },
          ].map(item => (
            <div key={item.title} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h4 className="font-semibold text-slate-800 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong>⚠️ Demo Platform Disclaimer:</strong> All data displayed in this platform is mock/simulated data for demonstration purposes as part of the Google Code for Communities 2nd Edition submission.
          In a production deployment, real government data, national census records, and verified citizen feedback would be integrated through secure API connections with appropriate data governance protocols.
        </p>
      </div>
    </div>
  );
}
