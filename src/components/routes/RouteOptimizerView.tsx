import { useState, useEffect, Fragment } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polyline, 
  Marker, 
  Popup,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Send, 
  Sparkles 
} from 'lucide-react';
import type { RouteOption } from '../../types';
import { ROUTE_RECOMMENDATIONS, apiService, getDistrictCityNode } from '../../services/api';
import { Badge } from '../common/Badge';

// Map controller to fly to active route corridor
function MapController({ targetCenter, targetZoom }: { targetCenter: [number, number] | null; targetZoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, targetZoom || 8, { duration: 1.0 });
    }
  }, [targetCenter, targetZoom, map]);
  return null;
}

// Leaflet map icons for route view
const createRoutePinIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-route-pin',
    html: `
      <div class="flex flex-col items-center justify-center transform -translate-y-2">
        <div class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-white shadow-lg ${color} border border-white/40 whitespace-nowrap">
          ${label}
        </div>
        <div class="w-3 h-3 rounded-full ${color} border-2 border-white shadow-md -mt-1"></div>
      </div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 25],
    popupAnchor: [0, -25]
  });
};

const originIcon = createRoutePinIcon('bg-emerald-600', 'ORIGIN');
const destinationIcon = createRoutePinIcon('bg-cyan-600', 'DESTINATION');
const hazardIcon = createRoutePinIcon('bg-rose-600 animate-pulse', 'BLOCKED');

interface RouteOptimizerViewProps {
  initialOrigin?: string;
  initialDestination?: string;
  onDispatchRoute?: (route: RouteOption) => void;
}

export const RouteOptimizerView: React.FC<RouteOptimizerViewProps> = ({
  initialOrigin = 'Guwahati',
  initialDestination = 'Silchar',
  onDispatchRoute
}) => {
  const [origin, setOrigin] = useState(() => getDistrictCityNode(initialOrigin));
  const [destination, setDestination] = useState(() => getDistrictCityNode(initialDestination));
  const [isCalculating, setIsCalculating] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>(() => {
    const o = getDistrictCityNode(initialOrigin).toLowerCase();
    const d = getDistrictCityNode(initialDestination).toLowerCase();
    const key = `${o}-${d}`;
    return ROUTE_RECOMMENDATIONS[key] || ROUTE_RECOMMENDATIONS['guwahati-silchar'] || [];
  });
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    routes.find(r => r.type === 'recommended_alternate')?.id || routes[0]?.id || ''
  );
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Synchronize with external prop triggers
  useEffect(() => {
    const newOrigin = getDistrictCityNode(initialOrigin || 'Guwahati');
    const newDest = getDistrictCityNode(initialDestination || 'Silchar');
    setOrigin(newOrigin);
    setDestination(newDest);

    const syncAndCompute = async () => {
      setIsCalculating(true);
      try {
        const computed = await apiService.getRouteRecommendation(newOrigin, newDest);
        setRoutes(computed);
        const alt = computed.find(r => r.type === 'recommended_alternate');
        setSelectedRouteId(alt ? alt.id : computed[0]?.id || '');
      } finally {
        setIsCalculating(false);
      }
    };
    syncAndCompute();
  }, [initialOrigin, initialDestination]);

  const handleCalculateRoute = async () => {
    setIsCalculating(true);
    setDispatchSuccess(false);

    try {
      const computed = await apiService.getRouteRecommendation(origin, destination);
      setTimeout(() => {
        setRoutes(computed);
        const alt = computed.find(r => r.type === 'recommended_alternate');
        setSelectedRouteId(alt ? alt.id : computed[0]?.id || '');
        setIsCalculating(false);
      }, 500);
    } catch {
      setIsCalculating(false);
    }
  };

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const primaryRoute = routes.find(r => r.type === 'primary');
  const alternateRoute = routes.find(r => r.type === 'recommended_alternate');

  // Compute map center from route coordinates
  const mapCenter: [number, number] = selectedRoute && selectedRoute.coordinates.length > 0
    ? selectedRoute.coordinates[Math.floor(selectedRoute.coordinates.length / 2)]
    : [25.8, 92.4];

  const handleDispatch = () => {
    if (onDispatchRoute && selectedRoute) {
      onDispatchRoute(selectedRoute);
    }
    setDispatchSuccess(true);
    setTimeout(() => setDispatchSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-count-up">
      {/* Top Banner */}
      <div className="neu-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 neu-inset rounded-xl text-cyan-400">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  AI Risk-Aware Route Solver & Detour Dispatch
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    SIH26002 AI
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamic multimodal recalculation avoiding landslide belts, washouts & swollen river gorges
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="neu-inset px-3 py-1.5 rounded-xl text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>OSRM Multi-hop Solver Online</span>
            </div>
          </div>
        </div>

        {/* Origin & Destination Selection Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Dispatch Origin
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400" />
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                aria-label="Dispatch Origin"
                className="w-full pl-8 pr-3 py-2 text-xs neu-input text-slate-200 cursor-pointer"
              >
                <option value="Guwahati">Guwahati (Kamrup Metro)</option>
                <option value="Shillong">Shillong (East Khasi)</option>
                <option value="Tezpur">Tezpur Logistics Base</option>
                <option value="Siliguri">Siliguri Freight Hub</option>
                <option value="Dimapur">Dimapur Gateway</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Mission Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rose-400" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                aria-label="Mission Destination"
                className="w-full pl-8 pr-3 py-2 text-xs neu-input text-slate-200 cursor-pointer"
              >
                <option value="Silchar">Silchar (Barak Lifeline)</option>
                <option value="Tawang">Tawang (Arunachal Border)</option>
                <option value="Imphal">Imphal Valley (Manipur)</option>
                <option value="Gangtok">Gangtok (Sikkim Corridor)</option>
                <option value="Aizawl">Aizawl (Mizoram)</option>
                <option value="Kohima">Kohima (Nagaland)</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCalculateRoute}
              disabled={isCalculating}
              className="w-full neu-btn-primary py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-neu-glow-cyan"
            >
              {isCalculating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Graph...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Compute Safe Route</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleDispatch}
              disabled={dispatchSuccess}
              className="w-full neu-btn py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-cyan-300 hover:text-white"
            >
              {dispatchSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Broadcasted to 142 Fleets</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Detour to Fleets</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map & Route Telemetry Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: GIS Route Map (7 cols) */}
        <div className="lg:col-span-7 neu-card p-4 flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white font-mono">
                {origin} → {destination} Corridor GIS Comparison
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-3 h-0.5 bg-rose-500 border-dashed inline-block" />
                Primary (Risky)
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-3 h-1 bg-cyan-400 inline-block rounded" />
                AI Detour (Safe)
              </span>
            </div>
          </div>

          <div className="flex-1 relative rounded-xl overflow-hidden mt-3 neu-inset border border-slate-800">
            <MapContainer
              center={mapCenter}
              zoom={8}
              scrollWheelZoom={true}
              className="w-full h-full"
              attributionControl={false}
            >
              <MapController targetCenter={mapCenter} />

              {/* Standard OpenStreetMap Tile Layer as requested */}
              <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={19}
              />

              {/* Render Primary Route (Red dashed) */}
              {primaryRoute && (
                <Polyline
                  positions={primaryRoute.coordinates}
                  pathOptions={{
                    color: '#f43f5e',
                    weight: 5,
                    dashArray: '6, 8',
                    opacity: 0.9
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-rose-400">{primaryRoute.name}</div>
                      <div>Risk Score: <span className="font-mono font-bold text-white">{primaryRoute.riskScore}%</span></div>
                      <div>Distance: {primaryRoute.distanceKm} km • ETA: {primaryRoute.durationHours} hrs</div>
                      {primaryRoute.warningNote && (
                        <div className="p-1.5 neu-inset text-rose-300 text-[11px] rounded mt-1">
                          {primaryRoute.warningNote}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Polyline>
              )}

              {/* Render AI Alternate Detour Route (Glowing Cyan solid) */}
              {alternateRoute && (
                <Polyline
                  positions={alternateRoute.coordinates}
                  pathOptions={{
                    color: '#00f2fe',
                    weight: 6,
                    opacity: 0.95
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-cyan-400">{alternateRoute.name}</div>
                      <div>Risk Score: <span className="font-mono font-bold text-emerald-400">{alternateRoute.riskScore}% (Safe)</span></div>
                      <div>Distance: {alternateRoute.distanceKm} km • ETA: {alternateRoute.durationHours} hrs</div>
                      {alternateRoute.warningNote && (
                        <div className="p-1.5 neu-inset text-cyan-200 text-[11px] rounded mt-1">
                          {alternateRoute.warningNote}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Polyline>
              )}

              {/* Origin Marker */}
              {selectedRoute && selectedRoute.coordinates.length > 0 && (
                <Marker position={selectedRoute.coordinates[0]} icon={originIcon}>
                  <Popup>
                    <div className="text-xs font-bold text-emerald-400">Origin: {origin}</div>
                  </Popup>
                </Marker>
              )}

              {/* Destination Marker */}
              {selectedRoute && selectedRoute.coordinates.length > 0 && (
                <Marker position={selectedRoute.coordinates[selectedRoute.coordinates.length - 1]} icon={destinationIcon}>
                  <Popup>
                    <div className="text-xs font-bold text-cyan-400">Destination: {destination}</div>
                  </Popup>
                </Marker>
              )}

              {/* Hazard point (Sonapur tunnel or intermediate bottleneck) */}
              {primaryRoute && primaryRoute.coordinates.length > 2 && (
                <Marker position={primaryRoute.coordinates[2]} icon={hazardIcon}>
                  <Popup>
                    <div className="text-xs text-rose-400 font-bold">
                      Critical Road Blockage
                      <p className="text-slate-300 font-normal mt-0.5">Heavy mudflow on primary corridor</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Right: Comparative Telemetry Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {routes.map((rt) => {
            const isAIRecommended = rt.type === 'recommended_alternate';
            const isSelected = selectedRouteId === rt.id;

            return (
              <div
                key={rt.id}
                onClick={() => setSelectedRouteId(rt.id)}
                className={`neu-card p-5 cursor-pointer rounded-xl border transition-all duration-300 ${
                  isAIRecommended
                    ? 'border-cyan-500/50 shadow-neu-glow-cyan bg-cyan-950/15'
                    : 'border-rose-500/30'
                } ${isSelected ? 'ring-2 ring-cyan-400/40' : ''}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{rt.name}</h3>
                    </div>
                    {isAIRecommended && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
                        <Sparkles className="w-3 h-3" />
                        AI RECOMMENDED DETOUR
                      </span>
                    )}
                  </div>
                  <Badge 
                    value={`${rt.riskScore}% Risk`} 
                    variant={rt.riskScore > 60 ? 'red' : rt.riskScore > 30 ? 'amber' : 'green'} 
                  />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 my-3 text-xs font-mono">
                  <div className="neu-inset p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="text-sm font-bold text-white">{rt.distanceKm} km</span>
                  </div>
                  <div className="neu-inset p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Transit Time</span>
                    <span className="text-sm font-bold text-white">{rt.durationHours} hrs</span>
                  </div>
                  <div className="neu-inset p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Road Surface</span>
                    <span className="text-xs font-semibold text-cyan-300 truncate mt-0.5 block">{rt.roadQuality}</span>
                  </div>
                </div>

                {/* AI Rationale / Alert Box */}
                {rt.warningNote && (
                  <div className={`neu-inset p-2.5 rounded-xl text-xs font-mono mb-3 ${
                    isAIRecommended ? 'text-cyan-200 border-cyan-500/20' : 'text-rose-300 border-rose-500/20'
                  }`}>
                    {rt.warningNote}
                  </div>
                )}

                {/* Waypoints flow */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                    Critical Route Waypoints:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                    {rt.checkpoints.map((cp, idx) => (
                      <Fragment key={idx}>
                        <div className={`px-2 py-0.5 rounded-lg neu-inset flex items-center gap-1 text-[11px] ${
                          cp.status === 'Blocked' ? 'text-rose-400 border border-rose-500/40' :
                          cp.status === 'Vulnerable' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {cp.status === 'Blocked' ? (
                            <AlertTriangle className="w-2.5 h-2.5" />
                          ) : (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          )}
                          <span>{cp.name}</span>
                        </div>
                        {idx < rt.checkpoints.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
