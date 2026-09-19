import React from 'react';
import { User, MapPin, Globe, Mail, Shield, FileText, CheckCircle, Clock } from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';

export default function CitizenProfile() {
  const user = authService.getCurrentUser()!;
  const stats = requestService.getStats(user.id);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-800">My Profile</h2>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10">
          <User size={36} className="text-white" />
        </div>
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-blue-200 text-sm mt-0.5 flex items-center justify-center gap-1">
          <Shield size={13} />
          Verified Citizen
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 text-sm text-blue-200">
          <span className="flex items-center gap-1"><MapPin size={13} />{user.location}</span>
          <span className="flex items-center gap-1"><Globe size={13} />{user.language}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending + stats.underReview + stats.inProgress}</p>
          <p className="text-xs text-slate-500 mt-0.5">Active</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          <p className="text-xs text-slate-500 mt-0.5">Resolved</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {[
          { icon: User, label: 'Full Name', value: user.name },
          { icon: Mail, label: 'Email', value: user.email },
          { icon: MapPin, label: 'Location', value: user.location },
          { icon: Globe, label: 'Preferred Language', value: user.language },
          { icon: Shield, label: 'Account Type', value: 'Citizen Portal' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <item.icon size={15} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="text-sm font-medium text-slate-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-sm mb-3">Civic Contribution</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <FileText size={14} className="text-blue-500" />
              Total reports submitted
            </span>
            <span className="font-bold text-slate-800">{stats.total}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              Issues resolved
            </span>
            <span className="font-bold text-green-600">{stats.resolved}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <Clock size={14} className="text-yellow-500" />
              Under review
            </span>
            <span className="font-bold text-yellow-600">{stats.underReview}</span>
          </div>
        </div>
        <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
          <p className="text-xs text-blue-700 font-medium">🏆 Active Citizen</p>
          <p className="text-xs text-slate-600 mt-0.5">Thank you for contributing to improving your community's infrastructure!</p>
        </div>
      </div>
    </div>
  );
}
