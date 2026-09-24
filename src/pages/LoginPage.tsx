import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { authService } from '../services/authService';
import type { Role } from '../types';

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address to receive the password reset link.');
      return;
    }
    setError('');
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMsg('Password reset link sent to your email. Please check your inbox/spam folder.');
    } catch (err: any) {
      console.error(err);
      setError('Failed to send password reset email. Check if the email address is correct.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const uid = userCredential.user.uid;
      let profileData: any = null;
      try {
        const docRef = doc(db, 'users', uid);
        const docSnapPromise = getDoc(docRef);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('timeout'), 2000));
        const docSnap = await Promise.race([docSnapPromise, timeoutPromise]) as any;
        if (docSnap && typeof docSnap.exists === 'function' && docSnap.exists()) {
          profileData = docSnap.data();
        }
      } catch (err) {
        console.warn('Could not fetch remote profile:', err);
      }

      const cached = authService.getCurrentUser();
      const name = profileData?.name || (cached?.email === email.trim() ? cached.name : null) || userCredential.user.displayName || email.trim().split('@')[0];
      const location = profileData?.location || (cached?.email === email.trim() ? cached.location : null) || 'Odisha, India';
      const language = profileData?.language || (cached?.email === email.trim() ? cached.language : null) || 'English';
      const avatar = profileData?.avatar || (cached?.email === email.trim() ? cached.avatar : null) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      const phone = profileData?.phone || (cached?.email === email.trim() ? cached.phone : undefined);
      const bio = profileData?.bio || (cached?.email === email.trim() ? cached.bio : undefined);
      const organization = profileData?.organization || (cached?.email === email.trim() ? cached.organization : undefined);

      // Save user session
      authService.saveUser({
        id: uid,
        name,
        email: userCredential.user.email || email.trim(),
        role: (profileData?.role as Role) || role,
        location,
        language,
        avatar,
        phone,
        bio,
        organization,
      });

      // Login successful
      if (role === 'citizen') {
        navigate('/citizen/dashboard');
      } else {
        navigate('/government/overview');
      }

    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoRole: Role) => {
    setRole(demoRole);
    setEmail(demoRole === 'citizen' ? 'citizen@demo.com' : 'official@demo.com');
    setPassword('demo1234');
    setError('');
  };

  return (
    <div className="min-h-screen bg-brand-yellow flex flex-col font-body">
      {/* Header */}
      <header className="h-20 bg-brand-yellow border-b-2 border-black flex items-center justify-between px-6 md:px-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black">
            <svg className="w-6 h-6 fill-brand-yellow" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight leading-none">JANSETU</span>
            <span className="font-body text-xs font-bold tracking-wider text-black">BRICS PLATFORM</span>
          </div>
        </button>
        <button onClick={() => navigate('/register')} className="btn-brutal-secondary px-5 py-2 text-sm rounded-xl font-bold">
          Register &rarr;
        </button>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl tracking-tight">ACCESS PORTAL</h1>
            <p className="font-medium text-sm mt-2 text-black/70">Sign in to your JanSetu account</p>
          </div>

          {/* Card */}
          <div className="bg-white card-brutal-lg rounded-2xl p-8 space-y-6">
            {/* Role Toggle */}
            <div>
              <p className="font-bold text-xs uppercase tracking-widest mb-3">Select Your Role</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setRole('citizen'); setError(''); }}
                  className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                    role === 'citizen'
                      ? 'bg-brand-yellow border-black shadow-brutal-sm'
                      : 'bg-white border-black/30 hover:border-black'
                  }`}
                >
                  👤 Citizen
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('official'); setError(''); }}
                  className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                    role === 'official'
                      ? 'bg-brand-yellow border-black shadow-brutal-sm'
                      : 'bg-white border-black/30 hover:border-black'
                  }`}
                >
                  🏛️ Government Official
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-2 border-black rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border-2 border-black rounded-xl px-4 py-3 pr-12 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-xs font-bold text-black/70 hover:text-black underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {successMsg && (
                <div className="bg-green-100 border-2 border-green-600 rounded-xl px-4 py-3 text-green-800 text-sm font-bold">
                  ✓ {successMsg}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-100 border-2 border-red-600 rounded-xl px-4 py-3 text-red-700 text-sm font-bold">
                  ⚠ {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-brutal-primary w-full py-4 rounded-xl text-base font-extrabold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Sign In →'
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="border-t-2 border-black/10 pt-5">
              <p className="font-bold text-xs uppercase tracking-widest mb-3 text-black/60">Quick Demo Access</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillDemo('citizen')}
                  className="btn-brutal-secondary py-2.5 px-3 rounded-xl text-xs font-bold"
                >
                  Citizen Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('official')}
                  className="btn-brutal-secondary py-2.5 px-3 rounded-xl text-xs font-bold"
                >
                  Official Demo
                </button>
              </div>
              <p className="text-xs text-black/50 font-medium mt-3 text-center">
                Password for all demo accounts: <span className="font-bold text-black">demo1234</span>
              </p>
            </div>
          </div>

          {/* Register link */}
          <p className="text-center font-bold text-sm mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="underline decoration-2">
              Register here →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}