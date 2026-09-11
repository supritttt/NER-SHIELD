import { useState } from 'react';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Radio,
  ArrowRight
} from 'lucide-react';
import type { RoadSegment, RoadStatus } from '../../types';

interface CorridorStatusPanelProps {
  roads: RoadSegment[];
  selectedRoadId: string | null;
  onSelectRoad: (road: RoadSegment) => void;
  onOpenRouteOptimizer?: (origin: string, destination: string) => void;
}

export const CorridorStatusPanel: React.FC<CorridorStatusPanelProps> = ({
  roads,
  selectedRoadId,
  onSelectRoad,
  onOpenRouteOptimizer
}) => {
  const [filter, setFilter] = useState<'ALL' | RoadStatus>('ALL');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const blockedCount = roads.filter(r => r.status === 'Blocked').length;
  const cautionCount = roads.filter(r => r.status === 'Caution').length;
  const openCount = roads.filter(r => r.status === 'Open').length;

  const filteredRoads = roads.filter(r => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div className="w-full bg-[#0b0f18] border-t border-[#1a2335] transition-all duration-300">
      {/* Header Bar */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-[#161e2e] bg-[#0d121c]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-100 tracking-wide">
              Strategic Highway Telemetry & Flow Matrix
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline font-mono">
            ({roads.length} Monitored Arteries)
          </span>
          <span className="items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono hidden md:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE SENSORS SYNCED
          </span>
        </div>

        {/* Filter Pills & Collapse Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#07090e] p-1 rounded-lg border border-[#161e2e] text-xs font-medium">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded transition-all ${
                filter === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({roads.length})
            </button>
            <button
              onClick={() => setFilter('Blocked')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                filter === 'Blocked'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                  : 'text-rose-400/90 hover:text-rose-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Blocked ({blockedCount})
            </button>
            <button
              onClick={() => setFilter('Caution')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                filter === 'Caution'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-amber-400/90 hover:text-amber-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Caution ({cautionCount})
            </button>
            <button
              onClick={() => setFilter('Open')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                filter === 'Open'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-emerald-400/90 hover:text-emerald-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Open ({openCount})
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white bg-[#121824] border border-[#1e2738]"
            title={isCollapsed ? "Expand Corridor Telemetry" : "Collapse Telemetry"}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Corridor Table List */}
      {!isCollapsed && (
        <div className="max-h-56 overflow-y-auto divide-y divide-[#141b29]">
          {filteredRoads.map((road) => {
            const isSelected = selectedRoadId === road.id;
            const isBlocked = road.status === 'Blocked';
            const isCaution = road.status === 'Caution';

            return (
              <div
                key={road.id}
                onClick={() => onSelectRoad(road)}
                className={`px-5 py-3 text-xs transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#141c2c] border-l-2 border-cyan-400'
                    : 'hover:bg-[#101522] border-l-2 border-transparent'
                }`}
              >
                {/* Left: Code, Name, Status */}
                <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                  <span className="px-2.5 py-1 rounded-md font-semibold text-xs bg-[#161f30] text-cyan-300 border border-[#233148] shrink-0 font-mono">
                    {road.code}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 text-sm truncate">{road.name}</span>
                      <span className="text-xs text-slate-400 shrink-0">({road.state})</span>
                    </div>

                    {road.disruptionReason ? (
                      <p className="text-xs text-rose-300 mt-0.5 truncate flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        {road.disruptionReason}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {road.lanes} • Transit Volume: {road.trafficVolume}
                      </p>
                    )}
                  </div>
                </div>

                {/* Center: Real Operational Metrics */}
                <div className="flex items-center gap-5 text-xs shrink-0">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px] font-medium">Speed</span>
                    <span className={`font-semibold ${isBlocked ? 'text-rose-400' : isCaution ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {road.avgSpeedKmH} km/h
                    </span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-slate-400 block text-[11px] font-medium">Risk</span>
                    <span className={`font-semibold ${road.riskScore > 70 ? 'text-rose-400' : road.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {road.riskScore}%
                    </span>
                  </div>

                  <div className="text-right hidden lg:block">
                    <span className="text-slate-400 block text-[11px] font-medium">Advisory</span>
                    <span className="text-slate-300">{road.clearanceEta || 'Passable'}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                    isBlocked
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                      : isCaution
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-rose-400 animate-ping' : isCaution ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    {road.status}
                  </span>

                  {road.detourAvailable && onOpenRouteOptimizer && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRouteOptimizer('Guwahati', 'Silchar');
                      }}
                      className="px-2.5 py-1 rounded-md bg-[#162132] hover:bg-[#1f2e46] text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Compute AI Alternate Detour"
                    >
                      <span>Detour</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
