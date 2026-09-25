import { useState } from 'react';
import { MapPin, Search, Check, Navigation, X } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (locationString: string, coords?: { lat: number; lng: number }) => void;
  initialLocation?: string;
}

const PRESET_LOCATIONS = [
  { name: 'Kalahandi, Bhawanipatna Zone 4', district: 'Kalahandi', lat: 19.904, lng: 82.802, status: 'High Demand' },
  { name: 'Koraput, Jeypore Main Road', district: 'Koraput', lat: 18.812, lng: 82.713, status: 'Active Hotspot' },
  { name: 'Malkangiri, Block B Hospital Rd', district: 'Malkangiri', lat: 18.343, lng: 81.895, status: 'Critical Area' },
  { name: 'Rayagada, Gunupur Junction', district: 'Rayagada', lat: 19.167, lng: 83.416, status: 'Moderate' },
  { name: 'Nuapada, Khariar Road Market', district: 'Nuapada', lat: 20.401, lng: 82.521, status: 'Moderate' },
  { name: 'Bhubaneswar, Nayapalli Sector 3', district: 'Bhubaneswar', lat: 20.296, lng: 85.824, status: 'Active Hotspot' },
  { name: 'Cuttack, Badambadi Bus Stand Area', district: 'Cuttack', lat: 20.462, lng: 85.882, status: 'High Demand' },
  { name: 'Bolangir, Titilagarh Chowk', district: 'Bolangir', lat: 20.715, lng: 83.489, status: 'Normal' },
];

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialLocation = '',
}: LocationPickerModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(PRESET_LOCATIONS[0]);
  const [customText, setCustomText] = useState(initialLocation);

  if (!isOpen) return null;

  const filtered = PRESET_LOCATIONS.filter(
    l => l.name.toLowerCase().includes(search.toLowerCase()) || l.district.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    const locText = customText.trim() || selected.name;
    onSelectLocation(locText, { lat: selected.lat, lng: selected.lng });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white card-brutal-xl rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-brand-yellow p-4 md:p-5 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-black border-2 border-black rounded-lg flex items-center justify-center text-brand-yellow">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg leading-tight">SELECT ISSUE LOCATION</h3>
              <p className="text-xs font-bold text-black/60">Pinpoint coordinates and district block</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center font-extrabold hover:bg-black hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Custom Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Specific Address / Landmark Description
            </label>
            <input
              type="text"
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="e.g. Near Panchayat Office, Block 4, Ward 12"
              className="w-full border-2 border-black rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Interactive Mock Map Canvas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">Interactive Geographic Grid</span>
              <span className="text-[11px] font-mono font-bold text-black/60">
                GPS: {selected.lat.toFixed(4)}° N, {selected.lng.toFixed(4)}° E
              </span>
            </div>

            <div className="relative bg-slate-900 border-2 border-black rounded-xl h-52 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Grid Lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(#ffe17c 1px, transparent 1px), linear-gradient(90deg, #ffe17c 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Geographic Contour Mock Circles */}
              <div className="absolute w-72 h-72 rounded-full border border-brand-yellow/30 animate-pulse" />
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-brand-yellow/50" />

              {/* Map Hotspot Pins */}
              {PRESET_LOCATIONS.map((loc, idx) => {
                const isCurrent = selected.name === loc.name;
                const top = 25 + (idx * 27) % 55;
                const left = 15 + (idx * 31) % 70;
                return (
                  <button
                    key={loc.name}
                    onClick={() => {
                      setSelected(loc);
                      setCustomText(loc.name);
                    }}
                    style={{ top: `${top}%`, left: `${left}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
                      isCurrent ? 'scale-125 z-20' : 'scale-90 hover:scale-110 z-10'
                    }`}
                    title={loc.name}
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-black font-extrabold text-[10px] shadow-brutal-sm whitespace-nowrap ${
                        isCurrent ? 'bg-brand-yellow text-black ring-2 ring-white' : 'bg-white text-black'
                      }`}
                    >
                      <MapPin size={10} className={isCurrent ? 'text-black fill-black' : 'text-red-500'} />
                      <span>{loc.district}</span>
                    </div>
                  </button>
                );
              })}

              <div className="absolute bottom-2 left-3 bg-black/80 backdrop-blur-xs border border-white/20 px-2.5 py-1 rounded-md text-[10px] font-mono text-brand-yellow">
                ● Live GIS Telemetry Active
              </div>
            </div>
          </div>

          {/* District Quick Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Recommended BRICS / Odisha Locations</span>
              <div className="relative w-48">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter district..."
                  className="w-full pl-7 pr-2 py-1 bg-gray-50 border-2 border-black rounded-lg text-xs font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto scrollbar-thin pr-1">
              {filtered.map(loc => {
                const isSelected = selected.name === loc.name;
                return (
                  <button
                    key={loc.name}
                    onClick={() => {
                      setSelected(loc);
                      setCustomText(loc.name);
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left flex items-start justify-between gap-2 transition-all ${
                      isSelected
                        ? 'bg-brand-yellow border-black shadow-brutal-sm'
                        : 'bg-white border-black/20 hover:border-black'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs leading-snug">{loc.name}</p>
                      <p className="text-[10px] font-bold text-black/50 mt-0.5">{loc.district} District</p>
                    </div>
                    {isSelected && <Check size={14} className="shrink-0 text-black mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 border-t-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-black/70">
            <Navigation size={14} className="text-black" />
            <span>Selected: {customText.trim() || selected.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-brutal-secondary px-4 py-2 text-xs rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="btn-brutal-primary px-5 py-2 text-xs rounded-xl font-extrabold"
            >
              Confirm Location &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
