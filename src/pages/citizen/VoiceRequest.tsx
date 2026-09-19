import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Send, CheckCircle, ChevronDown, Brain, Volume2, Globe } from 'lucide-react';
import { authService } from '../../services/authService';
import { requestService } from '../../services/requestService';
import { aiService } from '../../services/aiService';
import type { AIAnalysis } from '../../types';

const LANGUAGES = [
  { key: 'odia', label: 'Odia', sample: 'ଆମ ଗାଁକୁ ଭଲ ରାସ୍ତା ନାହିଁ।' },
  { key: 'hindi', label: 'Hindi', sample: 'हमारे गांव में साफ पानी नहीं है।' },
  { key: 'bengali', label: 'Bengali', sample: 'আমাদের গ্রামে বিদ্যুৎ নেই।' },
  { key: 'tamil', label: 'Tamil', sample: 'எங்கள் கிராமத்தில் சாலை இல்லை.' },
];

type VoiceStep = 'idle' | 'recording' | 'transcribing' | 'analyzing' | 'result' | 'success';

export default function VoiceRequest() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser()!;
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [step, setStep] = useState<VoiceStep>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = () => {
    setStep('recording');
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(t => {
        if (t >= 10) {
          stopRecording();
          return t;
        }
        return t + 1;
      });
    }, 1000);
  };

  const stopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep('transcribing');

    await new Promise(r => setTimeout(r, 1500));
    setTranscription(selectedLang.sample);
    setStep('analyzing');

    const result = await aiService.analyzeVoice(selectedLang.key);
    setTranslation(result.translation);
    setAiResult(result.analysis);
    setStep('result');
  };

  const handleSubmit = () => {
    if (!aiResult) return;
    requestService.create(
      user.id,
      aiResult.category,
      translation || transcription,
      user.location,
      selectedLang.label,
      undefined,
      aiResult,
      true,
      transcription
    );
    setStep('success');
  };

  const reset = () => {
    setStep('idle');
    setRecordingTime(0);
    setTranscription('');
    setTranslation('');
    setAiResult(null);
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-center space-y-4 py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Voice Request Submitted!</h2>
        <p className="text-slate-500 text-sm max-w-xs">Your voice request has been transcribed, translated, analyzed and submitted.</p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/citizen/requests')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            View My Requests
          </button>
          <button onClick={reset} className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
            Record Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Voice Request</h2>
        <p className="text-slate-500 text-sm mt-0.5">Speak in your language — AI will transcribe and analyze</p>
      </div>

      {/* Language Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Your Language</label>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.key}
              onClick={() => { setSelectedLang(lang); if (step !== 'idle') reset(); }}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
                selectedLang.key === lang.key
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recording Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
        {step === 'idle' && (
          <div className="space-y-4">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Mic size={40} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Ready to Record</h3>
              <p className="text-sm text-slate-500 mt-1">Tap the button and speak clearly in {selectedLang.label}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-left">
              <p className="text-xs text-slate-500 mb-1">Example phrase:</p>
              <p className="text-sm text-slate-700 font-medium">{selectedLang.sample}</p>
            </div>
            <button
              onClick={startRecording}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2 mx-auto"
            >
              <Mic size={18} />
              Start Recording
            </button>
          </div>
        )}

        {step === 'recording' && (
          <div className="space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <Mic size={40} className="text-red-600" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-50" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Recording...</h3>
              <p className="text-3xl font-mono font-bold text-red-600 mt-1">{recordingTime}s</p>
            </div>
            <div className="flex gap-2 justify-center">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-red-400 rounded-full animate-bounce"
                  style={{
                    height: `${12 + Math.sin(i * 1.5) * 8}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
            <button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 mx-auto"
            >
              <Square size={18} />
              Stop Recording
            </button>
          </div>
        )}

        {(step === 'transcribing' || step === 'analyzing') && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto relative">
              <Brain size={28} className="text-blue-600" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                {step === 'transcribing' ? 'Transcribing Audio...' : 'AI Analyzing...'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {step === 'transcribing' ? 'Converting speech to text in ' + selectedLang.label : 'Detecting category, severity and generating summary'}
              </p>
            </div>
            <div className="space-y-2 text-left max-w-xs mx-auto">
              {[
                { label: 'Speech Recognition', done: step === 'analyzing' || step === 'result' },
                { label: 'Language Detection', done: step === 'analyzing' || step === 'result' },
                { label: 'Translation', done: step === 'result' },
                { label: 'AI Classification', done: step === 'result' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? 'bg-green-500' : 'bg-slate-200'}`}>
                    {item.done && <CheckCircle size={10} className="text-white" />}
                  </div>
                  <span className={`text-xs ${item.done ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result */}
      {step === 'result' && aiResult && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-purple-600 px-4 py-3 flex items-center justify-between">
              <span className="text-white font-semibold text-sm flex items-center gap-2">
                <Brain size={15} />
                Voice Analysis Complete
              </span>
              <span className="text-purple-200 text-xs">Confidence: {Math.round(aiResult.confidence * 100)}%</span>
            </div>
            <div className="p-4 space-y-3">
              {/* Transcription */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 size={14} className="text-slate-500" />
                  <p className="text-xs font-medium text-slate-600">Original Transcription ({selectedLang.label})</p>
                </div>
                <p className="text-sm text-slate-800 font-medium">{transcription}</p>
              </div>

              {/* Translation */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={14} className="text-slate-500" />
                  <p className="text-xs font-medium text-slate-600">English Translation</p>
                </div>
                <p className="text-sm text-slate-800">{translation}</p>
              </div>

              {/* Category & Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-600 mb-1">Category</p>
                  <p className="font-semibold text-sm text-blue-800">{aiResult.category}</p>
                </div>
                <div className={`rounded-xl p-3 border ${
                  aiResult.severity === 'high' || aiResult.severity === 'critical'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <p className="text-xs text-orange-600 mb-1">Severity</p>
                  <p className="font-semibold text-sm text-orange-800 capitalize">{aiResult.severity}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                <p className="text-xs text-purple-600 font-medium mb-1">AI Summary</p>
                <p className="text-sm text-slate-700">{aiResult.summary}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors">
              Record Again
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Submit Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
