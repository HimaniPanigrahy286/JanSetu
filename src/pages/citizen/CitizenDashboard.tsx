import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Mic, ArrowRight, Clock, CheckCircle, AlertCircle, FileText, MapPin, Sparkles } from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import CategoryBadge from '../../components/common/CategoryBadge';

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser() || {
    id: 'u1',
    name: 'Priya Sharma',
    email: 'citizen@demo.com',
    role: 'citizen',
    location: 'Bhubaneswar, Odisha',
    language: 'Odia',
  };

  const stats = requestService.getStats(user.id);
  const myRequests = requestService.getByUserId(user.id);
  const recentRequests = myRequests.slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-brand-yellow card-brutal-lg rounded-3xl p-6 md:p-8 relative overflow-hidden">
        {/* Background Graphic Accent */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <span className="font-heading font-extrabold text-9xl">JANSETU</span>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Citizen Infrastructure Dashboard
          </div>

          <div>
            <p className="font-bold text-xs uppercase tracking-widest text-black/70">{greeting},</p>
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl tracking-tight text-black mt-0.5">
              {user.name} 👋
            </h1>
          </div>

          <p className="text-sm md:text-base font-medium text-black/80 max-w-2xl leading-relaxed">
            Report infrastructure defects, track public works in your ward, and voice local development priorities directly to government authorities.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <span className="px-3 py-1.5 bg-white border-2 border-black rounded-xl text-xs font-extrabold shadow-brutal-sm flex items-center gap-1.5">
              <MapPin size={13} className="text-red-500" />
              {user.location}
            </span>
            <span className="px-3 py-1.5 bg-white border-2 border-black rounded-xl text-xs font-extrabold shadow-brutal-sm">
              🌐 Dialect: {user.language}
            </span>
            <span className="px-3 py-1.5 bg-black text-brand-yellow border-2 border-black rounded-xl text-xs font-extrabold flex items-center gap-1.5">
              <Sparkles size={13} />
              AI Prioritization Active
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={stats.total}
          subtext="All logged grievances"
          icon={<FileText size={20} />}
          variant="yellow"
        />
        <StatCard
          label="Under Review"
          value={stats.underReview}
          subtext="Assessing by engineers"
          icon={<Clock size={20} />}
          variant="sage"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          subtext="Work order sanctioned"
          icon={<AlertCircle size={20} />}
          variant="dark"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          subtext="Successfully verified"
          icon={<CheckCircle size={20} />}
          variant="white"
        />
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Submit Request */}
        <Link
          to="/citizen/submit"
          className="p-6 bg-white card-brutal-lg rounded-2xl flex flex-col justify-between hover:bg-brand-yellow transition-all group cursor-pointer"
        >
          <div className="space-y-3">
            <div className="w-13 h-13 bg-brand-yellow border-2 border-black rounded-2xl flex items-center justify-center text-2xl shadow-brutal-sm group-hover:bg-white transition-colors">
              <PlusCircle size={28} className="text-black" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-2xl leading-tight">Submit New Request</h3>
              <p className="text-xs font-bold text-black/60 mt-1">
                Report broken roads, dry water taps, leaking drains, or school defects with photos and location.
              </p>
            </div>
          </div>
          <div className="pt-5 flex items-center gap-2 font-heading font-extrabold text-sm uppercase tracking-wider group-hover:translate-x-1 transition-transform">
            <span>File Grievance</span>
            <ArrowRight size={16} />
          </div>
        </Link>

        {/* Voice Input */}
        <Link
          to="/citizen/voice"
          className="p-6 bg-white card-brutal-lg rounded-2xl flex flex-col justify-between hover:bg-brand-sage transition-all group cursor-pointer"
        >
          <div className="space-y-3">
            <div className="w-13 h-13 bg-brand-sage border-2 border-black rounded-2xl flex items-center justify-center text-2xl shadow-brutal-sm group-hover:bg-white transition-colors">
              <Mic size={28} className="text-black" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-2xl leading-tight">Voice Submission</h3>
              <p className="text-xs font-bold text-black/60 mt-1">
                Speak directly in your native dialect — Odia, Hindi, Bengali, Tamil, Telugu, or English.
              </p>
            </div>
          </div>
          <div className="pt-5 flex items-center gap-2 font-heading font-extrabold text-sm uppercase tracking-wider group-hover:translate-x-1 transition-transform">
            <span>Record Voice</span>
            <ArrowRight size={16} />
          </div>
        </Link>

        {/* Track Requests */}
        <Link
          to="/citizen/requests"
          className="p-6 bg-brand-charcoal text-white card-brutal-lg rounded-2xl flex flex-col justify-between hover:bg-black transition-all group cursor-pointer"
        >
          <div className="space-y-3">
            <div className="w-13 h-13 bg-brand-yellow text-black border-2 border-brand-yellow rounded-2xl flex items-center justify-center text-2xl shadow-brutal-sm">
              <CheckCircle size={28} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-2xl leading-tight text-brand-yellow">
                Track Status & History
              </h3>
              <p className="text-xs font-bold text-brand-sage mt-1">
                Monitor 4-stage lifecycle milestones, engineering updates, and resolution approvals.
              </p>
            </div>
          </div>
          <div className="pt-5 flex items-center gap-2 font-heading font-extrabold text-sm uppercase tracking-wider text-brand-yellow group-hover:translate-x-1 transition-transform">
            <span>View All ({stats.total})</span>
            <ArrowRight size={16} />
          </div>
        </Link>
      </div>

      {/* Recent Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-extrabold text-2xl">MY RECENT REQUESTS</h2>
            <p className="text-xs font-bold text-black/60">Live status updates from municipal authorities</p>
          </div>
          <Link
            to="/citizen/requests"
            className="btn-brutal-secondary px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5"
          >
            <span>View All Requests</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="bg-white card-brutal-lg rounded-2xl p-12 text-center space-y-4">
            <div className="text-5xl">📭</div>
            <div>
              <h3 className="font-heading font-extrabold text-2xl">No Requests Submitted Yet</h3>
              <p className="text-xs font-bold text-black/60 max-w-sm mx-auto mt-1">
                You haven't logged any infrastructure grievances. Start by reporting your first civic issue.
              </p>
            </div>
            <button
              onClick={() => navigate('/citizen/submit')}
              className="btn-brutal-primary px-6 py-3 rounded-xl text-xs font-extrabold"
            >
              Submit First Request &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentRequests.map(req => (
              <div
                key={req.id}
                className="bg-white card-brutal rounded-2xl p-5 flex flex-col justify-between hover:border-black transition-all space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CategoryBadge category={req.category} size="md" />
                    <StatusBadge status={req.status} size="sm" />
                  </div>

                  <p className="font-bold text-sm text-black line-clamp-2 leading-snug">
                    {req.aiAnalysis.summary || req.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-xs text-black/60 font-bold">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-red-500" />
                      {req.location}
                    </span>
                    <span>•</span>
                    <span>{new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-extrabold text-black/50">{req.id}</span>
                  <Link
                    to={`/citizen/requests/${req.id}`}
                    className="btn-brutal-primary px-3.5 py-1.5 text-xs font-extrabold rounded-lg inline-flex items-center gap-1"
                  >
                    <span>Track Status</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
