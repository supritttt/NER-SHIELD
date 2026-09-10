import { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polyline, 
  Marker, 
  Popup, 
  CircleMarker,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import type { 
  RoadSegment, 
  VehicleFleet, 
  Incident, 
  District 
} from '../../types';
import { 
  Navigation, 
  Maximize2,
  Minimize2,
  Radio
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { CorridorStatusPanel } from './CorridorStatusPanel';

// Sleek tactical marker icons
const createTacticalIcon = (bgColor: string, borderColor: string, iconSvg: string, pulse: boolean = false) => {
  return L.divIcon({
    className: 'custom-tactical-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${pulse ? `<span class="animate-ping absolute inline-flex h-7 w-7 rounded-full ${bgColor} opacity-60"></span>` : ''}
        <div class="w-7 h-7 rounded-lg ${bgColor} text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.8)] border ${borderColor} transform hover:scale-125 transition-transform duration-200">
          ${iconSvg}
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
};

const incidentIcon = createTacticalIcon(
  'bg-rose-950/90', 
  'border-rose-500/80',
  '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  true
);

const vehicleIcon = createTacticalIcon(
  'bg-slate-900/90',
  'border-cyan-500/80',
  '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>'
);

// Map controller to fly to active road selection
function MapController({ targetCenter, targetZoom }: { targetCenter: [number, number] | null; targetZoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, targetZoom || 8, { duration: 1.0 });
    }
  }, [targetCenter, targetZoom, map]);
  return null;
}

interface OperationsOverviewProps {
  roads: RoadSegment[];
  vehicles: VehicleFleet[];
  incidents: Incident[];
  districts: District[];
  onSelectDistrict?: (district: District) => void;
  onOpenRouteOptimizer?: (origin?: string, destination?: string) => void;
  heightClass?: string;
}

export const OperationsOverview: React.FC<OperationsOverviewProps> = ({
  roads,
  vehicles,
  incidents,
  districts,
  onSelectDistrict,
  onOpenRouteOptimizer,
  heightClass = 'h-[780px] lg:h-[840px]'
}) => {
  const [showRoads, setShowRoads] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [panTarget, setPanTarget] = useState<[number, number] | null>(null);

  // Center of North Eastern Region
  const defaultCenter: [number, number] = [26.1, 92.8];
  const defaultZoom = 7;

  const handleSelectRoad = (road: RoadSegment) => {
    setSelectedRoadId(road.id);
    if (road.coordinates.length > 0) {
      const midCoord = road.coordinates[Math.floor(road.coordinates.length / 2)];
      setPanTarget(midCoord);
    }
  };

  return (
    <div className={`neu-card flex flex-col transition-all duration-300 relative overflow-hidden ${
      isExpanded ? 'fixed inset-4 z-50 p-0' : heightClass
    }`}>
      {/* Precision Tactical Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#1a2335] bg-[#0c1018] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1f293d] flex items-center justify-center text-cyan-400">
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white tracking-tight flex items-center gap-2">
              NER GIS Strategic Command Grid
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-xs text-slate-400">
              Live multi-arterial road telemetry, landslide hazard vectors & fleet positions
            </p>
          </div>
        </div>

        {/* Tactical Controls & Layer Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#090d15] p-1 rounded-lg border border-[#192234] text-xs font-medium">
            <button
              onClick={() => setShowRoads(!showRoads)}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                showRoads ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Corridors ({roads.length})
            </button>

            <button
              onClick={() => setShowIncidents(!showIncidents)}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                showIncidents ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Hazards ({incidents.length})
            </button>

            <button
              onClick={() => setShowVehicles(!showVehicles)}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                showVehicles ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Fleets ({vehicles.length})
            </button>
          </div>

          {onOpenRouteOptimizer && (
            <button
              onClick={() => onOpenRouteOptimizer()}
              className="neu-btn px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 flex items-center gap-1.5 hover:text-white"
              title="Compute Safe Detour"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>AI Router</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="neu-btn p-1.5 rounded-lg text-slate-400 hover:text-white"
            title={isExpanded ? "Exit Fullscreen" : "Expand Fullscreen"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Surface */}
      <div className="flex-1 relative overflow-hidden bg-[#07090e]">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={true}
          className="w-full h-full dark-tiles"
          attributionControl={false}
        >
          <MapController targetCenter={panTarget} />

          {/* Standard OpenStreetMap Tile Layer as requested */}
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />

          {/* District Center Nodes */}
          {districts.map((dist) => (
            <CircleMarker
              key={dist.id}
              center={dist.coordinates}
              radius={dist.riskLevel === 'Severe' ? 7 : 5}
              pathOptions={{
                color: dist.riskLevel === 'Severe' ? '#ef4444' : dist.riskLevel === 'High' ? '#f59e0b' : '#10b981',
                fillColor: dist.riskLevel === 'Severe' ? '#ef4444' : dist.riskLevel === 'High' ? '#f59e0b' : '#10b981',
                fillOpacity: 0.5,
                weight: 1.5
              }}
              eventHandlers={{
                click: () => onSelectDistrict && onSelectDistrict(dist)
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs font-mono">
                  <div className="font-bold text-slate-100 text-sm">{dist.name}</div>
                  <div className="text-slate-400">{dist.state} • Elev: {dist.elevation}</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Accessibility:</span>
                    <span className="font-bold text-white">{dist.accessibilityScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Road Status:</span>
                    <Badge value={dist.roadStatus} />
                  </div>
                  <button
                    onClick={() => onSelectDistrict && onSelectDistrict(dist)}
                    className="w-full mt-2 py-1 neu-btn-primary rounded text-center text-xs font-semibold"
                  >
                    Inspect District Intelligence →
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Connected Regional Highway Corridors */}
          {showRoads && roads.map((road) => {
            const isBlocked = road.status === 'Blocked';
            const isCaution = road.status === 'Caution';
            const isSelected = selectedRoadId === road.id;
            const color = isBlocked ? '#ef4444' : isCaution ? '#f59e0b' : '#10b981';

            return (
              <Polyline
                key={road.id}
                positions={road.coordinates}
                pathOptions={{
                  color: isSelected ? '#38bdf8' : color,
                  weight: isSelected ? 6 : isBlocked ? 5 : 4,
                  opacity: isSelected ? 1 : 0.85,
                  dashArray: isBlocked ? '6, 6' : undefined
                }}
                eventHandlers={{
                  click: () => handleSelectRoad(road)
                }}
              >
                <Popup>
                  <div className="space-y-1.5 text-xs font-mono min-w-[240px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-sm">{road.code}</span>
                      <Badge value={road.status} />
                    </div>
                    <div className="text-slate-300 font-semibold">{road.name}</div>
                    <div className="text-slate-400 text-[11px]">{road.lanes} • Length: {road.lengthKm} km</div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Average Flow:</span>
                      <span className="text-cyan-300 font-bold">{road.avgSpeedKmH} km/h</span>
                    </div>

                    {road.disruptionReason && (
                      <div className="p-2 bg-rose-950/50 border border-rose-500/30 text-rose-300 text-[11px] rounded">
                        {road.disruptionReason}
                      </div>
                    )}

                    {road.detourAvailable && road.detourRouteName && (
                      <div className="p-1.5 bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-[11px] rounded">
                        ✓ Detour: {road.detourRouteName}
                      </div>
                    )}
                  </div>
                </Popup>
              </Polyline>
            );
          })}

          {/* Field Hazard & Disruption Pins */}
          {showIncidents && incidents.map((inc) => (
            <Marker
              key={inc.id}
              position={inc.coordinates}
              icon={incidentIcon}
            >
              <Popup>
                <div className="space-y-1.5 text-xs font-mono max-w-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-rose-400 text-sm">{inc.title}</span>
                    <Badge value={inc.severity} />
                  </div>
                  <p className="text-[11px] text-slate-300">{inc.location}</p>
                  <p className="text-slate-400 text-[11px] bg-[#0a0e16] p-2 rounded border border-[#1b2332]">
                    {inc.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>AI Radar Verified ({inc.reportsCount} Field Reports)</span>
                    <span>{inc.timestamp}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Real-time Fleet Logistics Vehicles */}
          {showVehicles && vehicles.map((veh) => (
            <Marker
              key={veh.id}
              position={veh.coordinates}
              icon={vehicleIcon}
            >
              <Popup>
                <div className="space-y-1 text-xs font-mono">
                  <div className="font-bold text-sm text-cyan-300 flex items-center justify-between">
                    <span>{veh.vehicleNumber}</span>
                    <Badge value={veh.status} />
                  </div>
                  <div className="text-slate-300">Cargo: <span className="text-white font-semibold">{veh.cargoType}</span></div>
                  <div className="text-slate-400 text-[11px]">
                    Driver: {veh.driverName} • Route: {veh.origin} → {veh.destination}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-cyan-400">
                    <span>Telemetry Speed: {veh.speedKmH} km/h</span>
                    <span>ETA: {veh.etaMin}m</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Docked Highway Telemetry & Flow Panel */}
      <CorridorStatusPanel
        roads={roads}
        selectedRoadId={selectedRoadId}
        onSelectRoad={handleSelectRoad}
        onOpenRouteOptimizer={onOpenRouteOptimizer}
      />
    </div>
  );
};
