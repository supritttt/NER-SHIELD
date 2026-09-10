import { useState } from 'react';
import { 
  MapPin, 
  Search, 
  AlertTriangle, 
  ArrowUpRight
} from 'lucide-react';
import type { District, RiskLevel } from '../../types';
import { Badge } from '../common/Badge';
import { RadialGauge } from '../common/RadialGauge';
import { DistrictDetailModal } from './DistrictDetailModal';

interface DistrictIntelligenceProps {
  districts: District[];
  selectedState: string;
  onOpenRouteOptimizer?: (origin: string, destination: string) => void;
  onOpenReportIncident?: (district: District) => void;
}

export const DistrictIntelligence: React.FC<DistrictIntelligenceProps> = ({
  districts,
  selectedState,
  onOpenRouteOptimizer,
  onOpenReportIncident
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [activeModalDistrict, setActiveModalDistrict] = useState<District | null>(null);

  // Filter districts based on state, risk level and search
  const filteredDistricts = districts.filter((d) => {
    const matchesState = selectedState === 'All North East' || d.state.toLowerCase() === selectedState.toLowerCase();
    const matchesRisk = riskFilter === 'All' || d.riskLevel === riskFilter;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.majorHighway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* View Header & Controls */}
      <div className="neu-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 font-mono uppercase">
              <MapPin className="w-4 h-4 text-cyan-400" />
              North Eastern Region District Intelligence Matrix
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live accessibility scores, landslide risk indexes, and strategic highway status across NER
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter district or highway..."
                className="pl-8 pr-3 py-1.5 text-xs neu-input w-48 text-slate-200"
              />
            </div>

            {/* Risk Level Pills */}
            <div className="flex items-center gap-1 bg-[#090d15] p-1 rounded-lg border border-[#172030]">
              {(['All', 'Low', 'Moderate', 'High', 'Severe'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    riskFilter === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistricts.map((district) => {
          return (
            <div
              key={district.id}
              onClick={() => setActiveModalDistrict(district)}
              className="neu-card p-5 cursor-pointer flex flex-col justify-between transition-all duration-200 group hover:-translate-y-1 hover:border-cyan-500/40"
            >
              <div>
                {/* Card Top Row: State & Badges */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#182130]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
                      {district.state}
                    </span>
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                      {district.name}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge value={district.riskLevel} size="sm" />
                    <Badge value={district.roadStatus} size="sm" />
                  </div>
                </div>

                {/* Score & Gauge Section */}
                <div className="flex items-center gap-4 my-4">
                  <RadialGauge score={district.accessibilityScore} size={76} strokeWidth={6} />
                  
                  <div className="flex-1 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Elevation:</span>
                      <span className="font-medium text-slate-200">{district.elevation}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Rainfall:</span>
                      <span className="font-medium text-cyan-300">{district.rainfallMm} mm/h</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Active Hazards:</span>
                      <span className={`font-semibold ${district.activeIncidents > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {district.activeIncidents} Incidents
                      </span>
                    </div>
                  </div>
                </div>

                {/* Major Highway & Status banner */}
                <div className="bg-[#090d15] border border-[#172030] p-2.5 rounded-lg text-xs space-y-1">
                  <div className="text-slate-400 text-[11px] font-mono">
                    Corridor: <span className="text-slate-200 font-medium">{district.majorHighway}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono truncate">
                    Weather: <span className="text-cyan-300">{district.weatherSummary}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="pt-3 mt-4 border-t border-[#182130] flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-cyan-300">
                <span>View Full Telemetry & Response Plan</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredDistricts.length === 0 && (
        <div className="neu-card p-12 text-center text-slate-400">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p className="font-medium text-slate-200">No districts match the selected filters</p>
          <p className="text-xs mt-1">Try resetting the risk level or state filter</p>
        </div>
      )}

      {/* Detailed Modal on Click */}
      {activeModalDistrict && (
        <DistrictDetailModal
          district={activeModalDistrict}
          onClose={() => setActiveModalDistrict(null)}
          onOpenRouteOptimizer={onOpenRouteOptimizer}
          onOpenReportIncident={onOpenReportIncident}
        />
      )}
    </div>
  );
};
