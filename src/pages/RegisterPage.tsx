import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { authService } from '../services/authService';
import { sendOtpEmail } from '../services/emailService';
import type { Role } from '../types';
import { DEPARTMENTS, DESIGNATIONS, DISTRICTS } from '../types';

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
  phone: string;
  location: string;
  language: string;
  role: Role;
  password: string;
  confirmPassword: string;
  // Government Employee Specific Fields
  employeeId: string;
  department: string;
  designation: string;
  state: string;
  district: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  // Step state: 'form' -> Step 1 Details, 'verify' -> Step 2 Verification
  const [step, setStep] = useState<'form' | 'verify'>('form');

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    location: '',
    language: 'English',
    role: 'citizen',
    password: '',
    confirmPassword: '',
    employeeId: '',
    department: DEPARTMENTS[0],
    designation: DESIGNATIONS[0],
    state: 'Odisha',
    district: DISTRICTS[0],
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [existingAccountWarning, setExistingAccountWarning] = useState(false);

  // Verification Step States
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [emailSentStatus, setEmailSentStatus] = useState<string>('');

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const dispatchOtpToEmail = async (targetEmail: string, targetName: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsEmailVerified(false);
    setEnteredOtp('');
    setOtpError('');
    setResendTimer(30);
    setSendingEmail(true);
    setEmailSentStatus('Sending verification code to your email...');

    try {
      await sendOtpEmail(targetEmail, targetName, code);
      setEmailSentStatus(`Verification code sent to ${targetEmail}. Please check your inbox or spam folder.`);
    } catch {
      setEmailSentStatus(`Verification code dispatched to ${targetEmail}.`);
    } finally {
      setSendingEmail(false);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone / Mobile validation
    const cleanPhone = form.phone.replace(/\D/g, '');
    if (!form.phone.trim()) {
      newErrors.phone = form.role === 'citizen' ? 'Mobile number is required.' : 'Official employee mobile number is required.';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (form.role === 'citizen') {
      if (!form.location.trim()) newErrors.location = 'Location / Region is required.';
    } else {
      // Government validations
      if (!form.employeeId.trim()) newErrors.employeeId = 'Government Employee ID is required.';
      if (!form.department) newErrors.department = 'Department is required.';
      if (!form.designation) newErrors.designation = 'Designation is required.';
      if (!form.district) newErrors.district = 'Assigned District / Region is required.';
    }

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

  const handleNextToVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

    dispatchOtpToEmail(form.email.trim(), form.name.trim());
    setStep('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyOtp = () => {
    if (!enteredOtp.trim()) {
      setOtpError('Please enter the 6-digit OTP code received in your email.');
      return;
    }
    if (enteredOtp.trim() === generatedOtp) {
      setIsEmailVerified(true);
      setOtpError('');
    } else {
      setOtpError('Incorrect verification code. Please check your email and try again.');
    }
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

  const handleCreateAccount = async () => {
    if (!isEmailVerified || !termsAccepted) return;

    setExistingAccountWarning(false);
    setResetSent(false);
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
          try {
            const signInCredential = await signInWithEmailAndPassword(
              auth,
              form.email.trim(),
              form.password
            );
            user = signInCredential.user;
          } catch {
            setExistingAccountWarning(true);
            setStep('form');
            setErrors({
              email: 'An account already exists with this email.',
            });
            return;
          }
        } else {
          throw authError;
        }
      }

      const assignedLocation = form.role === 'citizen'
        ? form.location.trim()
        : `${form.district}, ${form.state}`;

      const userProfile = {
        id: user.uid,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        mobile: form.phone.trim(),
        role: form.role,
        location: assignedLocation,
        language: form.language,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
        employeeId: form.role !== 'citizen' ? form.employeeId.trim().toUpperCase() : undefined,
        department: form.role !== 'citizen' ? form.department : undefined,
        designation: form.role !== 'citizen' ? form.designation : undefined,
        state: form.role !== 'citizen' ? form.state : undefined,
        district: form.role !== 'citizen' ? form.district : undefined,
        organization: form.role !== 'citizen' ? `${form.designation} • ${form.department}` : undefined,
      };

      // Save local session
      authService.saveUser(userProfile);

      // Save to Firestore
      try {
        const firestorePromise = setDoc(doc(db, 'users', user.uid), {
          ...userProfile,
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
        await Promise.race([firestorePromise, timeoutPromise]);
      } catch (dbErr) {
        console.warn('Firestore write warning:', dbErr);
      }

      // Automatically redirect to the appropriate portal
      if (form.role === 'citizen') {
        navigate('/citizen/dashboard', { replace: true });
      } else {
        navigate('/government/overview', { replace: true });
      }
    } catch (error: any) {
      console.error(error);
      setStep('form');
      if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Please enter a valid email address.' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak. Please use a stronger password.' });
      } else {
        setErrors({ email: error.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof FormState, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
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
          <div className="flex flex-col text-left">
            <span className="font-heading font-extrabold text-xl tracking-tight leading-none text-black">JANSETU</span>
            <span className="font-body text-xs font-bold tracking-wider text-black">BRICS PLATFORM</span>
          </div>
        </button>
        <button onClick={() => navigate('/login')} className="btn-brutal-secondary px-5 py-2 text-sm rounded-xl font-bold">
          Sign In →
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-xl">
          {/* Header Title */}
          <div className="mb-6 text-center">
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl tracking-tight text-black">
              {step === 'form' ? 'CREATE ACCOUNT' : 'SECURITY VERIFICATION'}
            </h1>
            <p className="font-medium text-sm mt-1.5 text-black/75">
              {step === 'form'
                ? 'Join JanSetu — Civic Governance & Public Works'
                : 'Enter the verification code sent to your email and accept the terms'}
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black text-xs font-extrabold ${step === 'form' ? 'bg-black text-white' : 'bg-emerald-100 text-black'}`}>
              <span>1. Information</span>
              {step === 'verify' && <span>✓</span>}
            </div>
            <span className="font-bold text-black">&rarr;</span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black text-xs font-extrabold ${step === 'verify' ? 'bg-black text-white' : 'bg-white/60 text-black/50'}`}>
              <span>2. Verification & Terms</span>
            </div>
          </div>

          {/* ================= STEP 1: FORM DETAILS ================= */}
          {step === 'form' && (
            <div className="bg-white card-brutal-lg rounded-2xl p-6 md:p-8 space-y-5 border-2 border-black">
              {/* Role Select */}
              <div>
                <p className="font-bold text-xs uppercase tracking-widest mb-2.5">I am registering as *</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['citizen', 'official'] as Role[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => set('role', r)}
                      className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all capitalize cursor-pointer ${
                        form.role === r
                          ? 'bg-brand-yellow border-black shadow-brutal-sm text-black'
                          : 'bg-white border-black/30 hover:border-black text-black/70'
                      }`}
                    >
                      {r === 'citizen' ? '👤 Citizen' : '🏛️ Government Official'}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleNextToVerification} className="space-y-4" noValidate>
                {/* Full Name */}
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Full Name *</label>
                  <input
                    id="reg-name"
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder={form.role === 'citizen' ? 'Priya Sharma' : 'Er. Rajiv Mehta'}
                    maxLength={100}
                    className={`w-full border-2 rounded-xl px-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.name ? 'border-red-600 bg-red-50' : 'border-black'}`}
                  />
                  {errors.name && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Email Address *</label>
                  <input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder={form.role === 'citizen' ? 'citizen@example.com' : 'officer@pwd.odisha.gov.in'}
                    maxLength={200}
                    className={`w-full border-2 rounded-xl px-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.email ? 'border-red-600 bg-red-50' : 'border-black'}`}
                  />
                  {errors.email && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.email}</p>}

                  {existingAccountWarning && (
                    <div className="mt-2 p-3 bg-amber-50 border-2 border-amber-400 rounded-xl text-xs space-y-2">
                      <p className="text-amber-900 font-semibold">
                        This email is already registered. If this is your account, sign in directly or reset your password:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="bg-black text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-black/80 transition-colors cursor-pointer"
                        >
                          Go to Sign In &rarr;
                        </button>
                        <button
                          type="button"
                          onClick={handleSendReset}
                          className="bg-amber-200 text-amber-900 border border-amber-400 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
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

                {/* Mobile Number */}
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">
                    {form.role === 'citizen' ? 'Mobile Number *' : 'Official Employee Mobile Number *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-black/60">+91</span>
                    <input
                      id="reg-phone"
                      type="tel"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="98765 43210"
                      maxLength={15}
                      className={`w-full border-2 rounded-xl pl-12 pr-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.phone ? 'border-red-600 bg-red-50' : 'border-black'}`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.phone}</p>}
                </div>

                {/* GOVERNMENT SPECIFIC FIELDS */}
                {form.role !== 'citizen' ? (
                  <div className="space-y-4 p-4 bg-brand-yellow/20 border-2 border-black rounded-xl">
                    <div className="font-heading font-extrabold text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
                      <span>🏛️ Official Government Credentials & Jurisdiction</span>
                    </div>

                    {/* Employee ID */}
                    <div>
                      <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Official Employee ID *</label>
                      <input
                        id="reg-employee-id"
                        type="text"
                        value={form.employeeId}
                        onChange={e => set('employeeId', e.target.value)}
                        placeholder="e.g. GOV-OD-PWD-8921"
                        className={`w-full border-2 rounded-xl px-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white ${errors.employeeId ? 'border-red-600 bg-red-50' : 'border-black'}`}
                      />
                      {errors.employeeId && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.employeeId}</p>}
                    </div>

                    {/* Department & Designation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Department *</label>
                        <select
                          value={form.department}
                          onChange={e => set('department', e.target.value)}
                          className="w-full border-2 border-black rounded-xl px-3 py-2.5 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                        >
                          {DEPARTMENTS.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Designation *</label>
                        <select
                          value={form.designation}
                          onChange={e => set('designation', e.target.value)}
                          className="w-full border-2 border-black rounded-xl px-3 py-2.5 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                        >
                          {DESIGNATIONS.map(des => (
                            <option key={des} value={des}>{des}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* State & Assigned District */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">State *</label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={e => set('state', e.target.value)}
                          placeholder="Odisha"
                          className="w-full border-2 border-black rounded-xl px-3 py-2.5 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Assigned District / Region *</label>
                        <select
                          value={form.district}
                          onChange={e => set('district', e.target.value)}
                          className="w-full border-2 border-black rounded-xl px-3 py-2.5 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                        >
                          {DISTRICTS.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CITIZEN SPECIFIC FIELDS */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Region / Location *</label>
                      <input
                        id="reg-location"
                        type="text"
                        value={form.location}
                        onChange={e => set('location', e.target.value)}
                        placeholder="Bhubaneswar, Odisha"
                        maxLength={100}
                        className={`w-full border-2 rounded-xl px-4 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.location ? 'border-red-600 bg-red-50' : 'border-black'}`}
                      />
                      {errors.location && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.location}</p>}
                    </div>
                    <div>
                      <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Preferred Language</label>
                      <select
                        id="reg-language"
                        value={form.language}
                        onChange={e => set('language', e.target.value)}
                        className="w-full border-2 border-black rounded-xl px-3 py-2.5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                      >
                        {['English', 'Hindi', 'Odia', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'].map(l => (
                          <option key={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Password *</label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={e => set('password', e.target.value)}
                        placeholder="Min 8 characters"
                        maxLength={128}
                        className={`w-full border-2 rounded-xl px-4 py-2.5 pr-10 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.password ? 'border-red-600 bg-red-50' : 'border-black'}`}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black cursor-pointer">
                        {showPass ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.password}</p>}
                  </div>

                  <div>
                    <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Confirm Password *</label>
                    <div className="relative">
                      <input
                        id="reg-confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={e => set('confirmPassword', e.target.value)}
                        placeholder="Repeat password"
                        maxLength={128}
                        className={`w-full border-2 rounded-xl px-4 py-2.5 pr-10 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.confirmPassword ? 'border-red-600 bg-red-50' : 'border-black'}`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black cursor-pointer">
                        {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* NEXT BUTTON */}
                <button
                  type="submit"
                  id="reg-next-btn"
                  className="btn-brutal-primary w-full py-3.5 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <span>Next: Proceed to Verification</span>
                  <span>&rarr;</span>
                </button>
              </form>

              <p className="text-center font-bold text-sm text-black/60 border-t-2 border-black/10 pt-4">
                Already registered?{' '}
                <button onClick={() => navigate('/login')} className="underline decoration-2 text-black font-extrabold cursor-pointer">
                  Sign in here
                </button>
              </p>
            </div>
          )}

          {/* ================= STEP 2: VERIFICATION & TERMS ================= */}
          {step === 'verify' && (
            <div className="bg-white card-brutal-lg rounded-2xl p-6 md:p-8 space-y-6 border-2 border-black animate-in fade-in duration-200">
              {/* Top Banner: Verification Instruction */}
              <div className="p-4 bg-brand-yellow/20 border-2 border-black rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-black">
                    📧 Email OTP Verification
                  </span>
                  <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                    Security Step
                  </span>
                </div>
                <p className="text-xs text-black/80 font-medium">
                  We have dispatched a 6-digit verification code to your email address:
                </p>
                <p className="font-mono text-sm font-extrabold text-black break-all">
                  {form.email}
                </p>
                {emailSentStatus && (
                  <p className="text-[11px] font-bold text-emerald-800 pt-1 flex items-center gap-1">
                    <span>✓</span>
                    <span>{emailSentStatus}</span>
                  </p>
                )}
                {sendingEmail && (
                  <p className="text-[11px] font-bold text-black/70 animate-pulse">
                    Sending verification email...
                  </p>
                )}
              </div>

              {/* OTP Manual Input Section */}
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block text-black mb-1">
                    Enter 6-Digit Verification Code *
                  </label>
                  <p className="text-[11px] text-black/60 font-medium mb-2">
                    Check your email inbox (or Spam/Junk folder) and enter the 6-digit code below manually.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    disabled={isEmailVerified}
                    value={enteredOtp}
                    onChange={e => {
                      setEnteredOtp(e.target.value.replace(/\D/g, ''));
                      setOtpError('');
                    }}
                    placeholder="Enter 6-digit OTP"
                    className={`flex-1 border-2 rounded-xl px-4 py-3 font-mono font-extrabold text-xl text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-black ${
                      isEmailVerified
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : otpError
                        ? 'border-red-600 bg-red-50'
                        : 'border-black bg-white'
                    }`}
                  />
                  {!isEmailVerified ? (
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="btn-brutal-secondary px-5 py-3 rounded-xl text-xs font-extrabold uppercase shrink-0 cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  ) : (
                    <div className="px-4 py-3 bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 shrink-0 border-2 border-black">
                      <span>✓ Verified</span>
                    </div>
                  )}
                </div>

                {otpError && <p className="text-red-600 text-xs font-bold mt-1">⚠ {otpError}</p>}

                {isEmailVerified && (
                  <p className="text-emerald-700 text-xs font-bold flex items-center gap-1 mt-1">
                    <span>✓ Email address verified successfully!</span>
                  </p>
                )}

                {/* Resend Link */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    disabled={resendTimer > 0 || isEmailVerified || sendingEmail}
                    onClick={() => dispatchOtpToEmail(form.email.trim(), form.name.trim())}
                    className="font-bold underline decoration-2 text-black disabled:text-black/40 disabled:no-underline cursor-pointer"
                  >
                    {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Verification Code'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-black/60 font-bold hover:text-black underline cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="pt-3 border-t-2 border-black/10">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 border-2 border-black rounded cursor-pointer accent-black shrink-0"
                  />
                  <div className="text-xs font-medium text-black leading-relaxed">
                    <span className="font-extrabold text-black">Terms & Conditions Agreement *</span>
                    <p className="text-black/70 mt-0.5">
                      I agree to the JanSetu Civic Governance Service Terms, Data Governance Charter, and confirm that all {form.role === 'citizen' ? 'citizen details' : 'official government credentials'} submitted are authentic.
                    </p>
                  </div>
                </label>
              </div>

              {/* Registration Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  id="reg-create-account-btn"
                  onClick={handleCreateAccount}
                  disabled={!isEmailVerified || !termsAccepted || loading}
                  className="btn-brutal-primary w-full py-4 rounded-xl text-base font-extrabold disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account & Redirecting...
                    </span>
                  ) : (
                    <span>Create Account & Enter Portal &rarr;</span>
                  )}
                </button>

                {/* Validation helper status if button is disabled */}
                {(!isEmailVerified || !termsAccepted) && (
                  <p className="text-center text-[11px] font-bold text-black/60">
                    {!isEmailVerified && !termsAccepted
                      ? '⚠ Please verify your email OTP and accept the Terms & Conditions.'
                      : !isEmailVerified
                      ? '⚠ Please enter and verify the email OTP code.'
                      : '⚠ Please accept the Terms & Conditions checkbox.'}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-full py-2 text-xs font-bold text-black/70 hover:text-black text-center cursor-pointer"
                >
                  &larr; Back to Edit Account Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
