import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}
type FormErrors = Partial<FormState>;

export default function ContactUs() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormState, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Your name is required.';
    if (!form.email.trim()) e.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.message.trim()) e.message = 'Message is required.';
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-charcoal font-body text-black">
      {/* Header */}
      <header className="h-20 bg-brand-yellow border-b-2 border-black sticky top-0 z-50 flex items-center justify-between px-6 md:px-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black">
            <svg className="w-6 h-6 fill-brand-yellow" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight leading-none">JANSETU</span>
            <span className="text-xs font-bold tracking-wider">BRICS PLATFORM</span>
          </div>
        </button>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')} className="btn-brutal-secondary px-5 py-2 text-sm rounded-xl font-bold">Sign In</button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-brand-yellow border-b-2 border-black px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <span className="font-bold text-xs uppercase tracking-widest text-black">Get In Touch</span>
          <h1 className="font-heading font-extrabold text-5xl md:text-6xl mt-2">CONTACT & SUPPORT</h1>
          <p className="font-medium text-lg mt-4 max-w-2xl">
            Have a grievance, technical issue, or a question about the JanSetu platform? 
            Our support team is available to assist citizens and officials.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-white border-b-2 border-black px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-2xl mb-6">CONTACT INFORMATION</h2>
            </div>

            {/* Info cards */}
            {[
              {
                icon: '📍',
                title: 'Headquarters',
                content: 'Ministry of Digital Governance\nNorth Block, New Delhi — 110 001\nIndia',
              },
              {
                icon: '📞',
                title: 'Helpline',
                content: 'Toll-Free: 1800-XXX-XXXX\nMonday – Friday, 9 AM – 6 PM IST',
              },
              {
                icon: '✉️',
                title: 'Email Support',
                content: 'support@jansetu.gov.in\ngrievance@jansetu.gov.in',
              },
              {
                icon: '⏱',
                title: 'Response Time',
                content: 'General queries: 2 business days\nGrievance escalations: 48 hours',
              },
            ].map(item => (
              <div key={item.title} className="p-5 bg-brand-sage card-brutal rounded-xl">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-heading font-extrabold text-lg mb-1">{item.title}</div>
                <p className="font-medium text-sm whitespace-pre-line text-black/80">{item.content}</p>
              </div>
            ))}

            {/* Support channels */}
            <div className="p-5 bg-brand-yellow card-brutal rounded-xl">
              <div className="font-heading font-extrabold text-lg mb-3">QUICK LINKS</div>
              <div className="space-y-2">
                <button onClick={() => navigate('/citizen/submit')} className="w-full text-left font-bold text-sm py-2 px-3 bg-white border-2 border-black rounded-lg hover:bg-brand-sage transition-colors">
                  Submit Infrastructure Request →
                </button>
                <button onClick={() => navigate('/citizen/requests')} className="w-full text-left font-bold text-sm py-2 px-3 bg-white border-2 border-black rounded-lg hover:bg-brand-sage transition-colors">
                  Track Your Request Status →
                </button>
                <button onClick={() => navigate('/login')} className="w-full text-left font-bold text-sm py-2 px-3 bg-white border-2 border-black rounded-lg hover:bg-brand-sage transition-colors">
                  Access Citizen Dashboard →
                </button>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2">
            <h2 className="font-heading font-extrabold text-2xl mb-6">SEND A MESSAGE</h2>

            {submitted ? (
              <div className="bg-brand-yellow card-brutal-lg rounded-2xl p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-black border-2 border-black rounded-full flex items-center justify-center mx-auto text-4xl text-brand-yellow font-extrabold">✓</div>
                <div>
                  <h3 className="font-heading font-extrabold text-3xl">MESSAGE SENT!</h3>
                  <p className="font-medium text-sm mt-3 max-w-sm mx-auto">
                    Thank you, <strong>{form.name}</strong>. Your message has been received. 
                    We'll respond to <strong>{form.email}</strong> within 2 business days.
                  </p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn-brutal-primary px-8 py-3 rounded-xl font-extrabold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white card-brutal-lg rounded-2xl p-8 space-y-5" noValidate>
                {/* Name & Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Your full name"
                      maxLength={100}
                      className={`w-full border-2 rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.name ? 'border-red-600 bg-red-50' : 'border-black'}`}
                    />
                    {errors.name && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.name}</p>}
                  </div>
                  <div>
                    <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="you@example.com"
                      maxLength={200}
                      className={`w-full border-2 rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.email ? 'border-red-600 bg-red-50' : 'border-black'}`}
                    />
                    {errors.email && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">Subject *</label>
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={e => set('subject', e.target.value)}
                    className={`w-full border-2 rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white ${errors.subject ? 'border-red-600 bg-red-50' : 'border-black'}`}
                  >
                    <option value="">Select a subject...</option>
                    <option>General Inquiry</option>
                    <option>Technical Issue / Bug Report</option>
                    <option>Grievance Escalation</option>
                    <option>Request Status Follow-up</option>
                    <option>Account Access Problem</option>
                    <option>Partnership / Collaboration</option>
                    <option>Data Privacy Request</option>
                    <option>Other</option>
                  </select>
                  {errors.subject && <p className="text-red-600 text-xs font-bold mt-1">⚠ {errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="font-bold text-xs uppercase tracking-widest block mb-1.5">
                    Message * <span className="text-black/40 normal-case font-medium">(min. 20 characters)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Describe your issue, question, or feedback in detail..."
                    rows={6}
                    maxLength={2000}
                    className={`w-full border-2 rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none ${errors.message ? 'border-red-600 bg-red-50' : 'border-black'}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message ? (
                      <p className="text-red-600 text-xs font-bold">⚠ {errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-black/40 font-medium">{form.message.length}/2000</span>
                  </div>
                </div>

                {/* Notice */}
                <div className="bg-brand-sage border-2 border-black rounded-xl p-4">
                  <p className="font-bold text-xs uppercase tracking-wide mb-1">Important Notice</p>
                  <p className="text-sm font-medium text-black/80">
                    For urgent infrastructure emergencies (road accidents, medical access blocked, water contamination), 
                    please call our emergency helpline directly at <strong>1800-XXX-XXXX</strong>.
                  </p>
                </div>

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={loading}
                  className="btn-brutal-primary w-full py-4 rounded-xl text-base font-extrabold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message →'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-charcoal text-white py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div className="font-heading font-extrabold text-xl text-brand-yellow">JANSETU</div>
          <div>&copy; 2026 JanSetu Governance Platform. Built by Ankita, Himani & Trishala</div>
        </div>
      </footer>
    </div>
  );
}
