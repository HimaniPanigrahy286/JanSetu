import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';
import { aiService } from '../../services/aiService';
import type { Category, AIAnalysis } from '../../types';

const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'Roads', label: 'Roads', icon: '🛣️' },
  { value: 'Water', label: 'Water Supply', icon: '💧' },
  { value: 'Electricity', label: 'Electricity', icon: '⚡' },
  { value: 'Healthcare', label: 'Healthcare Access', icon: '🏥' },
  { value: 'Education', label: 'Education', icon: '🏫' },
  { value: 'Transport', label: 'Transport', icon: '🚌' },
  { value: 'Sanitation', label: 'Sanitation', icon: '🗑️' },
  { value: 'Digital Infrastructure', label: 'Digital Infrastructure', icon: '📡' },
  { value: 'Public Facilities', label: 'Public Facilities', icon: '🏛️' },
];

const LANGUAGES = ['English', 'Hindi', 'Odia', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'];

const SEVERITY_CONFIG: Record<string, { label: string; bg: string; border: string; text: string; icon: string }> = {
  critical: { label: 'Critical', bg: 'bg-red-100', border: 'border-red-600', text: 'text-red-700', icon: '🔴' },
  high: { label: 'High', bg: 'bg-orange-100', border: 'border-orange-600', text: 'text-orange-700', icon: '🟠' },
  medium: { label: 'Medium', bg: 'bg-brand-yellow', border: 'border-black', text: 'text-black', icon: '🟡' },
  low: { label: 'Low', bg: 'bg-brand-sage', border: 'border-black', text: 'text-black', icon: '🟢' },
};

export default function SubmitRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = authService.getCurrentUser()!;

  const [category, setCategory] = useState<Category>(
    (searchParams.get('category') as Category) || 'Roads'
  );
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(user.location);
  const [language, setLanguage] = useState(user.language);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'analyzing' | 'result' | 'success'>('form');
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be under 5 MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setStep('analyzing');
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) { clearInterval(interval); return prev; }
        return prev + Math.random() * 20;
      });
    }, 300);
    try {
      const result = await aiService.analyzeText(description, language);
      clearInterval(interval);
      setAnalysisProgress(100);
      setAiResult(result);
      setTimeout(() => setStep('result'), 400);
    } catch {
      clearInterval(interval);
      setStep('form');
    }
  };

  const handleSubmit = () => {
    if (!aiResult) return;
    requestService.create(user.id, category, description, location, language, imagePreview || undefined, aiResult);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="space-y-5">
        <div className="bg-brand-yellow card-brutal-lg rounded-2xl p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-black border-2 border-black rounded-full flex items-center justify-center mx-auto text-4xl text-brand-yellow font-extrabold">✓</div>
          <div>
            <h2 className="font-heading font-extrabold text-3xl">REQUEST SUBMITTED!</h2>
            <p className="font-medium text-sm text-black/70 mt-3 max-w-sm mx-auto">
              Your infrastructure complaint has been recorded and queued for review by the concerned government authority.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/citizen/requests')} className="btn-brutal-primary px-8 py-3 rounded-xl font-extrabold">
              View My Requests →
            </button>
            <button
              onClick={() => { setStep('form'); setDescription(''); setAiResult(null); setImagePreview(null); }}
              className="btn-brutal-secondary px-8 py-3 rounded-xl font-bold"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'analyzing') {
    const analysisSteps = [
      { label: 'Language Detection', done: analysisProgress > 20 },
      { label: 'Translation & NLP', done: analysisProgress > 50 },
      { label: 'Category Classification', done: analysisProgress > 70 },
      { label: 'Severity Assessment', done: analysisProgress > 90 },
    ];
    return (
      <div className="bg-white card-brutal rounded-2xl p-10 text-center space-y-8">
        <div className="w-20 h-20 bg-brand-yellow border-2 border-black rounded-full flex items-center justify-center mx-auto relative">
          <span className="text-3xl">🧠</span>
          <div className="absolute inset-0 rounded-full border-4 border-black/10 border-t-black animate-spin" />
        </div>
        <div>
          <h2 className="font-heading font-extrabold text-2xl">AI ANALYSIS IN PROGRESS</h2>
          <p className="font-medium text-sm text-black/60 mt-2">Processing your request with multilingual NLP...</p>
        </div>
        <div className="max-w-xs mx-auto space-y-3">
          {analysisSteps.map(item => (
            <div key={item.label} className="flex items-center gap-3 text-left">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 font-extrabold text-xs ${item.done ? 'bg-black border-black text-white' : 'bg-white border-black/20 text-black/20'}`}>
                {item.done ? '✓' : '○'}
              </div>
              <p className={`text-sm font-bold ${item.done ? 'text-black' : 'text-black/30'}`}>{item.label}</p>
            </div>
          ))}
        </div>
        <div className="max-w-xs mx-auto">
          <div className="bg-black/10 rounded-full h-2.5 border border-black/20">
            <div className="bg-black h-2.5 rounded-full transition-all duration-300" style={{ width: `${Math.min(analysisProgress, 100)}%` }} />
          </div>
          <p className="text-center text-xs font-bold text-black/60 mt-2">{Math.round(Math.min(analysisProgress, 100))}% complete</p>
        </div>
      </div>
    );
  }

  if (step === 'result' && aiResult) {
    const sev = SEVERITY_CONFIG[aiResult.severity];
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-heading font-extrabold text-3xl">AI ANALYSIS RESULT</h2>
          <p className="font-medium text-sm text-black/60 mt-1">Review the AI classification before submitting your request.</p>
        </div>

        {/* AI Result Card */}
        <div className="bg-white card-brutal-lg rounded-2xl overflow-hidden">
          <div className="bg-brand-charcoal px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-yellow border-2 border-brand-yellow rounded-lg flex items-center justify-center">🧠</div>
              <p className="text-white font-heading font-extrabold">AI ANALYSIS COMPLETE</p>
            </div>
            <span className="text-brand-sage text-xs font-bold">Confidence: {Math.round(aiResult.confidence * 100)}%</span>
          </div>

          <div className="p-6 space-y-5">
            {/* Summary */}
            <div className="p-4 bg-brand-yellow border-2 border-black rounded-xl">
              <p className="font-bold text-xs uppercase tracking-widest mb-2">AI Summary</p>
              <p className="font-medium text-sm">{aiResult.summary}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-brand-sage border-2 border-black rounded-xl">
                <p className="text-[10px] font-extrabold uppercase text-black/60 mb-1">Language</p>
                <p className="font-bold text-sm">{aiResult.detectedLanguage}</p>
              </div>
              <div className="p-3 bg-brand-sage border-2 border-black rounded-xl">
                <p className="text-[10px] font-extrabold uppercase text-black/60 mb-1">Category</p>
                <p className="font-bold text-sm">{aiResult.category}</p>
              </div>
              <div className="p-3 bg-brand-sage border-2 border-black rounded-xl">
                <p className="text-[10px] font-extrabold uppercase text-black/60 mb-1">Subcategory</p>
                <p className="font-bold text-sm">{aiResult.subcategory}</p>
              </div>
              <div className={`p-3 ${sev.bg} border-2 ${sev.border} rounded-xl`}>
                <p className={`text-[10px] font-extrabold uppercase mb-1 ${sev.text} opacity-70`}>Severity</p>
                <p className={`font-extrabold text-sm ${sev.text}`}>{sev.icon} {sev.label}</p>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <p className="font-bold text-xs uppercase tracking-widest mb-2">Key Terms</p>
              <div className="flex flex-wrap gap-2">
                {aiResult.keywords.map(k => (
                  <span key={k} className="px-3 py-1 bg-white border-2 border-black rounded-full text-xs font-bold">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setStep('form')} className="btn-brutal-secondary flex-1 py-4 rounded-xl font-extrabold">
            ← Edit Request
          </button>
          <button onClick={handleSubmit} className="btn-brutal-primary flex-1 py-4 rounded-xl font-extrabold">
            Confirm & Submit →
          </button>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div className="space-y-6">
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6">
        <h1 className="font-heading font-extrabold text-3xl">SUBMIT REQUEST</h1>
        <p className="font-medium text-sm mt-1 text-black/70">Report an infrastructure issue in your area</p>
      </div>

      <div className="bg-white card-brutal-lg rounded-2xl p-6 space-y-6">
        {/* Category Selection */}
        <div>
          <label className="font-bold text-xs uppercase tracking-widest block mb-3">Select Category *</label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 text-center transition-all ${
                  category === cat.value
                    ? 'bg-brand-yellow border-black shadow-brutal-sm'
                    : 'bg-white border-black/20 hover:border-black'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[10px] font-extrabold uppercase leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-bold text-xs uppercase tracking-widest block mb-2">
            Describe the Issue * <span className="text-black/40 normal-case font-medium">(min. 20 characters)</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the infrastructure problem in detail. E.g., 'The road on Main Street has large potholes that have caused 3 accidents this month...'"
            rows={5}
            maxLength={2000}
            className="w-full border-2 border-black rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs font-medium text-black/40">{description.length}/2000</span>
          </div>
        </div>

        {/* Location & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-xs uppercase tracking-widest block mb-2">Location / Area *</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g., Kalahandi, Odisha"
              maxLength={100}
              className="w-full border-2 border-black rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="font-bold text-xs uppercase tracking-widest block mb-2">Language of Submission</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full border-2 border-black rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white appearance-none"
            >
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="font-bold text-xs uppercase tracking-widest block mb-2">Photo Evidence (Optional)</label>
          <input
            type="file"
            ref={fileRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative border-2 border-black rounded-xl overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="absolute top-2 right-2 w-8 h-8 bg-black text-white border-2 border-black rounded-lg font-extrabold text-sm hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-black/40 rounded-xl p-8 text-center hover:bg-brand-sage/30 transition-colors group"
            >
              <div className="text-4xl mb-2">📷</div>
              <p className="font-bold text-sm">Click to upload a photo</p>
              <p className="text-xs text-black/50 font-medium mt-1">JPG, PNG, WEBP — max 5 MB</p>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAnalyze}
          disabled={description.trim().length < 20 || !location.trim()}
          className="btn-brutal-primary w-full py-4 rounded-xl text-base font-extrabold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze with AI →
        </button>
        {description.trim().length < 20 && description.trim().length > 0 && (
          <p className="text-center text-xs font-bold text-red-600">
            ⚠ Please provide at least 20 characters in your description.
          </p>
        )}
      </div>
    </div>
  );
}
