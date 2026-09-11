import { useState } from 'react';
import { 
  Truck, 
  Search, 
  Navigation
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
                          f.destination.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neu-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 font-mono uppercase">
              <Truck className="w-4 h-4 text-cyan-400" />
              Live Commercial & Essential Supply Fleet Tracking
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Real-time telemetry, driver status, mountain ETA, and automated reroute triggers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search truck, cargo, driver..."
                className="pl-8 pr-3 py-1.5 text-xs neu-input w-48 text-slate-200"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFleets.map((fleet) => (
          <div
            key={fleet.id}
            className="neu-card p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-[#182130]">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-wider">
                    {fleet.vehicleNumber}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-0.5 font-mono">{fleet.cargoType}</h3>
                </div>
                <Badge value={fleet.status} size="sm" />
              </div>

              <div className="space-y-1.5 my-3.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-medium text-slate-200">{fleet.driverName}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Current Speed:</span>
                  <span className="font-bold text-cyan-300">{fleet.speedKmH} km/h</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Transit ETA:</span>
                  <span className="font-bold text-emerald-400">{fleet.etaMin} minutes</span>
                </div>

                <div className="bg-[#090d15] border border-[#172030] p-2 rounded-lg mt-2 text-[11px] text-slate-300">
                  <div className="text-slate-500 text-[10px]">CORRIDOR ROUTE:</div>
                  <div className="truncate font-semibold text-slate-100 mt-0.5">
                    {fleet.origin} → {fleet.destination}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#182130] flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">
                GPS: {fleet.coordinates[0].toFixed(2)}N, {fleet.coordinates[1].toFixed(2)}E
              </span>
              <button
                onClick={() => {
                  if (onOpenRouteOptimizer) onOpenRouteOptimizer(getDistrictCityNode(fleet.origin), getDistrictCityNode(fleet.destination));
                }}
                className="px-2.5 py-1 text-xs text-cyan-300 hover:text-white bg-[#101622] border border-[#1d293d] rounded flex items-center gap-1 font-mono"
              >
                <Navigation className="w-3 h-3" />
                Detour
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
