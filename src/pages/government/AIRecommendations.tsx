import React, { useState } from 'react';
import { Sparkles, ChevronDown, Users, AlertTriangle, TrendingDown, DollarSign, CheckCircle, Info } from 'lucide-react';
import { MOCK_RECOMMENDATIONS } from '../../data/mockData';

const SCORE_FACTORS = [
  { label: 'Citizen Demand', weight: 35, color: 'bg-blue-500', key: 'citizenDemand' },
  { label: 'Infrastructure Gap', weight: 25, color: 'bg-orange-500', key: 'infrastructureGap' },
  { label: 'Population Impact', weight: 20, color: 'bg-red-500', key: 'populationImpact' },
  { label: 'Severity Level', weight: 10, color: 'bg-yellow-500', key: 'severity' },
  { label: 'Investment Gap', weight: 10, color: 'bg-purple-500', key: 'investmentGap' },
];

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  very_low: { label: 'Very Low', color: 'text-red-600 bg-red-100' },
  low: { label: 'Low', color: 'text-orange-600 bg-orange-100' },
  medium: { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
  high: { label: 'High', color: 'text-green-600 bg-green-100' },
};

export default function AIRecommendations() {
  const [expanded, setExpanded] = useState<string | null>(MOCK_RECOMMENDATIONS[0].id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles size={24} className="text-blue-600" />
          AI Recommendations
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">AI-generated infrastructure investment recommendations based on citizen data</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 font-medium text-sm">Decision Support Tool</p>
          <p className="text-amber-700 text-xs mt-0.5">
            These AI recommendations are generated from citizen feedback, demographic data, and infrastructure indicators.
            This is a <strong>decision-support indicator</strong>. Final decisions remain with authorized government officials.
          </p>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-4">
        {MOCK_RECOMMENDATIONS.map(rec => {
          const isOpen = expanded === rec.id;
          const cond = CONDITION_LABELS[rec.infrastructureCondition];

          return (
            <div key={rec.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${isOpen ? 'border-blue-300 shadow-blue-50' : 'border-slate-200'}`}>
              {/* Card Header */}
              <div
                className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : rec.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{rec.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cond.color}`}>{cond.label} Infra</span>
                    </div>
                    <h3 className="font-bold text-slate-800">{rec.region}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{rec.detectedIssue}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-3xl font-bold ${rec.priorityScore >= 80 ? 'text-red-600' : rec.priorityScore >= 70 ? 'text-orange-600' : 'text-yellow-600'}`}>
                      {rec.priorityScore}
                    </div>
                    <div className="text-xs text-slate-400">/ 100</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Priority Score</div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users size={13} className="text-blue-500" />
                      <span className="text-xs text-slate-500">Citizen Requests</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800">{rec.citizenRequests.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle size={13} className="text-orange-500" />
                      <span className="text-xs text-slate-500">Affected Population</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800">{(rec.affectedPopulation / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign size={13} className="text-green-500" />
                      <span className="text-xs text-slate-500">Existing Investment</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800">₹{(rec.existingInvestment / 10000000).toFixed(1)}Cr</p>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-3">
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Content */}
              {isOpen && (
                <div className="border-t border-slate-100 p-5 space-y-5 bg-slate-50/50">
                  {/* AI Recommendation Text */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-blue-600" />
                      <p className="font-semibold text-blue-800 text-sm">AI Recommendation</p>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">"{rec.recommendation}"</p>
                  </div>

                  {/* Why Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Info size={15} className="text-slate-500" />
                      <p className="font-semibold text-slate-800 text-sm">Why this recommendation?</p>
                    </div>
                    <div className="space-y-2">
                      {rec.reasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-700">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Score Factors */}
                  <div>
                    <p className="font-semibold text-slate-800 text-sm mb-3">Priority Score Factors</p>
                    <div className="space-y-2.5">
                      {SCORE_FACTORS.map(factor => {
                        const fakeValue = factor.weight * (0.8 + Math.random() * 0.4);
                        return (
                          <div key={factor.label}>
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                              <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${factor.color}`} />
                                {factor.label}
                              </span>
                              <span className="font-semibold">{Math.round(fakeValue)}/{factor.weight}</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full">
                              <div
                                className={`h-1.5 ${factor.color} rounded-full`}
                                style={{ width: `${(fakeValue / factor.weight) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div className="border-t border-slate-200 pt-2 flex justify-between">
                        <span className="text-sm font-semibold text-slate-700">Total Priority Score</span>
                        <span className={`text-lg font-bold ${rec.priorityScore >= 80 ? 'text-red-600' : rec.priorityScore >= 70 ? 'text-orange-600' : 'text-yellow-600'}`}>
                          {rec.priorityScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
