import { useState, useRef } from 'react';
import { MapPin, Globe, Mail, Save, Edit3, Camera, User as UserIcon, Phone, Briefcase, CheckCircle2, X } from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';
import { doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../firebase';
import type { User } from '../../types';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Himani',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Priya',
];

export default function CitizenProfile() {
  const [user, setUser] = useState<User>(() => {
    return authService.getCurrentUser() || {
      id: 'u1',
      name: 'Himani Panigrahy',
      email: 'himanipanigrahy28@gmail.com',
      role: 'citizen',
      location: 'Odisha, India',
      language: 'English',
      phone: '+91 98765 43210',
      organization: "CSIT'29 • ITER (SOA)",
      bio: 'Active civic infrastructure advocate and resident of Odisha.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };
  });

  const stats = requestService.getStats(user.id);
  const [phone, setPhone] = useState(user.phone || '');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [voiceUpdates, setVoiceUpdates] = useState(true);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenEdit = () => {
    setEditForm({
      name: user.name,
      location: user.location,
      language: user.language,
      phone: user.phone || phone,
      organization: user.organization || "CSIT'29 • ITER (SOA)",
      bio: user.bio || '',
      avatar: user.avatar,
    });
    setIsEditing(true);
  };

  const handleSavePreferences = () => {
    const updatedUser: User = {
      ...user,
      phone: phone.trim(),
    };
    setUser(updatedUser);
    authService.saveUser(updatedUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name: editForm.name?.trim() || user.name,
      location: editForm.location?.trim() || user.location,
      language: editForm.language || user.language,
      phone: editForm.phone?.trim() || user.phone,
      organization: editForm.organization?.trim() || user.organization,
      bio: editForm.bio?.trim() || user.bio,
      avatar: editForm.avatar || user.avatar,
    };

    setUser(updatedUser);
    authService.saveUser(updatedUser);

    // Save to Firestore non-blocking if configured
    if (isFirebaseConfigured) {
      try {
        const firestorePromise = setDoc(
          doc(db, 'users', user.id),
          {
            name: updatedUser.name,
            location: updatedUser.location,
            language: updatedUser.language,
            phone: updatedUser.phone || '',
            organization: updatedUser.organization || '',
            bio: updatedUser.bio || '',
            avatar: updatedUser.avatar || '',
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000));
        await Promise.race([firestorePromise, timeoutPromise]);
      } catch (err) {
        console.warn('Firestore update warning:', err);
      }
    }

    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const newAvatar = reader.result as string;
          if (isEditing) {
            setEditForm(prev => ({ ...prev, avatar: newAvatar }));
          } else {
            const updatedUser = { ...user, avatar: newAvatar };
            setUser(updatedUser);
            authService.saveUser(updatedUser);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-brand-yellow card-brutal-lg rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Citizen Profile & Identity
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">MY CITIZEN PROFILE</h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            Registered citizen details, preferred regional dialect, and grievance alerts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenEdit}
            className="btn-brutal-primary px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2"
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-100 border-2 border-emerald-600 rounded-2xl text-emerald-900 font-bold text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-700" />
          <span>Profile changes updated and saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-charcoal text-white card-brutal-lg rounded-3xl p-6 text-center space-y-5">
            <div className="relative inline-block mx-auto">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-28 h-28 rounded-full border-4 border-brand-yellow object-cover shadow-brutal mx-auto bg-white"
                />
              ) : (
                <div className="w-28 h-28 bg-brand-yellow text-black border-4 border-black rounded-full flex items-center justify-center mx-auto text-5xl font-heading font-extrabold shadow-brutal">
                  {user.name.charAt(0)}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 bg-brand-yellow text-black border-2 border-black rounded-full flex items-center justify-center shadow-brutal-sm hover:scale-105 transition-transform"
                title="Change Photo"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-2xl text-white tracking-tight">{user.name}</h3>
              <p className="text-xs font-bold text-brand-yellow mt-0.5">
                {user.organization || "CSIT'29 • ITER (SOA)"}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/15 border border-white/20 rounded-full text-[11px] font-mono text-brand-sage">
                Citizen ID: #{user.id.slice(0, 8).toUpperCase() || 'BRICS-OD-9042'}
              </span>
            </div>

            <div className="p-3.5 bg-white/10 border-2 border-white/20 rounded-2xl text-xs font-bold space-y-2.5 text-left">
              <div className="flex items-center gap-2.5 text-brand-sage">
                <MapPin size={15} className="text-brand-yellow shrink-0" />
                <span className="text-white truncate">{user.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-brand-sage">
                <Globe size={15} className="text-brand-yellow shrink-0" />
                <span className="text-white">Dialect: {user.language}</span>
              </div>
              <div className="flex items-center gap-2.5 text-brand-sage">
                <Mail size={15} className="text-brand-yellow shrink-0" />
                <span className="text-white truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2.5 text-brand-sage">
                  <Phone size={15} className="text-brand-yellow shrink-0" />
                  <span className="text-white">{user.phone}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleOpenEdit}
              className="w-full btn-brutal-secondary py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2"
            >
              <Edit3 size={14} />
              <span>Edit Profile Details</span>
            </button>
          </div>

          {/* Civic Impact Stats Card */}
          <div className="bg-white card-brutal-lg rounded-2xl p-5 space-y-3">
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-black/70">Civic Activity</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-brand-yellow/30 border-2 border-black rounded-xl text-center">
                <p className="font-heading font-extrabold text-2xl text-black">{stats.total}</p>
                <p className="text-[9px] font-extrabold uppercase text-black/70 mt-0.5">Filed</p>
              </div>
              <div className="p-3 bg-black text-white rounded-xl text-center">
                <p className="font-heading font-extrabold text-2xl text-brand-yellow">{stats.inProgress + stats.underReview}</p>
                <p className="text-[9px] font-extrabold uppercase text-brand-sage mt-0.5">Active</p>
              </div>
              <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded-xl text-center">
                <p className="font-heading font-extrabold text-2xl text-emerald-700">{stats.resolved}</p>
                <p className="text-[9px] font-extrabold uppercase text-emerald-800 mt-0.5">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Information & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Registered Personal Information Card */}
          <div className="bg-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-2xl">PERSONAL INFORMATION</h3>
                <p className="text-xs font-bold text-black/60 mt-0.5">
                  Information registered with your JanSetu citizen account
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenEdit}
                className="btn-brutal-secondary px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50 border-2 border-black/20 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                  <UserIcon size={13} /> Full Name
                </span>
                <p className="font-heading font-extrabold text-base text-black">{user.name}</p>
              </div>

              <div className="p-4 bg-gray-50 border-2 border-black/20 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                  <Mail size={13} /> Email Address
                </span>
                <p className="font-bold text-sm text-black truncate">{user.email}</p>
              </div>

              <div className="p-4 bg-gray-50 border-2 border-black/20 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                  <MapPin size={13} /> Region / Location
                </span>
                <p className="font-heading font-extrabold text-base text-black">{user.location}</p>
              </div>

              <div className="p-4 bg-gray-50 border-2 border-black/20 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                  <Globe size={13} /> Preferred Dialect / Language
                </span>
                <p className="font-heading font-extrabold text-base text-black">{user.language}</p>
              </div>

              <div className="p-4 bg-gray-50 border-2 border-black/20 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                  <Briefcase size={13} /> Affiliation / Institution
                </span>
                <p className="font-bold text-sm text-black">{user.organization || "CSIT'29 • ITER (SOA)"}</p>
              </div>

              <div className="p-4 bg-gray-50 border-2 border-black/20 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                  <Phone size={13} /> Contact Number
                </span>
                <p className="font-bold text-sm text-black">{user.phone || phone || 'Not provided'}</p>
              </div>
            </div>

            {user.bio && (
              <div className="p-4 bg-brand-yellow/15 border-2 border-black/20 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black/60">About / Citizen Bio</span>
                <p className="text-xs font-semibold text-black/80 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>

          {/* Notification & SMS Preferences Card */}
          <div className="bg-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-5">
            <h3 className="font-heading font-extrabold text-2xl">COMMUNICATION PREFERENCES</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-1.5">
                  Mobile Number for SMS & WhatsApp Updates
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="space-y-3 pt-2 border-t-2 border-black/10 text-xs">
                <label className="flex items-center gap-3 cursor-pointer font-bold select-none">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={e => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 accent-black rounded"
                  />
                  <span>Receive WhatsApp & SMS alerts when engineering team reviews grievance</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer font-bold select-none">
                  <input
                    type="checkbox"
                    checked={voiceUpdates}
                    onChange={e => setVoiceUpdates(e.target.checked)}
                    className="w-4 h-4 accent-black rounded"
                  />
                  <span>Receive automated regional dialect voice calls for major resolution updates</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="btn-brutal-primary px-6 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white card-brutal-lg rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl">EDIT PROFILE</h2>
                <p className="text-xs font-bold text-black/60">Update your personal and citizen details</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-9 h-9 border-2 border-black rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="font-bold text-xs uppercase tracking-widest block mb-2">Profile Avatar Photo</label>
                <div className="flex items-center gap-4">
                  {editForm.avatar ? (
                    <img
                      src={editForm.avatar}
                      alt="Preview"
                      className="w-16 h-16 rounded-full border-2 border-black object-cover shadow-brutal-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-black text-brand-yellow rounded-full flex items-center justify-center font-heading font-extrabold text-xl">
                      {editForm.name?.charAt(0) || 'U'}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-brutal-secondary px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5"
                    >
                      <Camera size={13} />
                      <span>Upload Custom Photo</span>
                    </button>
                    <p className="text-[10px] font-semibold text-black/60">Or select from presets below:</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, avatar: av }))}
                      className={`w-10 h-10 rounded-full border-2 transition-all shrink-0 ${
                        editForm.avatar === av ? 'border-black ring-2 ring-black scale-110 shadow-brutal-sm' : 'border-black/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Preset" className="w-full h-full rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border-2 border-black rounded-xl px-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Location & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Region / Location *</label>
                  <input
                    type="text"
                    required
                    value={editForm.location || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border-2 border-black rounded-xl px-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Preferred Dialect</label>
                  <select
                    value={editForm.language || 'English'}
                    onChange={e => setEditForm(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full border-2 border-black rounded-xl px-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    {['English', 'Hindi', 'Odia', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Affiliation & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Affiliation / Tagline</label>
                  <input
                    type="text"
                    value={editForm.organization || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g. CSIT'29 • ITER (SOA)"
                    className="w-full border-2 border-black rounded-xl px-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full border-2 border-black rounded-xl px-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Citizen Bio</label>
                <textarea
                  rows={2}
                  value={editForm.bio || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Brief note about yourself..."
                  className="w-full border-2 border-black rounded-xl px-4 py-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t-2 border-black flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-brutal-secondary px-5 py-2.5 rounded-xl text-xs font-extrabold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-brutal-primary px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
