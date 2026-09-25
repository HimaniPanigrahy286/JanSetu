import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building2,
  Sparkles,
  Volume2,
  UserCheck,
} from 'lucide-react';
import { requestService } from '../../services/requestService';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';

const STAGES = [
  {
    key: 'pending',
    title: 'SUBMITTED',
    desc: 'Recorded into central JanSetu grievance register & clustered by AI.',
    icon: Clock,
  },
  {
    key: 'under_review',
    title: 'UNDER REVIEW',
    desc: 'Assigned to jurisdictional engineer for on-site assessment.',
    icon: AlertCircle,
  },
  {
    key: 'in_progress',
    title: 'IN PROGRESS',
    desc: 'Work order sanctioned and contractor mobilized on ground.',
    icon: Building2,
  },
  {
    key: 'resolved',
    title: 'RESOLVED',
    desc: 'Public infrastructure defect rectified and verified.',
    icon: CheckCircle2,
  },
];

const STAGE_INDEX: Record<string, number> = {
  pending: 0,
  under_review: 1,
  in_progress: 2,
  resolved: 3,
  rejected: 3,
};

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = requestService.getById(id || '');

  if (!request) {
    return (
      <div className="max-w-2xl mx-auto bg-white card-brutal-lg rounded-3xl p-10 text-center space-y-4">
        <div className="text-5xl">📭</div>
        <h2 className="font-heading font-extrabold text-2xl">Grievance Not Found</h2>
        <p className="text-xs font-bold text-black/60">
          The request ID "{id}" could not be located in the current database.
        </p>
        <button onClick={() => navigate('/citizen/requests')} className="btn-brutal-primary px-6 py-3 rounded-xl text-xs font-extrabold">
          &larr; Back to My Requests
        </button>
      </div>
    );
  }

  const currentIdx = STAGE_INDEX[request.status] ?? 0;
  const isResolved = request.status === 'resolved';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/citizen/requests')}
          className="btn-brutal-secondary px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to All Requests</span>
        </button>
        <span className="font-mono text-xs font-extrabold bg-white border-2 border-black px-3 py-1 rounded-xl shadow-brutal-sm">
          Tracking ID: {request.id}
        </span>
      </div>

      {/* Main Header Banner */}
      <div className="bg-brand-yellow card-brutal-lg rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={request.category} size="lg" />
              <PriorityBadge priority={request.priority || 'high'} size="md" />
              <StatusBadge status={request.status} size="md" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-black">
              {request.aiAnalysis.subcategory || request.category}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-extrabold uppercase text-black/60">Registered Date</p>
            <p className="font-mono font-extrabold text-sm text-black">
              {new Date(request.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-black rounded-2xl">
          <p className="font-medium text-sm text-black leading-relaxed">{request.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-black/80 pt-1">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-red-500" />
            {request.location}
          </span>
          <span>•</span>
          <span>Dialect: {request.language}</span>
          <span>•</span>
          <span>Impact: ~{(request.affectedCount || 12000).toLocaleString()} citizens</span>
        </div>
      </div>

      {/* 4-Stage Visual Lifecycle Progress Tracker */}
      <div className="bg-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <h3 className="font-heading font-extrabold text-xl">4-STAGE RESOLUTION LIFECYCLE</h3>
          <p className="text-xs font-bold text-black/60 mt-0.5">Automated tracking across public works departments</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {STAGES.map((st, i) => {
            const isCompleted = i < currentIdx || isResolved;
            const isCurrent = i === currentIdx && !isResolved;
            const Icon = st.icon;

            return (
              <div
                key={st.key}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-brand-yellow border-black shadow-brutal ring-2 ring-black'
                    : isCompleted
                      ? 'bg-emerald-50 border-emerald-600 text-black'
                      : 'bg-gray-50 border-black/20 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center font-extrabold text-sm ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                            ? 'bg-black text-brand-yellow'
                            : 'bg-white text-black'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span className="font-mono text-xs font-extrabold text-black/50">Stage {i + 1}</span>
                  </div>

                  <p className="font-heading font-extrabold text-sm leading-tight text-black">{st.title}</p>
                  <p className="text-[11px] font-bold text-black/70 leading-normal">{st.desc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-black/10 flex items-center justify-between text-[10px] font-extrabold uppercase">
                  <span>{isCompleted ? '✓ Completed' : isCurrent ? '● Active Now' : '○ Pending'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Government Response Section */}
      {request.officialResponse && (
        <div className="bg-brand-charcoal text-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-yellow text-black rounded-lg flex items-center justify-center font-extrabold text-sm">
                🏛️
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-brand-yellow">GOVERNMENT OFFICIAL UPDATE</h3>
                <p className="text-[11px] font-bold text-brand-sage">Verified municipal dispatch</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold bg-white/10 px-2.5 py-1 rounded-md text-brand-yellow">
              {new Date(request.officialResponse.updatedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="p-4 bg-white/10 border-2 border-white/20 rounded-2xl">
            <p className="text-sm font-medium text-white leading-relaxed">{request.officialResponse.message}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-brand-yellow" />
              <div>
                <p className="font-extrabold text-white">{request.officialResponse.officialName}</p>
                <p className="text-[10px] text-brand-sage">{request.officialResponse.officialRole || 'Inspecting Engineer'}</p>
              </div>
            </div>

            {request.officialResponse.estimatedResolution && (
              <div className="flex items-center gap-2">
                <FileCheck size={16} className="text-emerald-400" />
                <div>
                  <p className="font-extrabold text-white">Target Completion</p>
                  <p className="text-[10px] text-brand-sage">{request.officialResponse.estimatedResolution}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Supporting Evidence & AI NLP Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Photo Evidence Card */}
        {request.imageUrl ? (
          <div className="bg-white card-brutal rounded-3xl p-5 space-y-3">
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-black">
              Photographic Evidence
            </h4>
            <div className="border-2 border-black rounded-2xl overflow-hidden shadow-brutal-sm">
              <img src={request.imageUrl} alt="Defect Evidence" className="w-full h-56 object-cover" />
            </div>
            <p className="text-[10px] font-mono font-bold text-black/50 text-center">
              Geotagged & verified against district spatial maps
            </p>
          </div>
        ) : (
          <div className="bg-white card-brutal rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="text-3xl">📷</div>
            <h4 className="font-heading font-extrabold text-sm">No Photo Attached</h4>
            <p className="text-xs font-bold text-black/50 max-w-xs">
              This grievance was submitted via text/voice description without image evidence.
            </p>
          </div>
        )}

        {/* AI Analysis Report */}
        <div className="bg-white card-brutal rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-black" />
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-black">
              AI NLP Technical Diagnostics
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-brand-yellow/30 border border-black rounded-xl">
              <p className="text-[10px] font-extrabold uppercase text-black/60">Summary</p>
              <p className="font-medium text-black mt-0.5">{request.aiAnalysis.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-gray-50 border border-black rounded-xl">
                <p className="text-[10px] font-extrabold uppercase text-black/60">Confidence</p>
                <p className="font-heading font-extrabold text-sm text-black">
                  {Math.round(request.aiAnalysis.confidence * 100)}%
                </p>
              </div>
              <div className="p-2.5 bg-gray-50 border border-black rounded-xl">
                <p className="text-[10px] font-extrabold uppercase text-black/60">Cluster Merged</p>
                <p className="font-heading font-extrabold text-sm text-black">
                  +{request.aiAnalysis.duplicateClusterCount || 24} in Hotspot
                </p>
              </div>
            </div>

            {request.isVoice && request.voiceTranscription && (
              <div className="p-3 bg-black text-white border border-black rounded-xl">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-brand-yellow mb-0.5">
                  <Volume2 size={12} />
                  Native Audio Transcription
                </div>
                <p className="font-medium text-xs text-white">{request.voiceTranscription}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
