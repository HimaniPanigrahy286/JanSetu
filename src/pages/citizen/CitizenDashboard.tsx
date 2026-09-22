import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';

const CATEGORY_ICONS: Record<string, string> = {
  Roads: '🛣️',
  Water: '💧',
  Electricity: '⚡',
  Healthcare: '🏥',
  Education: '🏫',
  Transport: '🚌',
  Sanitation: '🗑️',
  'Digital Infrastructure': '📡',
  'Public Facilities': '🏛️',
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; border: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-brand-yellow', border: 'border-black', text: 'text-black' },
  under_review: { label: 'Under Review', bg: 'bg-brand-sage', border: 'border-black', text: 'text-black' },
  in_progress: { label: 'In Progress', bg: 'bg-black', border: 'border-black', text: 'text-brand-yellow' },
  resolved: { label: 'Resolved', bg: 'bg-white', border: 'border-green-600', text: 'text-green-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', border: 'border-red-600', text: 'text-red-700' },
};

export default function CitizenDashboard() {
  const user = authService.getCurrentUser()!;
  const stats = requestService.getStats(user.id);
  const recentRequests = requestService.getByUserId(user.id).slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label: 'Total Submitted', value: stats.total, bg: 'bg-brand-yellow', note: 'All your requests' },
    { label: 'Under Review', value: stats.underReview, bg: 'bg-brand-sage', note: 'Being assessed' },
    { label: 'In Progress', value: stats.inProgress, bg: 'bg-black text-white', note: 'Action started', textClass: 'text-white' },
    { label: 'Resolved', value: stats.resolved, bg: 'bg-white', note: 'Successfully closed' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-brand-yellow card-brutal-lg rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="font-bold text-xs uppercase tracking-widest text-black/60">{greeting},</p>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-1">{user.name} 👋</h2>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="px-3 py-1 bg-white border-2 border-black rounded-full text-xs font-bold shadow-brutal-sm">
              📍 {user.location}
            </span>
            <span className="px-3 py-1 bg-white border-2 border-black rounded-full text-xs font-bold shadow-brutal-sm">
              🌐 {user.language}
            </span>
            <span className="px-3 py-1 bg-black text-brand-yellow border-2 border-black rounded-full text-xs font-bold">
              ● Citizen Portal Active
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className={`${card.bg} card-brutal rounded-2xl p-5 text-center`}>
            <p className={`font-heading font-extrabold text-4xl ${card.textClass ?? 'text-black'}`}>{card.value}</p>
            <p className={`font-bold text-xs uppercase tracking-wider mt-1 ${card.textClass ?? 'text-black'}`}>{card.label}</p>
            <p className={`text-xs mt-1 ${card.textClass ? 'text-white/60' : 'text-black/50'}`}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/citizen/submit" className="p-6 bg-white card-brutal rounded-2xl flex flex-col gap-3 hover:bg-brand-yellow transition-colors group">
          <div className="w-12 h-12 bg-brand-yellow border-2 border-black rounded-xl flex items-center justify-center text-2xl group-hover:bg-white transition-colors">
            ➕
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl">Submit Request</h3>
            <p className="text-sm font-medium text-black/60 mt-1">Report a new infrastructure complaint in your area.</p>
          </div>
          <span className="font-bold text-xs uppercase tracking-widest mt-auto">File Complaint →</span>
        </Link>

        <Link to="/citizen/voice" className="p-6 bg-white card-brutal rounded-2xl flex flex-col gap-3 hover:bg-brand-sage transition-colors group">
          <div className="w-12 h-12 bg-brand-sage border-2 border-black rounded-xl flex items-center justify-center text-2xl group-hover:bg-white transition-colors">
            🎤
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl">Voice Input</h3>
            <p className="text-sm font-medium text-black/60 mt-1">Speak in your regional language — Odia, Hindi, Tamil and more.</p>
          </div>
          <span className="font-bold text-xs uppercase tracking-widest mt-auto">Start Recording →</span>
        </Link>

        <Link to="/citizen/requests" className="p-6 bg-white card-brutal rounded-2xl flex flex-col gap-3 hover:bg-black group transition-colors">
          <div className="w-12 h-12 bg-black border-2 border-black rounded-xl flex items-center justify-center text-2xl group-hover:bg-brand-yellow transition-colors">
            📋
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl group-hover:text-white transition-colors">My Requests</h3>
            <p className="text-sm font-medium text-black/60 mt-1 group-hover:text-white/60 transition-colors">View all your submitted requests and their statuses.</p>
          </div>
          <span className="font-bold text-xs uppercase tracking-widest mt-auto group-hover:text-white transition-colors">View All →</span>
        </Link>
      </div>

      {/* Recent Requests */}
      {recentRequests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-extrabold text-xl">Recent Requests</h3>
            <Link to="/citizen/requests" className="font-bold text-xs uppercase tracking-widest hover:underline decoration-2">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentRequests.map(req => {
              const sc = STATUS_CONFIG[req.status];
              return (
                <div key={req.id} className="bg-white card-brutal rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-sage border-2 border-black rounded-lg flex items-center justify-center text-xl shrink-0">
                    {CATEGORY_ICONS[req.category] ?? '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{req.aiAnalysis.summary || req.description.slice(0, 60) + '...'}</p>
                    <p className="text-xs text-black/50 font-medium mt-0.5">
                      {req.category} &bull; {req.location} &bull; {new Date(req.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 ${sc.bg} ${sc.text} border-2 ${sc.border} rounded-lg text-[10px] font-extrabold uppercase tracking-wider`}>
                      {sc.label}
                    </span>
                    <Link
                      to={`/citizen/requests/${req.id}`}
                      className="btn-brutal-secondary px-3 py-1.5 text-xs font-bold rounded-lg"
                    >
                      Track →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recentRequests.length === 0 && (
        <div className="bg-white card-brutal rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-heading font-extrabold text-2xl">No Requests Yet</h3>
          <p className="font-medium text-sm text-black/60 mt-2 max-w-sm mx-auto">
            You haven't submitted any infrastructure requests yet. Start by filing your first complaint.
          </p>
          <Link to="/citizen/submit" className="btn-brutal-primary mt-6 px-8 py-3 rounded-xl font-extrabold inline-flex items-center gap-2">
            Submit First Request →
          </Link>
        </div>
      )}
    </div>
  );
}
