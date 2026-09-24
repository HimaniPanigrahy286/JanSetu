import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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

interface FormState {
  name: string;
  email: string;
  location: string;
  language: string;
  role: Role;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    location: '',
    language: 'English',
    role: 'citizen',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [existingAccountWarning, setExistingAccountWarning] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!form.location.trim()) newErrors.location = 'Location / Region is required.';
    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendReset = async () => {
    if (!form.email.trim()) return;
    try {
      await sendPasswordResetEmail(auth, form.email.trim());
      setResetSent(true);
    } catch (err: any) {
      console.error(err);
      setErrors(prev => ({ ...prev, email: 'Could not send reset email. Please try again.' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExistingAccountWarning(false);
    setResetSent(false);

    if (!validate()) return;

    setLoading(true);
    try {
      let user;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email.trim(),
          form.password
        );
        user = userCredential.user;
      } catch (authError: any) {
        if (authError.code === 'auth/email-already-in-use') {
          // Attempt to sign in if the account already exists in Firebase Auth
          try {
            const signInCredential = await signInWithEmailAndPassword(
              auth,
              form.email.trim(),
              form.password
            );
            user = signInCredential.user;
          } catch {
            // Password didn't match existing account
            setExistingAccountWarning(true);
            setErrors({
              email: 'An account already exists with this email.',
            });
            return;
          }
        } else {
          throw authError;
        }
      }

      // Save local session
      authService.saveUser({
        id: user.uid,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        location: form.location.trim(),
        language: form.language,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
      });

      // Try storing user in Firestore with a timeout so it never hangs
      try {
        const firestorePromise = setDoc(doc(db, 'users', user.uid), {
          name: form.name.trim(),
          email: form.email.trim(),
          location: form.location.trim(),
          language: form.language,
          role: form.role,
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000));
        await Promise.race([firestorePromise, timeoutPromise]);
      } catch (dbErr) {
        console.warn('Firestore write warning:', dbErr);
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/invalid-email') {
        setErrors({
          email: 'Please enter a valid email address.',
        });
      } else if (error.code === 'auth/weak-password') {
        setErrors({
          password: 'Password is too weak. Please use a stronger password.',
        });
      } else {
        setErrors({
          email: error.message || 'Registration failed. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof FormState, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-yellow flex flex-col font-body">
        <header className="h-20 bg-brand-yellow border-b-2 border-black flex items-center justify-between px-6 md:px-12">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black">
              <svg className="w-6 h-6 fill-brand-yellow" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-tight leading-none">JANSETU</span>
              <span className="font-body text-xs font-bold tracking-wider">BRICS PLATFORM</span>
            </div>
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="bg-white card-brutal-lg rounded-2xl p-10 max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-brand-yellow border-2 border-black rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
            <h2 className="font-heading font-extrabold text-3xl">ACCOUNT CREATED!</h2>
            <p className="font-medium text-sm text-black/70">
              Welcome to JanSetu, <strong>{form.name}</strong>! Your account has been registered. 
              Please sign in with your credentials to access the platform.
            </p>
            <button onClick={() => navigate('/login')} className="btn-brutal-primary w-full py-4 rounded-xl text-base font-extrabold">
              Proceed to Login →
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <button onClick={() => navigate('/login')} className="btn-brutal-secondary px-5 py-2 text-sm rounded-xl font-bold">
          Sign In →
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl tracking-tight">CREATE ACCOUNT</h1>
            <p className="font-medium text-sm mt-2 text-black/70">Join JanSetu — Citizen Infrastructure Governance</p>
          </div>

          <div className="bg-white card-brutal-lg rounded-2xl p-8 space-y-5">
            {/* Role Select */}
            <div>
              <p className="font-bold text-xs uppercase tracking-widest mb-3">I am registering as</p>
              <div className="grid grid-cols-2 gap-3">
                {(['citizen', 'official'] as Role[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => set('role', r)}
                    className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all capitalize ${
                      form.role === r
                        ? 'bg-brand-yellow border-black shadow-brutal-sm'
                        : 'bg-white border-black/30 hover:border-black'
                    }`}
                  >
                    {r === 'citizen' ? '👤 Citizen' : '🏛️ Government Official'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div>
                <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Full Name *</label>
                <input
                  id="reg-name"
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Priya Sharma"
                  maxLength={100}
                  className={`w-full border-2 rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.name ? 'border-red-600 bg-red-50' : 'border-black'}`}
                />
                {errors.name && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Email Address *</label>
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  maxLength={200}
                  className={`w-full border-2 rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.email ? 'border-red-600 bg-red-50' : 'border-black'}`}
                />
                {errors.email && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.email}</p>}

                {existingAccountWarning && (
                  <div className="mt-2 p-3 bg-amber-50 border-2 border-amber-400 rounded-xl text-xs space-y-2">
                    <p className="text-amber-900 font-semibold">
                      This email is already registered in Firebase. If this is your account, you can sign in directly or reset your password:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="bg-black text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-black/80 transition-colors"
                      >
                        Go to Sign In &rarr;
                      </button>
                      <button
                        type="button"
                        onClick={handleSendReset}
                        className="bg-amber-200 text-amber-900 border border-amber-400 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-amber-300 transition-colors"
                      >
                        Send Password Reset Link
                      </button>
                    </div>
                  </div>
                )}

                {resetSent && (
                  <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded-xl text-xs text-green-800 font-bold">
                    ✓ Password reset email sent! Check your inbox to set a new password, then sign in.
                  </div>
                )}
              </div>

              {/* Location & Language (grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Region / Location *</label>
                  <input
                    id="reg-location"
                    type="text"
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="Bhubaneswar, Odisha"
                    maxLength={100}
                    className={`w-full border-2 rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.location ? 'border-red-600 bg-red-50' : 'border-black'}`}
                  />
                  {errors.location && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.location}</p>}
                </div>
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Preferred Language</label>
                  <select
                    id="reg-language"
                    value={form.language}
                    onChange={e => set('language', e.target.value)}
                    className="w-full border-2 border-black rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white appearance-none"
                  >
                    {['English', 'Hindi', 'Odia', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'].map(l => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Minimum 8 characters"
                    maxLength={128}
                    className={`w-full border-2 rounded-xl px-4 py-3 pr-12 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.password ? 'border-red-600 bg-red-50' : 'border-black'}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black">
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <input
                    id="reg-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    placeholder="Repeat your password"
                    maxLength={128}
                    className={`w-full border-2 rounded-xl px-4 py-3 pr-12 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.confirmPassword ? 'border-red-600 bg-red-50' : 'border-black'}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black">
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                id="reg-submit"
                disabled={loading}
                className="btn-brutal-primary w-full py-4 rounded-xl text-base font-extrabold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>

            <p className="text-center font-bold text-sm text-black/60 border-t-2 border-black/10 pt-4">
              Already registered?{' '}
              <button onClick={() => navigate('/login')} className="underline decoration-2 text-black">
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
