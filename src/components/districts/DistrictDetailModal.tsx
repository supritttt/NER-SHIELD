import { 
  X, 
  MapPin, 
  AlertTriangle, 
  Phone, 
  Navigation, 
  Activity,
  Mountain
} from 'lucide-react';
import type { District } from '../../types';
import { Badge } from '../common/Badge';
import { RadialGauge } from '../common/RadialGauge';
import { getDistrictCityNode } from '../../services/api';

interface DistrictDetailModalProps {
  district: District | null;
  onClose: () => void;
  onOpenRouteOptimizer?: (origin: string, destination: string) => void;
  onOpenReportIncident?: (district: District) => void;
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  district,
  onClose,
  onOpenRouteOptimizer,
  onOpenReportIncident
}) => {
  if (!district) return null;

  const maxHistorical = Math.max(...district.historicalDisruptions.map(h => h.incidents), 1);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-count-up">
      <div 
        className="bg-[#0c1018] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl border border-[#1e293d] shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-[#111827] border border-[#1f2a3e] text-slate-400 hover:text-white"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-[#182130]">
          <RadialGauge score={district.accessibilityScore} size={80} strokeWidth={7} />
          <div className="flex-1 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight font-mono">
                {district.name}
              </h2>
              <Badge value={district.riskLevel} size="sm" />
              <Badge value={district.roadStatus} size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              State: <span className="text-slate-200 font-semibold">{district.state}</span> • 
              Elevation: <span className="text-slate-200">{district.elevation}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Strategic Lifeline: <span className="text-cyan-300 font-semibold">{district.majorHighway}</span>
            </p>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="bg-[#090d15] border border-[#172030] p-3 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Active Hazards</span>
            <span className={`text-xl font-extrabold font-mono ${district.activeIncidents > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {district.activeIncidents}
            </span>
          </div>

          <div className="bg-[#090d15] border border-[#172030] p-3 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Precipitation</span>
            <span className="text-xl font-extrabold font-mono text-cyan-400">
              {district.rainfallMm} <span className="text-xs">mm/h</span>
            </span>
          </div>

          <div className="bg-[#090d15] border border-[#172030] p-3 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Artery Status</span>
            <span className="text-sm font-bold font-mono text-white mt-1 block">
              {district.roadStatus}
            </span>
          </div>

          <div className="bg-[#090d15] border border-[#172030] p-3 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Coordinates</span>
            <span className="text-[11px] font-mono text-slate-300 mt-1 block">
              {district.coordinates[0].toFixed(2)}N, {district.coordinates[1].toFixed(2)}E
            </span>
          </div>
        </div>

        {/* Historical Disruption Trend Bar Chart */}
        <div className="bg-[#090d15] border border-[#172030] p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-mono">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Monsoon Disruption Density (Incidents / Month)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Historical Disruption Baseline</span>
          </div>

          <div className="flex items-end justify-between gap-3 h-24 pt-2">
            {district.historicalDisruptions.map((item, idx) => {
              const heightPercent = Math.max(Math.round((item.incidents / maxHistorical) * 100), 10);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-300 font-semibold">{item.incidents}</span>
                  <div className="w-full bg-[#080b12] rounded-t border-t border-x border-[#1a2335] overflow-hidden flex items-end h-16">
                    <div
                      className="w-full bg-cyan-500 rounded-t transition-all duration-500 hover:bg-cyan-400"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mountain Passes & Chokepoints */}
        <div className="mb-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            Critical Strategic Passages & Checkpoints
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {district.keyPasses.map((pass, i) => (
              <div key={i} className="bg-[#090d15] border border-[#172030] p-2 rounded text-xs flex items-center gap-2 text-slate-200 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{pass}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts & Rapid Response */}
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            District Disaster Management & SDRF Contacts
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {district.emergencyContacts.map((contact, i) => (
              <div key={i} className="bg-[#090d15] border border-[#172030] p-2 rounded text-xs flex items-center justify-between font-mono">
                <span className="text-slate-300">{contact.service}</span>
                <span className="text-cyan-400 font-bold">{contact.number}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-[#182130]">
          <button
            onClick={() => {
              if (onOpenReportIncident) onOpenReportIncident(district);
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 font-mono hover:text-white flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report Incident Here
          </button>

          <button
            onClick={() => {
              if (onOpenRouteOptimizer) onOpenRouteOptimizer('Guwahati', getDistrictCityNode(district.id || district.name));
              onClose();
            }}
            className="neu-btn-primary px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            Optimize Route to District →
          </button>
        </div>
      </div>
    </div>
  );
};
