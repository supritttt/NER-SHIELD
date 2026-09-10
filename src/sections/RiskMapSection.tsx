import { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  CloudRain, 
  Activity, 
  Truck, 
  Maximize2,
  Radio
} from 'lucide-react';
import { NER_STATES } from '../data/landingData';

interface RiskMapSectionProps {
  onOpenFullGIS?: () => void;
}

export function RiskMapSection({ onOpenFullGIS }: RiskMapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Filter Layer States
  const [layers, setLayers] = useState({
    flood: true,
    landslide: true,
    roadConditions: true,
    weather: true,
    accessibility: true,
    emergencyRoutes: true,
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Centered at [25.8, 93.2] or India view [25.11, 80.77] zoom 6
    const map = L.map(mapRef.current, {
      center: [25.8, 93.2],
      zoom: 6,
      zoomControl: true,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Standard OpenStreetMap Tile Layer as requested
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // 1. Doppler Radar Pulse Rings over High Precipitation Corridors
    const radarRings = [
      { center: [25.467, 91.3662] as [number, number], radius: 110000, color: '#d97706', fill: '#f59e0b' }, // Meghalaya rain belt
      { center: [27.5, 94.5] as [number, number], radius: 130000, color: '#0284c7', fill: '#0ea5e9' },       // Upper Assam & Arunachal valley
      { center: [27.533, 88.5122] as [number, number], radius: 80000, color: '#dc2626', fill: '#ef4444' },   // Sikkim Teesta basin
      { center: [24.8, 93.0] as [number, number], radius: 90000, color: '#059669', fill: '#10b981' },        // Barak valley
    ];

    radarRings.forEach((r) => {
      L.circle(r.center, {
        radius: r.radius,
        color: r.color,
        weight: 2,
        opacity: 0.85,
        fillColor: r.fill,
        fillOpacity: 0.15,
      }).addTo(map);
    });

    // 2. Radar Station Markers for each NE State
    NER_STATES.forEach((st) => {
      const marker = L.circleMarker([st.center[0], st.center[1]], {
        radius: 8,
        fillColor: '#0284c7',
        fillOpacity: 1,
        color: '#ffffff',
        weight: 2,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 200px; padding: 4px; color: #0f172a;">
          <div style="font-size: 13px; font-weight: 700;">${st.name} Radar Telemetry</div>
          <div style="font-size: 11px; color: #0284c7; font-weight: 600; margin-bottom: 4px;">Station: ${st.capital}</div>
          <div style="font-size: 11px; color: #334155; line-height: 1.4; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            <strong>Hazard Profile:</strong> ${st.keyChallenge}
          </div>
        </div>
      `);
    });

    // 3. Arterial Radar Vectors
    // Guwahati - Shillong (Safe/Cyan)
    L.polyline([
      [26.1445, 91.7362],
      [25.85, 91.82],
      [25.5788, 91.8933]
    ], {
      color: '#0284c7',
      weight: 4,
      opacity: 0.9,
    }).addTo(map);

    // Guwahati - Dibrugarh (NH-715 / Emerald)
    L.polyline([
      [26.1445, 91.7362],
      [26.35, 92.68],
      [26.75, 94.21],
      [27.4728, 94.912]
    ], {
      color: '#059669',
      weight: 4,
      opacity: 0.85,
    }).addTo(map);

    // Silchar - Aizawl (Amber mudslide risk)
    L.polyline([
      [24.8333, 92.7789],
      [24.2, 92.75],
      [23.7271, 92.7176]
    ], {
      color: '#d97706',
      weight: 4,
      opacity: 0.85,
    }).addTo(map);

    // Imphal - Kohima (Amber)
    L.polyline([
      [24.817, 93.9368],
      [25.3, 94.05],
      [25.6751, 94.1086]
    ], {
      color: '#d97706',
      weight: 4,
      opacity: 0.85,
    }).addTo(map);

    // Gangtok - North Sikkim (Red - Flash flood/Washout)
    L.polyline([
      [27.3389, 88.6065],
      [27.65, 88.62],
      [27.95, 88.65]
    ], {
      color: '#dc2626',
      weight: 4,
      opacity: 0.95,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleFocusState = (stateName: string) => {
    const st = NER_STATES.find((s) => s.name === stateName);
    if (st && mapInstanceRef.current) {
      setSelectedState(stateName);
      mapInstanceRef.current.flyTo([st.center[0], st.center[1]], 8, { duration: 1.2 });
    }
  };

  const handleResetView = () => {
    setSelectedState(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([25.8, 93.2], 6, { duration: 1.0 });
    }
  };

  return (
    <section id="risk-map" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
              OpenStreetMap Doppler Radar & Precipitation Intelligence
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              See Accessibility & Storm Radars Across the North East.
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-3xl">
              High-resolution spatial radar model powered by OpenStreetMap tracking atmospheric precipitation cells, mountain cloudburst warnings, and road connectivity across all 8 North Eastern states.
            </p>
          </div>

          {onOpenFullGIS && (
            <button
              onClick={onOpenFullGIS}
              className="ner-btn-secondary px-5 py-2.5 text-sm font-semibold flex items-center gap-2 self-start md:self-auto shadow-sm"
            >
              <Maximize2 className="w-4 h-4 text-slate-500" />
              <span>Full Screen Radar Console</span>
            </button>
          )}
        </div>

        {/* State Quick Navigation Filter Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3.5 mb-5 scrollbar-none">
          <button
            onClick={handleResetView}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedState === null
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All 8 States
          </button>
          {NER_STATES.map((st) => (
            <button
              key={st.name}
              onClick={() => handleFocusState(st.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedState === st.name
                  ? 'bg-blue-700 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>

        {/* Interactive Radar Map Card */}
        <div className="relative w-full h-[540px] sm:h-[640px] lg:h-[720px] rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 shadow-xl">
          
          {/* OpenStreetMap DOM */}
          <div ref={mapRef} className="w-full h-full min-h-[540px] sm:min-h-[640px] lg:min-h-[720px] z-0" />

          {/* Floating Control: Layer Toggles (Top Left) */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg max-w-[260px]">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-blue-600" />
              Radar Telemetry Layers
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'flood', label: 'Doppler Flood Reflectivity', icon: CloudRain, color: 'text-blue-600' },
                { key: 'landslide', label: 'Soil Saturation Indexes', icon: AlertTriangle, color: 'text-amber-600' },
                { key: 'roadConditions', label: 'Arterial Road Integrity', icon: Activity, color: 'text-emerald-600' },
                { key: 'weather', label: 'IMD Storm Cells (50+ dBZ)', icon: CloudRain, color: 'text-indigo-600' },
                { key: 'accessibility', label: 'Isochrone Access Score', icon: ShieldCheck, color: 'text-blue-700' },
                { key: 'emergencyRoutes', label: 'Emergency Evacuation Paths', icon: Truck, color: 'text-rose-600' },
              ].map((layer) => {
                const Icon = layer.icon;
                const isChecked = layers[layer.key as keyof typeof layers];
                return (
                  <label
                    key={layer.key}
                    className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleLayer(layer.key as keyof typeof layers)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 bg-white"
                    />
                    <Icon className={`w-4 h-4 ${layer.color}`} />
                    <span className="text-xs text-slate-700 select-none font-medium">{layer.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Floating Radar Legend (Bottom Right) */}
          <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg text-xs space-y-2 max-w-[240px]">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              Doppler Hazard Key
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-4 h-1 bg-blue-600 rounded-sm shadow-[0_0_4px_#2563eb]" />
              <span>Safe Corridor (Low Saturation)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-4 h-1 bg-amber-500 rounded-sm" />
              <span>Precipitation Alert (&gt;35 mm/h)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-4 h-1 bg-red-500 rounded-sm shadow-[0_0_4px_#ef4444]" />
              <span>Active Washout / Slope Failure</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-4 h-1 bg-emerald-500 rounded-sm shadow-[0_0_4px_#10b981]" />
              <span>AI Recommended Dynamic Path</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
