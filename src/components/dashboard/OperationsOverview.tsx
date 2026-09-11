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

// Dynamic live vehicle marker with directional arrow heading and speed pill
const createLiveVehicleIcon = (veh: VehicleFleet) => {
  const isMoving = veh.speedKmH > 0;
  const isDelayed = veh.status === 'Delayed';
  const isRerouted = veh.status === 'Rerouted';
  const borderColor = isDelayed ? '#f59e0b' : isRerouted ? '#a855f7' : '#06b6d4';
  const heading = veh.headingDeg || 0;

  return L.divIcon({
    className: 'custom-live-vehicle-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; width: 44px; margin-left: -22px; margin-top: -24px;">
        <div style="background: rgba(8, 14, 26, 0.95); border: 1px solid ${borderColor}; color: #38bdf8; font-family: monospace; font-size: 9px; font-weight: bold; padding: 1px 4px; border-radius: 4px; margin-bottom: 2px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.6);">
          ${veh.speedKmH} km/h
        </div>
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          ${isMoving ? `<span class="animate-ping" style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${borderColor}; opacity: 0.4;"></span>` : ''}
          <div style="width: 28px; height: 28px; border-radius: 8px; background: #0b1220; border: 2px solid ${borderColor}; display: flex; align-items: center; justify-content: center; transform: rotate(${heading}deg); transition: transform 0.4s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.85);">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${borderColor}" fill-opacity="0.35" stroke="${borderColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 19 21 12 17 5 21 12 2"/>
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -20]
  });
};

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

          {/* Real-time Fleet Logistics Vehicles & Live Breadcrumb Trails */}
          {showVehicles && vehicles.map((veh) => {
            const hasTrail = veh.recentBreadcrumbs && veh.recentBreadcrumbs.length > 1;
            return (
              <div key={`veh-group-${veh.id}`}>
                {/* Live Breadcrumb Trail */}
                {hasTrail && (
                  <Polyline
                    positions={veh.recentBreadcrumbs!}
                    pathOptions={{
                      color: veh.status === 'Delayed' ? '#f59e0b' : veh.status === 'Rerouted' ? '#c084fc' : '#22d3ee',
                      weight: 3,
                      opacity: 0.6,
                      dashArray: '4, 4'
                    }}
                  />
                )}

                {/* Moving Vehicle Marker */}
                <Marker
                  position={veh.coordinates}
                  icon={createLiveVehicleIcon(veh)}
                >
                  <Popup>
                    <div className="space-y-1.5 text-xs font-mono min-w-[220px]">
                      <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-800">
                        <span className="font-bold text-sm text-cyan-300">{veh.vehicleNumber}</span>
                        <Badge value={veh.status} />
                      </div>
                      <div className="text-slate-200 font-semibold">{veh.cargoType}</div>
                      <div className="text-slate-400 text-[11px]">
                        Driver: {veh.driverName}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Route: {veh.origin} → {veh.destination}
                      </div>
                      <div className="p-1.5 rounded bg-[#0b101c] border border-[#1b263b] space-y-1 text-[11px]">
                        <div className="flex items-center justify-between text-cyan-400 font-semibold">
                          <span>Live Speed:</span>
                          <span>{veh.speedKmH} km/h</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>GPS Coords:</span>
                          <span>{veh.coordinates[0].toFixed(3)}°N, {veh.coordinates[1].toFixed(3)}°E</span>
                        </div>
                        {veh.altitudeM && (
                          <div className="flex items-center justify-between text-amber-400">
                            <span>Altitude MSL:</span>
                            <span>{veh.altitudeM}m</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-emerald-400">
                          <span>Remaining ETA:</span>
                          <span>{veh.etaMin} mins</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
                        <span>Satellites: {veh.satelliteCount || 14} locked</span>
                        <span>{veh.lastTelemetryPing || 'Live Stream'}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          })}
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
