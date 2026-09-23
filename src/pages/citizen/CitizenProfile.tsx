import { useState } from 'react';
import { MapPin, Globe, Mail, Save } from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';

export default function CitizenProfile() {
  const user = authService.getCurrentUser() || {
    id: 'u1',
    name: 'Priya Sharma',
    email: 'citizen@demo.com',
    role: 'citizen',
    location: 'Bhubaneswar, Odisha',
    language: 'Odia',
    phone: '+91 98765 43210',
  };

  const stats = requestService.getStats(user.id);
  const [phone, setPhone] = useState(user.phone || '+91 98765 43210');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [voiceUpdates, setVoiceUpdates] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl">CITIZEN PROFILE</h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Manage your registered location, preferred dialect, and grievance notifications.
          </p>
        </div>
        <span className="px-3.5 py-1.5 bg-black text-brand-yellow rounded-xl text-xs font-extrabold uppercase">
          Verified Resident
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-brand-charcoal text-white card-brutal-lg rounded-3xl p-6 text-center space-y-4">
          <div className="w-24 h-24 bg-brand-yellow text-black border-2 border-black rounded-full flex items-center justify-center mx-auto text-4xl font-heading font-extrabold shadow-brutal">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-2xl text-white">{user.name}</h3>
            <p className="text-xs font-bold text-brand-yellow mt-0.5">Citizen ID: #BRICS-OD-9042</p>
          </div>

          <div className="p-3 bg-white/10 border-2 border-white/20 rounded-2xl text-xs font-bold space-y-2 text-left">
            <div className="flex items-center gap-2 text-brand-sage">
              <MapPin size={14} className="text-brand-yellow shrink-0" />
              <span className="text-white truncate">{user.location}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-sage">
              <Globe size={14} className="text-brand-yellow shrink-0" />
              <span className="text-white">Dialect: {user.language}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-sage">
              <Mail size={14} className="text-brand-yellow shrink-0" />
              <span className="text-white truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Stats & Settings */}
        <div className="md:col-span-2 space-y-5">
          {/* Civic Impact Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-brand-yellow card-brutal rounded-2xl text-center">
              <p className="font-heading font-extrabold text-3xl text-black">{stats.total}</p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/70 mt-1">
                Grievances Filed
              </p>
            </div>
            <div className="p-4 bg-black text-white card-brutal rounded-2xl text-center">
              <p className="font-heading font-extrabold text-3xl text-brand-yellow">
                {stats.pending + stats.underReview + stats.inProgress}
              </p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-sage mt-1">
                Under Action
              </p>
            </div>
            <div className="p-4 bg-white card-brutal rounded-2xl text-center">
              <p className="font-heading font-extrabold text-3xl text-emerald-700">{stats.resolved}</p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/70 mt-1">
                Resolved
              </p>
            </div>
          </div>

          {/* Settings & Contact Information */}
          <div className="bg-white card-brutal rounded-2xl p-6 space-y-4">
            <h3 className="font-heading font-extrabold text-lg">Contact & Notification Preferences</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-1">
                  Mobile Number for SMS Tracking
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="flex-1 border-2 border-black rounded-xl px-4 py-2.5 text-xs font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-black/10 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={e => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 accent-black rounded"
                  />
                  <span>Receive WhatsApp / SMS alerts when engineering status changes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={voiceUpdates}
                    onChange={e => setVoiceUpdates(e.target.checked)}
                    className="w-4 h-4 accent-black rounded"
                  />
                  <span>Receive automated regional dialect voice calls for major resolution notices</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {saved ? (
                  <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1">
                    ✓ Preferences saved!
                  </span>
                ) : <span />}
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn-brutal-primary px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
