import { useParams, useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';

const STATUS_STAGES = [
  { key: 'pending', label: 'Submitted', desc: 'Your request has been received by the system.' },
  { key: 'under_review', label: 'Under Review', desc: 'A government official is reviewing your submission.' },
  { key: 'in_progress', label: 'In Progress', desc: 'Action is being taken to resolve this issue.' },
  { key: 'resolved', label: 'Resolved', desc: 'This infrastructure issue has been addressed.' },
];

const STATUS_ORDER: Record<string, number> = {
  pending: 0,
  under_review: 1,
  in_progress: 2,
  resolved: 3,
  rejected: 3,
};

const SEV_CONFIG: Record<string, { label: string; bg: string; border: string; text: string }> = {
  critical: { label: 'Critical', bg: 'bg-red-100', border: 'border-red-600', text: 'text-red-700' },
  high: { label: 'High', bg: 'bg-orange-100', border: 'border-orange-600', text: 'text-orange-700' },
  medium: { label: 'Medium', bg: 'bg-brand-yellow', border: 'border-black', text: 'text-black' },
  low: { label: 'Low', bg: 'bg-brand-sage', border: 'border-black', text: 'text-black' },
};

const CATEGORY_ICONS: Record<string, string> = {
  Roads: '🛣️', Water: '💧', Electricity: '⚡', Healthcare: '🏥',
  Education: '🏫', Transport: '🚌', Sanitation: '🗑️',
  'Digital Infrastructure': '📡', 'Public Facilities': '🏛️',
};

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = requestService.getById(id!);

  if (!request) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📭</div>
        <h2 className="font-heading font-extrabold text-2xl">Request Not Found</h2>
        <p className="font-medium text-sm text-black/60 mt-2">This request ID doesn't exist or may have been removed.</p>
        <button onClick={() => navigate('/citizen/requests')} className="btn-brutal-primary mt-6 px-8 py-3 rounded-xl font-extrabold">
          ← Back to My Requests
        </button>
      </div>
    );
  }

  const currentStepIdx = STATUS_ORDER[request.status] ?? 0;
  const sev = SEV_CONFIG[request.aiAnalysis.severity];

  const timeline = [
    { label: 'Request Submitted', date: request.createdAt, done: true },
    { label: 'AI Analysis Completed', date: request.createdAt, done: true },
    { label: 'Under Official Review', date: request.status !== 'pending' ? request.updatedAt : null, done: request.status !== 'pending' },
    { label: 'Action In Progress', date: (request.status === 'in_progress' || request.status === 'resolved') ? request.updatedAt : null, done: request.status === 'in_progress' || request.status === 'resolved' },
    { label: 'Issue Resolved', date: request.status === 'resolved' ? request.updatedAt : null, done: request.status === 'resolved' },
  ];

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="btn-brutal-secondary px-4 py-2 rounded-xl text-sm font-bold"
      >
        ← Back
      </button>

      {/* Header Card */}
      <div className="bg-brand-yellow card-brutal-lg rounded-2xl p-6">
        <div className="flex flex-wrap items-start gap-3 justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center text-2xl">
                {CATEGORY_ICONS[request.category] ?? '📌'}
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl">{request.category}</span>
                {request.isVoice && (
                  <span className="ml-2 px-2 py-0.5 bg-black text-brand-yellow text-[10px] font-extrabold rounded-lg">🎤 VOICE</span>
                )}
              </div>
            </div>
            <p className="font-medium text-sm text-black/80 max-w-2xl">{request.description}</p>
          </div>
          <div className="text-right shrink-0">
            <span className={`px-3 py-1.5 ${sev.bg} ${sev.text} border-2 ${sev.border} rounded-lg text-xs font-extrabold uppercase`}>
              {sev.label} Severity
            </span>
            <p className="font-mono text-xs text-black/40 mt-2">{request.id}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t-2 border-black/10 text-sm font-medium">
          <span>📍 {request.location}</span>
          <span>🌐 {request.language}</span>
          <span>🗓 {new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Lifecycle Tracker */}
      <div className="bg-white card-brutal rounded-2xl p-6">
        <h3 className="font-heading font-extrabold text-xl mb-6">REQUEST LIFECYCLE</h3>
        <div className="flex flex-col md:flex-row gap-0">
          {STATUS_STAGES.map((stage, i) => {
            const isActive = i === currentStepIdx || (request.status === 'rejected' && i === 3);
            const isDone = i < currentStepIdx || (request.status === 'resolved' && i <= 3);
            const isRejected = request.status === 'rejected' && i === 3;

            return (
              <div key={stage.key} className="flex-1 relative">
                {/* Connector line */}
                {i < STATUS_STAGES.length - 1 && (
                  <div className={`hidden md:block absolute top-6 left-1/2 right-0 h-0.5 z-0 ${isDone ? 'bg-black' : 'bg-black/20'}`} />
                )}
                <div className="relative z-10 flex flex-col items-center text-center px-4 pb-6">
                  {/* Circle */}
                  <div className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center font-extrabold text-sm mb-3 transition-all ${
                    isRejected
                      ? 'bg-red-600 text-white'
                      : isActive
                        ? 'bg-brand-yellow text-black shadow-brutal-sm'
                        : isDone
                          ? 'bg-black text-white'
                          : 'bg-white text-black/30'
                  }`}>
                    {isRejected ? '✕' : isDone || isActive ? '✓' : (i + 1)}
                  </div>
                  <p className={`font-bold text-sm ${isActive ? 'text-black' : isDone ? 'text-black' : 'text-black/30'}`}>
                    {isRejected ? 'Rejected' : stage.label}
                  </p>
                  <p className={`text-xs mt-1 max-w-28 ${isActive ? 'text-black/70' : 'text-black/30'}`}>
                    {isRejected ? 'Your request was not approved.' : stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Image evidence */}
      {request.imageUrl && (
        <div className="bg-white card-brutal rounded-2xl overflow-hidden">
          <div className="bg-brand-sage border-b-2 border-black px-5 py-3">
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-widest">Evidence Photo</h3>
          </div>
          <img src={request.imageUrl} alt="Evidence" className="w-full object-cover max-h-64" />
        </div>
      )}

      {/* AI Analysis */}
      <div className="bg-white card-brutal rounded-2xl overflow-hidden">
        <div className="bg-brand-charcoal px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-yellow border-2 border-brand-yellow rounded-lg flex items-center justify-center font-extrabold text-sm">🧠</div>
          <div>
            <p className="text-white font-heading font-extrabold text-sm">AI ANALYSIS REPORT</p>
            <p className="text-brand-sage text-xs">Confidence: {Math.round(request.aiAnalysis.confidence * 100)}%</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {/* Summary */}
          <div className="p-4 bg-brand-yellow border-2 border-black rounded-xl">
            <p className="font-bold text-xs uppercase tracking-widest mb-2">AI Summary</p>
            <p className="font-medium text-sm">{request.aiAnalysis.summary}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Language', value: request.aiAnalysis.detectedLanguage },
              { label: 'Category', value: request.aiAnalysis.category },
              { label: 'Subcategory', value: request.aiAnalysis.subcategory },
              { label: 'Severity', value: request.aiAnalysis.severity.toUpperCase() },
            ].map(item => (
              <div key={item.label} className="p-3 bg-brand-sage border-2 border-black rounded-xl">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/60 mb-1">{item.label}</p>
                <p className="font-bold text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Keywords */}
          <div>
            <p className="font-bold text-xs uppercase tracking-widest mb-2">Key Terms Detected</p>
            <div className="flex flex-wrap gap-2">
              {request.aiAnalysis.keywords.map(k => (
                <span key={k} className="px-3 py-1 bg-white border-2 border-black rounded-full text-xs font-bold">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Voice Transcription */}
          {request.isVoice && request.voiceTranscription && (
            <div className="p-4 bg-black text-white border-2 border-black rounded-xl">
              <p className="font-bold text-xs uppercase tracking-widest mb-2 text-brand-yellow">🎤 Voice Transcription</p>
              <p className="font-medium text-sm">{request.voiceTranscription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white card-brutal rounded-2xl p-6">
        <h3 className="font-heading font-extrabold text-xl mb-6">ACTIVITY TIMELINE</h3>
        <div className="space-y-0">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${item.done ? 'bg-black border-black text-white' : 'bg-white border-black/20'}`}>
                  {item.done && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                {i < timeline.length - 1 && (
                  <div className={`w-0.5 h-10 my-1 ${item.done ? 'bg-black' : 'bg-black/15'}`} />
                )}
              </div>
              <div className="pb-4">
                <p className={`font-bold text-sm ${item.done ? 'text-black' : 'text-black/30'}`}>{item.label}</p>
                {item.date && (
                  <p className="text-xs text-black/50 font-medium mt-0.5">
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
