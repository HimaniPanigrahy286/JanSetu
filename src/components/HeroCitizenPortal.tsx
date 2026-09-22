import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services/requestService';

export default function HeroCitizenPortal() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, processing: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live data from backend service
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simulating API call latency
        await new Promise(r => setTimeout(r, 600));
        const allRequests = requestService.getAll();
        
        setStats({
          total: allRequests.length,
          processing: allRequests.filter(r => r.status === 'in_progress' || r.status === 'under_review').length,
          resolved: allRequests.filter(r => r.status === 'resolved').length,
        });
      } catch (error) {
        console.error("Failed to load hero stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="relative">
      <div className="bg-white border-2 border-black rounded-2xl shadow-brutal-xl overflow-hidden">
        {/* Browser Header Bar */}
        <div className="bg-black px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
          </div>
          <span className="text-white font-mono text-xs">jansetu.brics.gov/portal/quick-actions</span>
          <div className="w-12"></div>
        </div>

        {/* Interactive Dashboard Content */}
        <div className="p-6 bg-gray-50 space-y-5">
          {/* User Header Card */}
          <div className="p-4 bg-brand-yellow border-2 border-black rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-black/70">Welcome to JanSetu</div>
              <div className="font-heading font-extrabold text-xl">Citizen Infrastructure Portal</div>
            </div>
            <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg whitespace-nowrap">
              Public Access
            </span>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="p-3 bg-brand-sage border-2 border-black rounded-xl text-left hover:bg-brand-yellow transition-colors shadow-brutal-sm group"
            >
              <div className="font-heading font-extrabold text-lg group-hover:underline">Login / Register &rarr;</div>
              <div className="text-xs font-bold text-black/70">Access your account</div>
            </button>
            <button 
              onClick={() => navigate('/citizen/requests')}
              className="p-3 bg-white border-2 border-black rounded-xl text-left hover:bg-brand-yellow transition-colors shadow-brutal-sm group"
            >
              <div className="font-heading font-extrabold text-lg group-hover:underline">Track Status &rarr;</div>
              <div className="text-xs font-bold text-black/70">View your requests</div>
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="col-span-2 p-3 bg-white border-2 border-black rounded-xl text-center hover:bg-brand-yellow transition-colors shadow-brutal-sm"
            >
              <div className="font-heading font-extrabold text-lg">Contact Support / Grievance Officer</div>
            </button>
          </div>

          {/* Live Request Counters */}
          <div className="p-4 bg-brand-charcoal border-2 border-black rounded-xl text-white">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-yellow mb-3 text-center">
              Platform Activity (Live)
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-16">
                <span className="animate-pulse font-mono text-sm">Synchronizing Data...</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="font-heading font-extrabold text-3xl">{stats.total}</div>
                  <div className="text-[10px] font-bold uppercase text-gray-400">Total Logged</div>
                </div>
                <div className="text-center border-l-2 border-gray-600">
                  <div className="font-heading font-extrabold text-3xl text-brand-yellow">{stats.processing}</div>
                  <div className="text-[10px] font-bold uppercase text-brand-yellow/80">In Processing</div>
                </div>
                <div className="text-center border-l-2 border-gray-600">
                  <div className="font-heading font-extrabold text-3xl text-brand-sage">{stats.resolved}</div>
                  <div className="text-[10px] font-bold uppercase text-brand-sage/80">Resolved</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
