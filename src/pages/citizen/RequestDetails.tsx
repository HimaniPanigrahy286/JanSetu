import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Globe, Clock, Brain, Zap, Mic, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { requestService } from '../../services/requestService';

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode; bg: string }> = {
  pending: { color: 'text-yellow-700', label: 'Pending Review', icon: <Clock size={16} />, bg: 'bg-yellow-100' },
  under_review: { color: 'text-blue-700', label: 'Under Review', icon: <AlertCircle size={16} />, bg: 'bg-blue-100' },
  in_progress: { color: 'text-orange-700', label: 'In Progress', icon: <TrendingUp size={16} />, bg: 'bg-orange-100' },
  resolved: { color: 'text-green-700', label: 'Resolved', icon: <CheckCircle size={16} />, bg: 'bg-green-100' },
  rejected: { color: 'text-red-700', label: 'Rejected', icon: <AlertCircle size={16} />, bg: 'bg-red-100' },
};

const SEV_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: 'text-red-700', bg: 'bg-red-100' },
  high: { label: 'High', color: 'text-orange-700', bg: 'bg-orange-100' },
  medium: { label: 'Medium', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  low: { label: 'Low', color: 'text-green-700', bg: 'bg-green-100' },
};

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = requestService.getById(id!);

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Request not found</p>
        <Link to="/citizen/requests" className="text-blue-600 text-sm mt-2 inline-block">← Back to requests</Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[request.status];
  const sev = SEV_CONFIG[request.aiAnalysis.severity];

  const timeline = [
    { label: 'Request Submitted', date: request.createdAt, done: true },
    { label: 'AI Analysis Completed', date: request.createdAt, done: true },
    { label: 'Under Official Review', date: request.status !== 'pending' ? request.updatedAt : null, done: request.status !== 'pending' },
    { label: 'Action In Progress', date: request.status === 'in_progress' || request.status === 'resolved' ? request.updatedAt : null, done: request.status === 'in_progress' || request.status === 'resolved' },
    { label: 'Resolved', date: request.status === 'resolved' ? request.updatedAt : null, done: request.status === 'resolved' },
  ];

  return (
    <div className="space-y-4">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Back to Requests
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 font-mono">{request.id}</span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg} ${status.color} text-xs font-medium`}>
            {status.icon}
            {status.label}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {request.category}
          </span>
          {request.isVoice && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Mic size={10} /> Voice Request
            </span>
          )}
        </div>
        <p className="text-slate-800 text-sm leading-relaxed">{request.description}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><MapPin size={11} />{request.location}</span>
          <span className="flex items-center gap-1"><Globe size={11} />{request.language}</span>
          <span className="flex items-center gap-1"><Clock size={11} />
            {new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Image */}
      {request.imageUrl && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <img src={request.imageUrl} alt="Evidence" className="w-full h-48 object-cover" />
        </div>
      )}

      {/* AI Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center gap-2">
          <Brain size={16} className="text-white" />
          <span className="text-white font-semibold text-sm">AI Analysis Report</span>
          <span className="ml-auto text-blue-200 text-xs">Confidence: {Math.round(request.aiAnalysis.confidence * 100)}%</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Detected Language</p>
              <p className="font-semibold text-slate-800 text-sm">{request.aiAnalysis.detectedLanguage}</p>
            </div>
            <div className={`rounded-xl p-3 ${sev.bg}`}>
              <p className={`text-xs mb-1 ${sev.color} opacity-70`}>Severity</p>
              <p className={`font-semibold text-sm ${sev.color}`}>{sev.label}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Category</p>
              <p className="font-semibold text-slate-800 text-sm">{request.aiAnalysis.category}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Subcategory</p>
              <p className="font-semibold text-slate-800 text-sm">{request.aiAnalysis.subcategory}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="text-xs text-blue-600 font-medium mb-1.5 flex items-center gap-1">
              <Zap size={12} /> AI Summary
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">{request.aiAnalysis.summary}</p>
          </div>

          {/* Voice Transcription */}
          {request.isVoice && request.voiceTranscription && (
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
              <p className="text-xs text-purple-600 font-medium mb-1.5 flex items-center gap-1">
                <Mic size={12} /> Voice Transcription
              </p>
              <p className="text-sm text-slate-700">{request.voiceTranscription}</p>
            </div>
          )}

          {/* Keywords */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Key Terms</p>
            <div className="flex flex-wrap gap-1.5">
              {request.aiAnalysis.keywords.map(k => (
                <span key={k} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{k}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-sm mb-4">Request Timeline</h3>
        <div className="space-y-0">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.done ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  {item.done && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                {i < timeline.length - 1 && (
                  <div className={`w-0.5 h-8 ${item.done ? 'bg-blue-200' : 'bg-slate-100'} my-0.5`} />
                )}
              </div>
              <div className="pb-3">
                <p className={`text-sm font-medium ${item.done ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</p>
                {item.date && (
                  <p className="text-xs text-slate-400">
                    {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
