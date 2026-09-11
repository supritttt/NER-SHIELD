import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Radio, CloudRain } from 'lucide-react';

export function HeroMapPreview() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);

  // Animated radar sweep angle
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarSweepAngle((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if ((mapContainerRef.current as unknown as { _leaflet_id?: number })._leaflet_id) {
      delete (mapContainerRef.current as unknown as { _leaflet_id?: number })._leaflet_id;
    }

    // Center on coordinates covering India & North Eastern Region (zoom: 6, centered around [25.11, 80.77] or zoomed on NER)
    const center: [number, number] = [26.2, 92.6];

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Standard OpenStreetMap Tile Layer as requested
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // 1. Live Radar Range Circles (Precipitation & Doppler Coverage)
    const radarZones = [
      { center: [26.1445, 91.7362] as [number, number], radius: 95000, color: '#0284c7', fill: '#0ea5e9' }, // Guwahati Doppler
      { center: [25.5788, 91.8933] as [number, number], radius: 75000, color: '#d97706', fill: '#f59e0b' }, // Cherrapunji High Rain Radar
      { center: [27.097, 93.623] as [number, number], radius: 85000, color: '#dc2626', fill: '#ef4444' },   // Banderdewa Storm Cell
    ];

    radarZones.forEach((rz) => {
      L.circle(rz.center, {
        radius: rz.radius,
        color: rz.color,
        weight: 2,
        opacity: 0.85,
        fillColor: rz.fill,
        fillOpacity: 0.15,
      }).addTo(map);
    });

    // 2. AI Recommended Route (Glowing Cyan Vector)
    const aiPathCoordinates: [number, number][] = [
      [26.1445, 91.7362], // Guwahati
      [26.35, 92.15],
      [26.65, 92.79],     // Tezpur
      [26.98, 93.30],
      [27.097, 93.623]    // Itanagar
    ];

    L.polyline(aiPathCoordinates, {
      color: '#0284c7',
      weight: 5,
      opacity: 0.95,
      dashArray: '8, 8',
    }).addTo(map);

    // 3. High Risk Corridor (Red Hazard)
    const riskPathCoordinates: [number, number][] = [
      [26.65, 92.79],
      [26.85, 93.10],
      [27.05, 93.45],
      [27.097, 93.623]
    ];

    L.polyline(riskPathCoordinates, {
      color: '#ef4444',
      weight: 4,
      opacity: 0.9,
    }).addTo(map);

    // 4. Vulnerable Route (Amber)
    const amberPathCoordinates: [number, number][] = [
      [24.8333, 92.7789], // Silchar
      [24.2, 92.75],
      [23.7271, 92.7176]  // Aizawl
    ];

    L.polyline(amberPathCoordinates, {
      color: '#f59e0b',
      weight: 4,
      opacity: 0.85,
    }).addTo(map);

    // Radar Beacons / Stations
    const nodes = [
      { pos: [26.1445, 91.7362] as [number, number], title: 'Guwahati Doppler Radar Station (Operational)', color: '#0284c7' },
      { pos: [27.097, 93.623] as [number, number], title: 'Itanagar High-Altitude Pass Monitor', color: '#10b981' },
      { pos: [25.5788, 91.8933] as [number, number], title: 'Shillong / Sohra Precipitation Cell (Orange Alert)', color: '#f59e0b' },
      { pos: [24.8333, 92.7789] as [number, number], title: 'Silchar Barak Basin Telemetry Station', color: '#0284c7' },
      { pos: [23.7271, 92.7176] as [number, number], title: 'Aizawl Slope Sensor 04 (Washout Warning)', color: '#ef4444' },
    ];

    nodes.forEach((node) => {
      const marker = L.circleMarker(node.pos, {
        radius: 8,
        fillColor: node.color,
        fillOpacity: 1,
        color: '#ffffff',
        weight: 2,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family: inherit; font-size: 12px; font-weight: 600; color: #0f172a; padding: 4px;">${node.title}</div>`
      );
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 shadow-xl">
      {/* OpenStreetMap Base with Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] z-0" />

      {/* Simulated Live Radar Reticle & Rotating Beam Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Concentric Range Rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[260px] h-[260px] rounded-full border border-blue-600/40" />
          <div className="absolute w-[440px] h-[440px] rounded-full border border-blue-600/30 border-dashed" />
          <div className="absolute w-[620px] h-[620px] rounded-full border border-blue-600/20" />
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-blue-600/20" />
          <div className="absolute h-full w-[1px] bg-blue-600/20" />
        </div>

        {/* Rotating Radar Sweep Beam */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            transform: `translate(-50%, -50%) rotate(${radarSweepAngle}deg)`,
            background: 'conic-gradient(from 0deg, rgba(2, 132, 199, 0.22) 0deg, rgba(2, 132, 199, 0.03) 45deg, transparent 75deg, transparent 360deg)',
          }}
        />
      </div>

      {/* Top Radar Status Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-md pointer-events-auto flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span className="tracking-wide">OpenStreetMap Doppler Hydrology & Hazard Radar</span>
            <span className="text-slate-400">•</span>
            <span className="text-[10px] font-mono text-blue-700">OSM LIVE TILES</span>
          </span>
        </div>
        <div className="hidden sm:flex bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-blue-700 pointer-events-auto shadow-sm">
          LIVE TELEMETRY ACTIVE
        </div>
      </div>

      {/* Floating Card 1: Route Risk */}
      <div className="absolute top-16 left-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3.5 shadow-md min-w-[160px]">
        <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Hazard Coefficient</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="text-sm font-bold text-slate-900">Low Risk (21%)</span>
        </div>
        <p className="text-[11px] text-blue-700 mt-0.5 font-medium">NH-715 leeward valley</p>
      </div>

      {/* Floating Card 2: Accessibility Score */}
      <div className="absolute bottom-20 left-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3.5 shadow-md min-w-[150px]">
        <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Network Accessibility</div>
        <div className="text-2xl font-bold font-display text-blue-700 mt-0.5">82%</div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full w-[82%]" />
        </div>
      </div>

      {/* Floating Card 3: Weather Alert */}
      <div className="absolute bottom-4 right-3 z-20 bg-white/95 backdrop-blur-md border border-amber-300 rounded-xl p-3 shadow-md max-w-[240px]">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
          <CloudRain className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          Monsoon Deluge Detected
        </div>
        <p className="text-[11px] text-slate-600 mt-1 leading-snug">
          Banderdewa radar reflectivity: 52 dBZ. AI route diversion enforced.
        </p>
      </div>

      {/* Mini Radar Legend */}
      <div className="absolute top-16 right-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 space-y-1.5 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-blue-600 rounded-sm shadow-[0_0_4px_#2563eb]" /> AI Radar Route
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-emerald-500 rounded-sm shadow-[0_0_4px_#10b981]" /> Safe Corridor
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-amber-500 rounded-sm" /> Storm Cell Warning
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-red-500 rounded-sm shadow-[0_0_4px_#ef4444]" /> Severe Blockade
        </div>
      </div>
    </div>
  );
}
