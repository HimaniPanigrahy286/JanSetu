import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, Image, MapPin, Globe, ChevronDown, Loader2, CheckCircle, AlertTriangle, Zap, Brain } from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';
import { aiService } from '../../services/aiService';
import type { Category, AIAnalysis } from '../../types';

const CATEGORIES: Category[] = [
  'Roads', 'Water', 'Electricity', 'Healthcare', 'Education',
  'Transport', 'Sanitation', 'Digital Infrastructure', 'Public Facilities'
];

const LANGUAGES = ['English', 'Hindi', 'Odia', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'];

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-700 bg-red-50 border-red-200', label: 'Critical', icon: '🔴' },
  high: { color: 'text-orange-700 bg-orange-50 border-orange-200', label: 'High', icon: '🟠' },
  medium: { color: 'text-yellow-700 bg-yellow-50 border-yellow-200', label: 'Medium', icon: '🟡' },
  low: { color: 'text-green-700 bg-green-50 border-green-200', label: 'Low', icon: '🟢' },
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
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setStep('analyzing');
    setAnalysisProgress(0);

    // Simulate progress
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
    requestService.create(
      user.id,
      category,
      description,
      location,
      language,
      imagePreview || undefined,
      aiResult
    );
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-center space-y-4 py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Request Submitted!</h2>
        <p className="text-slate-500 text-sm max-w-xs">
          Your request has been recorded and will be reviewed by the concerned authorities.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/citizen/requests')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View My Requests
          </button>
          <button
            onClick={() => { setStep('form'); setDescription(''); setAiResult(null); setImagePreview(null); }}
            className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 py-12 space-y-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center relative">
          <Brain size={36} className="text-blue-600" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">AI Analysis in Progress</h2>
          <p className="text-slate-500 text-sm mt-1">Analyzing your request with Gemini AI...</p>
        </div>
        <div className="w-full max-w-xs space-y-3">
          {[
            { label: 'Language Detection', done: analysisProgress > 20 },
            { label: 'Translation & NLP', done: analysisProgress > 50 },
            { label: 'Category Classification', done: analysisProgress > 70 },
            { label: 'Severity Assessment', done: analysisProgress > 90 },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-green-500' : 'bg-slate-200'}`}>
                {item.done && <CheckCircle size={12} className="text-white" />}
              </div>
              <p className={`text-sm ${item.done ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>{item.label}</p>
            </div>
          ))}
        </div>
        <div className="w-full max-w-xs">
          <div className="bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(analysisProgress, 100)}%` }}
            />
          </div>
          <p className="text-center text-xs text-slate-500 mt-1">{Math.round(Math.min(analysisProgress, 100))}%</p>
        </div>
      </div>
    );
  }

  if (step === 'result' && aiResult) {
    const sev = SEVERITY_CONFIG[aiResult.severity];
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Brain size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">AI Analysis Result</h2>
            <p className="text-xs text-slate-500">Powered by Gemini AI</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Analysis Complete</span>
            <span className="text-blue-200 text-xs">Confidence: {Math.round(aiResult.confidence * 100)}%</span>
          </div>

          <div className="p-4 space-y-4">
            {/* Language */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Detected Language</p>
                <p className="font-semibold text-slate-800 text-sm">{aiResult.detectedLanguage}</p>
              </div>
              <div className={`rounded-xl p-3 border ${sev.color}`}>
                <p className="text-xs opacity-70 mb-1">Severity</p>
                <p className="font-semibold text-sm">{sev.icon} {sev.label}</p>
              </div>
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <p className="font-semibold text-slate-800 text-sm">{aiResult.category}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Subcategory</p>
                <p className="font-semibold text-slate-800 text-sm">{aiResult.subcategory}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-xs text-blue-600 font-medium mb-1.5 flex items-center gap-1">
                <Zap size={12} />
                AI Summary
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{aiResult.summary}</p>
            </div>

            {/* Translation */}
            {aiResult.detectedLanguage !== 'English' && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1.5">Translation</p>
                <p className="text-xs text-slate-500 italic">{aiResult.originalText}</p>
                <div className="border-t border-slate-200 mt-2 pt-2">
                  <p className="text-sm text-slate-700">{aiResult.translatedText}</p>
                </div>
              </div>
            )}

            {/* Keywords */}
            <div>
              <p className="text-xs text-slate-500 mb-2">Key Terms Identified</p>
              <div className="flex flex-wrap gap-1.5">
                {aiResult.keywords.map(k => (
                  <span key={k} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep('form')}
            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
          >
            Edit Request
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Send size={16} />
            Submit Request
          </button>
        </div>
      </div>
    );
  }

  // Form step
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Submit a Request</h2>
        <p className="text-slate-500 text-sm mt-0.5">Report any infrastructure issue in your area</p>
      </div>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the infrastructure problem in detail. You can write in any language..."
            rows={4}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-slate-400">AI will analyze your description automatically</p>
            <p className="text-xs text-slate-400">{description.length}/500</p>
          </div>
        </div>

        {/* Example */}
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium mb-1">💡 Example</p>
          <button
            onClick={() => setDescription('There is no proper road connecting our village to the nearest hospital. During monsoon, it becomes completely inaccessible.')}
            className="text-xs text-blue-700 hover:underline text-left"
          >
            "There is no proper road connecting our village to the nearest hospital."
          </button>
        </div>

        {/* Location & Language */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPin size={13} className="inline mr-1" />
              Location
            </label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Globe size={13} className="inline mr-1" />
              Language
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-3 text-slate-800 text-sm appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Photo Evidence (Optional)</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
            ) : (
              <>
                <Image size={24} className="text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">Tap to upload photo</p>
                <p className="text-xs text-slate-400 mt-0.5">JPG, PNG up to 10MB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        {/* Submit */}
        <button
          onClick={handleAnalyze}
          disabled={!description.trim()}
          className="w-full bg-blue-600 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Brain size={18} />
          Analyze & Submit with AI
        </button>
      </div>
    </div>
  );
}
