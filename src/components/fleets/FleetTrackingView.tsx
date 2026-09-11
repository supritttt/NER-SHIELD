import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Navigation,
  Satellite,
  Compass,
  Mountain,
  Gauge
} from 'lucide-react';
import type { VehicleFleet, FleetStatus } from '../../types';
import { Badge } from '../common/Badge';
import { getDistrictCityNode } from '../../services/api';

interface FleetTrackingViewProps {
  fleets: VehicleFleet[];
  onOpenRouteOptimizer?: (origin: string, destination: string) => void;
}

export const FleetTrackingView: React.FC<FleetTrackingViewProps> = ({
  fleets,
  onOpenRouteOptimizer
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | FleetStatus>('All');
  const [search, setSearch] = useState('');

  const filteredFleets = fleets.filter(f => {
    const matchesStatus = filterStatus === 'All' || f.status === filterStatus;
    const matchesSearch = f.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
                          f.driverName.toLowerCase().includes(search.toLowerCase()) ||
                          f.cargoType.toLowerCase().includes(search.toLowerCase()) ||
                          f.destination.toLowerCase().includes(search.toLowerCase()) ||
                          (f.currentHighway && f.currentHighway.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neu-card p-5 border border-cyan-500/20 bg-gradient-to-r from-[#070c16] via-[#0b1222] to-[#070c16]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                LIVE GPS TELEMATICS ENGINE ONLINE
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono uppercase mt-1">
              <Truck className="w-5 h-5 text-cyan-400" />
              Real-Time Commercial & Essential Supply Fleet Tracking
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live NMEA GPS telematics stream, mountain altitude telemetry, driver status & dynamic AI rerouting
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search truck, cargo, corridor..."
                className="pl-8 pr-3 py-1.5 text-xs neu-input w-48 text-slate-200 font-mono"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#090d15] p-1 rounded-lg border border-[#172030]">
              {(['All', 'On Schedule', 'Rerouted', 'Delayed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    filterStatus === st
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fleets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFleets.map((fleet) => {
          const isDelayed = fleet.status === 'Delayed';
          const isRerouted = fleet.status === 'Rerouted';
          const speedPct = Math.min(100, Math.round((fleet.speedKmH / 80) * 100));

          return (
            <div
              key={fleet.id}
              className="neu-card p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 group border border-slate-800/80 hover:border-cyan-500/40 relative overflow-hidden"
            >
              {/* Subtle accent corner glow */}
              <div className={`absolute top-0 right-0 w-24 h-24 ${isDelayed ? 'bg-amber-500/5' : isRerouted ? 'bg-purple-500/5' : 'bg-cyan-500/5'} blur-xl pointer-events-none`} />

              <div>
                <div className="flex items-start justify-between pb-3 border-b border-[#182130]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[12px] font-mono text-cyan-400 font-bold tracking-wider">
                        {fleet.vehicleNumber}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white mt-1 font-mono">{fleet.cargoType}</h3>
                  </div>
                  <Badge value={fleet.status} size="sm" />
                </div>

                {/* Live Speedometer & Telemetry Ribbon */}
                <div className="my-3 p-2.5 rounded-lg bg-[#090e18] border border-[#172236] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Telemetry Speed</span>
                    </div>
                    <span className="text-base font-extrabold text-cyan-300 font-mono tracking-tight">
                      {fleet.speedKmH} <span className="text-[10px] text-slate-400">km/h</span>
                    </span>
                  </div>

                  {/* Progress Speed Bar */}
                  <div className="w-full bg-[#131b2c] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        fleet.speedKmH > 50 ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' :
                        fleet.speedKmH > 25 ? 'bg-gradient-to-r from-amber-500 to-cyan-400' :
                        'bg-gradient-to-r from-rose-500 to-amber-500'
                      }`}
                      style={{ width: `${Math.max(12, speedPct)}%` }}
                    />
                  </div>

                  {/* Telemetry Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#131c2d] text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{fleet.headingDeg || 0}° Hdg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mountain className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{fleet.altitudeM || 450}m MSL</span>
                    </div>
                    <div className="flex items-center gap-1 text-right justify-end">
                      <Satellite className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{fleet.satelliteCount || 14} Sats</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Driver:</span>
                    <span className="font-medium text-slate-200">{fleet.driverName}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Remaining ETA:</span>
                    <span className="font-bold text-emerald-400">{fleet.etaMin} minutes</span>
                  </div>

                  {fleet.odometerKm && (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Odometer:</span>
                      <span className="text-slate-300">{fleet.odometerKm} km</span>
                    </div>
                  )}

                  <div className="bg-[#090d15] border border-[#172030] p-2 rounded-lg mt-2 text-[11px] text-slate-300">
                    <div className="text-slate-500 text-[10px] flex items-center justify-between">
                      <span>CORRIDOR ROUTE:</span>
                      <span className="text-cyan-400 font-bold">{fleet.currentHighway || 'Trunk Route'}</span>
                    </div>
                    <div className="truncate font-semibold text-slate-100 mt-0.5">
                      {fleet.origin} → {fleet.destination}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#182130] flex items-center justify-between mt-3">
                <div className="flex flex-col text-[10px] font-mono">
                  <span className="text-cyan-400 font-semibold">
                    {fleet.coordinates[0].toFixed(4)}°N, {fleet.coordinates[1].toFixed(4)}°E
                  </span>
                  <span className="text-slate-500 text-[9px]">
                    Ping: {fleet.lastTelemetryPing || 'Streaming'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (onOpenRouteOptimizer) onOpenRouteOptimizer(getDistrictCityNode(fleet.origin), getDistrictCityNode(fleet.destination));
                  }}
                  className="px-2.5 py-1 text-xs text-cyan-300 hover:text-white bg-[#101622] hover:bg-[#152033] border border-[#1d293d] rounded-md flex items-center gap-1 font-mono transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  Detour
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
