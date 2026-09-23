import { useState } from 'react';
import { MapPin, ZoomIn, ZoomOut, Flame, Filter } from 'lucide-react';
import type { Hotspot } from '../../types';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';

interface MapHotspotsViewProps {
  hotspots: Hotspot[];
  selectedHotspot?: Hotspot | null;
  onSelectHotspot: (hotspot: Hotspot) => void;
  onProposeProject?: (hotspot: Hotspot) => void;
}

export default function MapHotspotsView({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onProposeProject,
}: MapHotspotsViewProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Filter hotspots
  const filteredHotspots = hotspots.filter(h => {
    if (activeCategory !== 'All' && h.category !== activeCategory) return false;
    return true;
  });

  const categories = ['All', 'Roads', 'Water', 'Drainage', 'Streetlights', 'Healthcare', 'Education'];

  return (
    <div className="bg-white card-brutal-lg rounded-2xl overflow-hidden flex flex-col lg:flex-row border-2 border-black min-h-[550px]">
      {/* Map Main Canvas Area */}
      <div className="flex-1 bg-brand-charcoal relative overflow-hidden flex flex-col justify-between p-4 select-none min-h-[380px]">
        {/* Map Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 z-20 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-heading font-extrabold text-xs text-brand-yellow uppercase tracking-wider">
              BRICS GIS Demand Heatmap
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                showHeatmap ? 'bg-brand-yellow text-black border-black' : 'bg-white/10 text-white border-white/20'
              }`}
            >
              <Flame size={12} />
              Heat Density
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 text-xs font-bold"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 text-xs font-bold"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        </div>

        {/* GIS Canvas Visual Representation */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Topographical Grid */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#ffe17c 1px, transparent 1px), linear-gradient(#ffe17c 0.5px, transparent 0.5px), linear-gradient(90deg, #ffe17c 0.5px, transparent 0.5px)',
              backgroundSize: '40px 40px, 20px 20px, 20px 20px',
            }}
          />

          {/* Regional Territory Outline Mock */}
          <svg className="w-[90%] h-[85%] opacity-35" viewBox="0 0 800 600" fill="none" stroke="#ffe17c" strokeWidth="1.5">
            <path d="M120 80 Q 250 50, 420 90 T 700 150 Q 750 320, 680 480 T 380 540 Q 180 500, 110 380 Z" fill="#171e19" />
            <path d="M220 180 Q 320 150, 450 180 T 600 300 Q 520 420, 350 440 Z" strokeDasharray="4 4" stroke="#b7c6c2" />
            <circle cx="400" cy="300" r="180" stroke="#ffe17c" strokeOpacity="0.2" />
            <circle cx="400" cy="300" r="120" stroke="#ffe17c" strokeOpacity="0.3" />
          </svg>

          {/* Hotspots Density Rings & Markers */}
          {filteredHotspots.map(spot => {
            const isSelected = selectedHotspot?.id === spot.id;
            // Map lat/lng roughly to percentage coordinates
            // lat: 18 - 21 -> 80% to 20%
            // lng: 81.5 - 86 -> 15% to 85%
            const topPct = 85 - ((spot.lat - 18.0) / 3.0) * 65;
            const leftPct = 15 + ((spot.lng - 81.5) / 5.0) * 70;

            const radiusPx = showHeatmap ? Math.min(120, spot.radius / 30) : 40;
            const isHigh = spot.priority === 'high';

            return (
              <div
                key={spot.id}
                style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                onClick={() => onSelectHotspot(spot)}
              >
                {/* Heatmap Glow Circle */}
                {showHeatmap && (
                  <div
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500 ${
                      isHigh
                        ? 'bg-red-500/25 border-2 border-red-500/60 animate-pulse'
                        : 'bg-brand-yellow/20 border-2 border-brand-yellow/50'
                    }`}
                    style={{
                      width: `${radiusPx * 2}px`,
                      height: `${radiusPx * 2}px`,
                      top: '50%',
                      left: '50%',
                    }}
                  />
                )}

                {/* Pin Node */}
                <div
                  className={`relative px-2.5 py-1.5 rounded-xl border-2 border-black flex items-center gap-1.5 transition-all duration-200 shadow-brutal-sm ${
                    isSelected
                      ? 'bg-brand-yellow text-black scale-110 ring-4 ring-white z-30'
                      : isHigh
                        ? 'bg-red-500 text-white hover:scale-105'
                        : 'bg-white text-black hover:scale-105'
                  }`}
                >
                  <MapPin size={13} className={isSelected ? 'text-black fill-black' : 'text-current'} />
                  <div className="flex flex-col text-left leading-none">
                    <span className="font-heading font-extrabold text-[11px] whitespace-nowrap">{spot.region}</span>
                    <span className="text-[9px] font-bold opacity-80 mt-0.5">{spot.requestCount} requests</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Legend Footer */}
        <div className="z-20 bg-black/85 backdrop-blur-md p-3 rounded-xl border border-white/20 flex flex-wrap items-center justify-between gap-3 text-white text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-white" />
              <span className="font-bold text-[11px]">High Severity Cluster</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-brand-yellow border border-black" />
              <span className="font-bold text-[11px]">Active Demand Node</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-brand-yellow font-bold">
            Showing {filteredHotspots.length} Concentrated Hotspots
          </div>
        </div>
      </div>

      {/* Right Sidebar Details & Hotspots List */}
      <div className="w-full lg:w-96 bg-gray-50 border-t-2 lg:border-t-0 lg:border-l-2 border-black flex flex-col justify-between">
        {/* Category & Priority Filters */}
        <div className="p-4 border-b-2 border-black space-y-2.5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-black/70 flex items-center gap-1">
              <Filter size={13} />
              Filter Hotspots
            </span>
            <span className="text-xs font-bold text-black">{filteredHotspots.length} Found</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-black text-white border-black shadow-brutal-sm'
                    : 'bg-white text-black border-black/20 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Hotspot Inspector OR Hotspots Queue */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[440px] scrollbar-thin">
          {selectedHotspot ? (
            <div className="bg-white card-brutal rounded-xl p-4 space-y-3.5">
              <div className="flex items-start justify-between gap-2 pb-2 border-b-2 border-black/10">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-black/50 tracking-wider">
                    Selected Demand Cluster
                  </span>
                  <h4 className="font-heading font-extrabold text-xl leading-tight">{selectedHotspot.name}</h4>
                  <p className="text-xs font-bold text-black/70">{selectedHotspot.region} Region</p>
                </div>
                <PriorityBadge priority={selectedHotspot.priority} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-brand-yellow border-2 border-black rounded-lg text-center">
                  <p className="font-heading font-extrabold text-2xl leading-none">{selectedHotspot.requestCount}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/70 mt-1">
                    Citizen Requests
                  </p>
                </div>
                <div className="p-2.5 bg-black text-white border-2 border-black rounded-lg text-center">
                  <p className="font-heading font-extrabold text-2xl text-brand-yellow leading-none">
                    {(selectedHotspot.affectedPopulation / 1000).toFixed(1)}k
                  </p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-sage mt-1">
                    Citizens Affected
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold py-1 border-b border-black/10">
                  <span className="text-black/60">Category:</span>
                  <CategoryBadge category={selectedHotspot.category} size="sm" />
                </div>
                <div className="flex justify-between font-bold py-1 border-b border-black/10">
                  <span className="text-black/60">Severity Index:</span>
                  <span className="text-red-700 font-extrabold">{selectedHotspot.severityScore} / 100</span>
                </div>
                <div className="flex justify-between font-bold py-1 border-b border-black/10">
                  <span className="text-black/60">Cluster Trend:</span>
                  <span className="font-extrabold text-emerald-700">{selectedHotspot.trend}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border-2 border-black rounded-lg text-xs font-medium leading-relaxed">
                <span className="font-bold text-black">AI Cluster Summary: </span>
                {selectedHotspot.summary}
              </div>

              {onProposeProject && (
                <button
                  onClick={() => onProposeProject(selectedHotspot)}
                  className="btn-brutal-primary w-full py-3 rounded-xl text-xs font-extrabold"
                >
                  Propose Infrastructure Project &rarr;
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-black/60 px-1">
                Top Identified Hotspots (Click to Inspect)
              </p>
              {filteredHotspots.map(h => (
                <div
                  key={h.id}
                  onClick={() => onSelectHotspot(h)}
                  className="p-3 bg-white card-brutal rounded-xl hover:bg-brand-yellow/30 transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate text-black">{h.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryBadge category={h.category} size="sm" />
                      <span className="text-[11px] font-bold text-black/60">{h.requestCount} complaints</span>
                    </div>
                  </div>
                  <PriorityBadge priority={h.priority} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
