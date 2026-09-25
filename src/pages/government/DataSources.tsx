import { Database, CheckCircle, ArrowRight } from 'lucide-react';
import { MOCK_DATA_SOURCES } from '../../data/mockData';
import { useCitizenRequests } from '../../services/requestService';

const PIPELINE_STEPS = [
  { label: 'Multilingual Ingestion', desc: 'Voice logs (Odia/Hindi), text grievances, field surveys', number: '01' },
  { label: 'AI Whisper & NLP', desc: 'Dialect translation, entity tagging, severity scoring', number: '02' },
  { label: 'Spatial Data Fusion', desc: 'Merging citizen feedback with census GIS demographic density', number: '03' },
  { label: 'Explainable Prioritization', desc: '5-factor weighted algorithm computing hotspot index', number: '04' },
  { label: 'Policy Action', desc: 'Automated project generation & MP decision support', number: '05' },
];

export default function DataSources() {
  const { requests } = useCitizenRequests();

  const dataSources = MOCK_DATA_SOURCES.map(ds => {
    if (ds.id === 'ds-1') {
      return {
        ...ds,
        recordCount: requests.length,
      };
    }
    return ds;
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-brand-yellow card-brutal rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal-sm text-xs font-extrabold uppercase tracking-wider mb-2">
            <Database size={13} />
            Unified Data Architecture
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
            TELEMETRY & DATA SOURCES
          </h1>
          <p className="font-medium text-sm text-black/75 mt-1">
            How JanSetu aggregates primary citizen feedback, satellite ground-truth indices, and census registries.
          </p>
        </div>

        <div className="p-3 bg-black text-brand-yellow border-2 border-black rounded-xl text-xs font-mono font-bold">
          ● 4 Primary Ingestion Channels Active
        </div>
      </div>

      {/* Intelligence Pipeline Flow Banner */}
      <div className="bg-brand-charcoal text-white card-brutal-lg rounded-3xl p-6 md:p-8 space-y-6">
        <div className="pb-3 border-b border-white/20 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-brand-yellow">JANSETU DATA INTELLIGENCE PIPELINE</h3>
            <p className="text-xs font-bold text-brand-sage mt-0.5">End-to-end evidence-based governance workflow</p>
          </div>
          <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-lg text-white">BRICS Standard</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.label} className="p-4 bg-white/10 border-2 border-white/20 rounded-2xl space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-xs text-brand-yellow">STEP {step.number}</span>
                {i < PIPELINE_STEPS.length - 1 && (
                  <ArrowRight size={14} className="text-white/40 hidden lg:block" />
                )}
              </div>
              <h4 className="font-heading font-extrabold text-sm text-white">{step.label}</h4>
              <p className="text-[11px] font-bold text-brand-sage leading-snug">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {dataSources.map(source => (
          <div key={source.id} className="bg-white card-brutal-lg rounded-3xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 bg-brand-yellow border-2 border-black rounded-2xl flex items-center justify-center text-2xl shadow-brutal-sm">
                  {source.icon === 'users' ? '👥' : source.icon === 'bar-chart' ? '📊' : source.icon === 'building' ? '🛰️' : '💰'}
                </div>
                <span className="px-2.5 py-1 bg-black text-white rounded-lg text-[10px] font-extrabold uppercase">
                  {source.type}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-xl text-black">{source.name}</h3>
                <p className="text-xs font-medium text-black/80 mt-1 leading-relaxed">{source.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs font-bold text-black/70">
              <span className="flex items-center gap-1">
                <CheckCircle size={13} className="text-emerald-600" />
                <span>{source.recordCount.toLocaleString()} Records</span>
              </span>
              <span className="font-mono text-[11px] text-black/50">Updated: {source.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Section */}
      <div className="bg-white card-brutal rounded-3xl p-6 md:p-8 space-y-4">
        <h3 className="font-heading font-extrabold text-xl">METHODOLOGY: DATA FUSION ARCHITECTURE</h3>
        <p className="text-xs font-medium text-black/80 leading-relaxed max-w-3xl">
          JanSetu fuses unstructured citizen voice recordings with demographic census records and public expenditure datasets. This enables policy makers to evaluate civic requests not in isolation, but contextualized against regional infrastructure indices and population vulnerability.
        </p>
      </div>
    </div>
  );
}
