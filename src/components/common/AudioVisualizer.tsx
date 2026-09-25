import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

interface AudioVisualizerProps {
  onRecordingComplete: (audioData: { duration: number; transcriptionSample?: string }) => void;
  onCancel?: () => void;
  selectedLanguage?: string;
}

export default function AudioVisualizer({
  onRecordingComplete,
  onCancel,
  selectedLanguage = 'Odia',
}: AudioVisualizerProps) {
  const [state, setState] = useState<'idle' | 'recording' | 'recorded' | 'playing'>('idle');
  const [duration, setDuration] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = () => {
    setState('recording');
    setDuration(0);
    timerRef.current = setInterval(() => {
      setDuration(prev => {
        if (prev >= 15) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState('recorded');
    onRecordingComplete({ duration: Math.max(duration, 3) });
  };

  const togglePlayback = () => {
    if (state === 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      setState('recorded');
    } else {
      setState('playing');
      setPlaybackTime(0);
      timerRef.current = setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= duration) {
            if (timerRef.current) clearInterval(timerRef.current);
            setState('recorded');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const resetRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState('idle');
    setDuration(0);
    setPlaybackTime(0);
    if (onCancel) onCancel();
  };

  return (
    <div className="bg-white card-brutal rounded-2xl p-5 md:p-6 text-center space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-yellow border-2 border-black rounded-lg flex items-center justify-center font-extrabold text-xs">
            🎤
          </div>
          <span className="font-heading font-extrabold text-sm uppercase">Multilingual Voice Recorder</span>
        </div>
        <span className="px-2.5 py-0.5 bg-black text-brand-yellow border-2 border-black rounded-md text-[10px] font-extrabold">
          Language: {selectedLanguage}
        </span>
      </div>

      {/* Main Recording Center */}
      <div className="py-3">
        {state === 'idle' && (
          <div className="space-y-3">
            <div className="w-20 h-20 bg-brand-yellow border-2 border-black rounded-full flex items-center justify-center mx-auto shadow-brutal hover:scale-105 transition-transform cursor-pointer" onClick={startRecording}>
              <Mic size={36} className="text-black" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-lg">Click to Record Voice Grievance</p>
              <p className="text-xs font-bold text-black/60 mt-0.5">
                Speak naturally in {selectedLanguage} about your infrastructure problem
              </p>
            </div>
            <button
              onClick={startRecording}
              className="btn-brutal-primary px-6 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-2"
            >
              <Mic size={14} />
              Start Recording &rarr;
            </button>
          </div>
        )}

        {state === 'recording' && (
          <div className="space-y-4">
            {/* Live Waveform Animation */}
            <div className="flex items-center justify-center gap-1.5 h-16 px-4 bg-brand-yellow/30 border-2 border-black rounded-xl">
              {[40, 65, 85, 30, 95, 75, 45, 90, 60, 80, 50, 95, 70, 40, 85, 60].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-black rounded-full animate-pulse"
                  style={{
                    height: `${Math.max(12, h * (0.4 + (i % 3) * 0.25))}px`,
                    animationDelay: `${(i * 0.08).toFixed(2)}s`,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span className="font-mono font-extrabold text-2xl text-red-600 tracking-wider">
                00:{duration < 10 ? `0${duration}` : duration} / 00:15
              </span>
            </div>

            <p className="text-xs font-bold text-black/70">Recording audio in {selectedLanguage}... Tap stop when done.</p>

            <button
              onClick={stopRecording}
              className="btn-brutal-primary bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-xs font-extrabold inline-flex items-center gap-2"
            >
              <Square size={14} />
              Stop Recording
            </button>
          </div>
        )}

        {(state === 'recorded' || state === 'playing') && (
          <div className="space-y-4">
            {/* Recorded Waveform State */}
            <div className="p-3 bg-gray-50 border-2 border-black rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Volume2 size={14} />
                  <span>Audio Captured: 00:{duration < 10 ? `0${duration}` : duration}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-500 px-2 py-0.5 rounded">
                  ✓ High Clarity
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-black/10 h-2.5 rounded-full border border-black/20 overflow-hidden">
                <div
                  className="bg-black h-full transition-all duration-300"
                  style={{ width: `${state === 'playing' ? (playbackTime / duration) * 100 : 100}%` }}
                />
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={togglePlayback}
                className="btn-brutal-secondary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                {state === 'playing' ? <Pause size={14} /> : <Play size={14} />}
                {state === 'playing' ? 'Pause Audio' : 'Listen Recording'}
              </button>
              <button
                onClick={resetRecording}
                className="btn-brutal-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-red-700"
              >
                <RotateCcw size={14} />
                Re-record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
