import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowRight,
  Shield,
  Users,
  Brain,
  MapPin,
  BarChart3,
  Globe,
  CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2.5 rounded-xl">
              <Building2 size={25} />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                NexGen Governance
              </h1>
              <p className="text-xs text-blue-300">
                Digital Public Infrastructure
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-400 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition"
          >
            Sign In
            <ArrowRight size={17} />
          </button>

        </div>
      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">

          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-8">
              <Globe size={16} />
              Google Code for Communities • Track 1
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Building Better
              <span className="text-blue-400"> Infrastructure</span>
              <br />
              Through Citizen Voice
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mt-7 leading-relaxed">
              NexGen Governance is an AI-powered digital public
              infrastructure platform that connects citizens with
              government decision-makers and transforms public requests
              into meaningful infrastructure insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">

              <button
                onClick={() => navigate('/login')}
                className="bg-blue-500 hover:bg-blue-400 px-7 py-4 rounded-xl font-semibold flex items-center gap-3 transition shadow-lg shadow-blue-500/20"
              >
                Get Started
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById('features')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-white/15 hover:bg-white/5 px-7 py-4 rounded-xl font-semibold transition"
              >
                Explore Platform
              </button>

            </div>

          </div>
        </div>
      </section>


      {/* ================= STATS ================= */}
      <section className="border-y border-white/10 bg-white/[0.02]">

        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

          <div className="text-center">
            <Users className="mx-auto text-blue-400 mb-2" size={25} />
            <h3 className="text-2xl font-bold">Citizens</h3>
            <p className="text-sm text-slate-500">Voice & participation</p>
          </div>

          <div className="text-center">
            <Brain className="mx-auto text-blue-400 mb-2" size={25} />
            <h3 className="text-2xl font-bold">AI Powered</h3>
            <p className="text-sm text-slate-500">Smart analysis</p>
          </div>

          <div className="text-center">
            <MapPin className="mx-auto text-blue-400 mb-2" size={25} />
            <h3 className="text-2xl font-bold">Hotspots</h3>
            <p className="text-sm text-slate-500">Demand mapping</p>
          </div>

          <div className="text-center">
            <BarChart3 className="mx-auto text-blue-400 mb-2" size={25} />
            <h3 className="text-2xl font-bold">Insights</h3>
            <p className="text-sm text-slate-500">Data-driven decisions</p>
          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center max-w-3xl mx-auto mb-16">

          <p className="text-blue-400 font-medium mb-3">
            ONE PLATFORM
          </p>

          <h2 className="text-4xl font-bold">
            From Citizen Requests to Government Action
          </h2>

          <p className="text-slate-400 mt-4">
            A unified platform designed to collect public needs,
            analyze demand and support infrastructure planning.
          </p>

        </div>


        <div className="grid md:grid-cols-3 gap-6">

          {/* Citizen */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:border-blue-500/40 transition">

            <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
              <Users className="text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Citizen Requests
            </h3>

            <p className="text-slate-400 leading-relaxed mb-5">
              Citizens can submit infrastructure requests,
              complaints and development needs through a simple
              digital platform.
            </p>

            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex gap-2">
                <CheckCircle size={17} className="text-blue-400" />
                Submit requests
              </li>
              <li className="flex gap-2">
                <CheckCircle size={17} className="text-blue-400" />
                Voice-based requests
              </li>
              <li className="flex gap-2">
                <CheckCircle size={17} className="text-blue-400" />
                Track request status
              </li>
            </ul>

          </div>


          {/* AI */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:border-blue-500/40 transition">

            <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
              <Brain className="text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              AI Analysis
            </h3>

            <p className="text-slate-400 leading-relaxed mb-5">
              AI analyzes citizen feedback, demographic data and
              infrastructure indicators to identify important
              development needs.
            </p>

            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex gap-2">
                <CheckCircle size={17} className="text-blue-400" />
                Demand analysis
              </li>
              <li className="flex gap-2">
                <CheckCircle size={17} className="text-blue-400" />
                Priority identification
              </li>
              <li className="flex gap-2">
                <CheckCircle size={17} className="text-blue-400" />
                AI recommendations
              </li>
            </ul>

          </div>


          {/* Government */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:border-blue-500/40 transition">

            <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
              <Shield className="text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Government Dashboard
            </h3>

            <p className="text-slate-400 leading-relaxed mb-5">
              Government officials get a centralized view of
              requests, demand hotspots, projects and AI-generated
              recommendations.
            </p>

            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex gap-2">
                <CheckCircle size={17} className="text-blue-400" />
                Demand hotspots
              </li>
              <li className="flex gap-2">
                <CheckCircle size={17} className="text-blue-400" />
                Regional insights
              </li>
              <li className="flex gap-2">
                <CheckCircle size={17} className="text-blue-400" />
                Project monitoring
              </li>
            </ul>

          </div>

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white/[0.03] border-y border-white/10">

        <div className="max-w-6xl mx-auto px-6 py-24">

          <div className="text-center mb-14">

            <h2 className="text-4xl font-bold">
              How It Works
            </h2>

            <p className="text-slate-400 mt-3">
              Connecting public needs with informed planning
            </p>

          </div>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              ['01', 'Citizen Input', 'Citizens submit their infrastructure needs.'],
              ['02', 'Data Analysis', 'Requests and supporting data are analyzed.'],
              ['03', 'AI Insights', 'AI identifies demand hotspots and priorities.'],
              ['04', 'Government Action', 'Officials use insights for planning and projects.']
            ].map(([number, title, description]) => (

              <div
                key={number}
                className="relative bg-slate-900 border border-white/10 rounded-2xl p-6"
              >

                <span className="text-blue-400 font-bold text-sm">
                  {number}
                </span>

                <h3 className="font-semibold text-lg mt-3">
                  {title}
                </h3>

                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 border border-blue-500/20 rounded-3xl p-12">

          <h2 className="text-4xl font-bold">
            Ready to Make Public Infrastructure Smarter?
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto mt-4">
            Join the platform and help transform citizen needs into
            data-driven infrastructure planning.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="mt-8 bg-blue-500 hover:bg-blue-400 px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-3 transition"
          >
            Enter Platform
            <ArrowRight size={20} />
          </button>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-blue-400" />
            <span className="font-semibold">
              NexGen Governance
            </span>
          </div>

          <p className="text-sm text-slate-500">
            Google Code for Communities • Track 1 • 2026
          </p>

        </div>

      </footer>

    </div>
  );
}