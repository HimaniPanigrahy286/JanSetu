import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Shield,
  User,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { authService } from '../services/authService';
import type { Role } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    // Small loading delay for better UI
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = authService.login(email, password, role);

    setLoading(false);

    if (user) {
      if (role === 'citizen') {
        navigate('/citizen/dashboard');
      } else {
        navigate('/government/overview');
      }
    } else {
      setError(
        'Invalid credentials. Please use one of the demo accounts below.'
      );
    }
  };

  const fillDemo = (demoRole: Role) => {
    setRole(demoRole);

    if (demoRole === 'citizen') {
      setEmail('citizen@demo.com');
    } else {
      setEmail('official@demo.com');
    }

    setPassword('demo1234');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="w-full max-w-md relative">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 rounded-2xl p-3 shadow-lg shadow-blue-500/30">
              <Building2 className="text-white" size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">
            NexGen Governance
          </h1>

          <p className="text-blue-300 mt-1 text-sm">
            AI-Powered Digital Public Infrastructure Platform
          </p>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs text-blue-400/70 bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-700/30">
              Google Code for Communities 2nd Edition • Track 1
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">

          <h2 className="text-xl font-semibold text-white mb-6">
            Sign in to your account
          </h2>

          {/* Role Selection */}
          <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-xl">

            <button
              type="button"
              onClick={() => fillDemo('citizen')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === 'citizen'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <User size={15} />
              Citizen
            </button>

            <button
              type="button"
              onClick={() => fillDemo('official')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === 'official'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Shield size={15} />
              Government Official
            </button>

          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === 'citizen'
                    ? 'citizen@demo.com'
                    : 'official@demo.com'
                }
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-300 bg-red-900/30 border border-red-700/30 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>

                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>

          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-white/10">

            <p className="text-xs text-blue-300/70 mb-3 text-center">
              Demo Accounts
            </p>

            <div className="grid grid-cols-2 gap-2">

              {/* Citizen Demo */}
              <button
                type="button"
                onClick={() => fillDemo('citizen')}
                className="text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <User size={12} className="text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">
                    Citizen
                  </span>
                </div>

                <div className="text-xs text-white/50 group-hover:text-white/70">
                  citizen@demo.com
                </div>
              </button>

              {/* Official Demo */}
              <button
                type="button"
                onClick={() => fillDemo('official')}
                className="text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Shield size={12} className="text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">
                    Official
                  </span>
                </div>

                <div className="text-xs text-white/50 group-hover:text-white/70">
                  official@demo.com
                </div>
              </button>

            </div>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-blue-400/40 text-xs mt-6">
          © 2026 NexGen Governance Platform • Powered by Google Gemini AI
        </p>

      </div>
    </div>
  );
}