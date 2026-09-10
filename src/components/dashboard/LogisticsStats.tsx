import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import type { VehicleFleet } from '../../types';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface LogisticsStatsProps {
  fleets: VehicleFleet[];
  onOpenFleetTab?: () => void;
}

export const LogisticsStats: React.FC<LogisticsStatsProps> = ({ fleets, onOpenFleetTab }) => {
  const onScheduleCount = fleets.filter(f => f.status === 'On Schedule').length;
  const delayedCount = fleets.filter(f => f.status === 'Delayed').length;
  const reroutedCount = fleets.filter(f => f.status === 'Rerouted').length;
  const total = fleets.length;

  const onSchedulePct = Math.round((onScheduleCount / total) * 100) || 0;
  const delayedPct = Math.round((delayedCount / total) * 100) || 0;
  const reroutedPct = Math.round((reroutedCount / total) * 100) || 0;

  return (
    <div className="neu-card p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#182130]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111724] border border-[#1d273a] flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white tracking-tight font-mono uppercase">
                Fleet & Logistics Telemetry
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Transit reliability & mission delivery rates across NER
              </p>
            </div>
          </div>

          <button
            onClick={onOpenFleetTab}
            className="px-2.5 py-1 text-xs text-cyan-300 font-mono hover:text-white bg-[#101622] border border-[#1d293d] rounded"
          >
            All Fleets →
          </button>
        </div>

        {/* Big On-Time Rate Metric */}
        <div className="bg-[#090d15] border border-[#172030] p-4 rounded-xl mt-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              On-Time Mission Success Rate
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-0.5 flex items-baseline gap-1.5">
              <AnimatedNumber value={88.4} decimals={1} suffix="%" />
              <span className="text-xs text-slate-500 font-normal">in peak monsoon</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0e1624] border border-[#1d2b40] text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Fleet Distribution Bar */}
        <div className="mt-3.5">
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span className="text-slate-400">Fleet Operational Status</span>
            <span className="text-slate-500">{total} Active NER Convoys</span>
          </div>

          <div className="h-2 w-full bg-[#080b12] rounded-full border border-[#161f2e] overflow-hidden flex">
            <div 
              style={{ width: `${onSchedulePct}%` }} 
              className="bg-emerald-500 h-full transition-all duration-700" 
              title={`On Schedule: ${onSchedulePct}%`}
            />
            <div 
              style={{ width: `${reroutedPct}%` }} 
              className="bg-cyan-400 h-full transition-all duration-700" 
              title={`AI Rerouted: ${reroutedPct}%`}
            />
            <div 
              style={{ width: `${delayedPct}%` }} 
              className="bg-rose-500 h-full transition-all duration-700" 
              title={`Delayed: ${delayedPct}%`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2.5 text-center text-xs font-mono">
            <div className="bg-[#090d15] border border-[#172030] p-2 rounded">
              <div className="flex items-center justify-center gap-1 text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                <span className="font-bold">{onScheduleCount}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">On Schedule</span>
            </div>

            <div className="bg-[#090d15] border border-[#172030] p-2 rounded">
              <div className="flex items-center justify-center gap-1 text-cyan-400">
                <RotateCcw className="w-3 h-3" />
                <span className="font-bold">{reroutedCount}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Rerouted Safe</span>
            </div>

            <div className="bg-[#090d15] border border-[#172030] p-2 rounded">
              <div className="flex items-center justify-center gap-1 text-rose-400">
                <Clock className="w-3 h-3" />
                <span className="font-bold">{delayedCount}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Delayed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cargo Priority Telemetry */}
      <div className="mt-4 pt-3 border-t border-[#182130]">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
          Critical Lifeline Cargo Safeguarded
        </span>
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex justify-between py-1 border-b border-[#141b27]">
            <span className="text-slate-300">Medical Supplies & Vaccines</span>
            <span className="text-emerald-400 font-semibold">100% Intact</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#141b27]">
            <span className="text-slate-300">POL Tankers & LPG Bulkers</span>
            <span className="text-cyan-300 font-semibold">96.2% On Route</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-300">FCI Essential Grains (PDS)</span>
            <span className="text-amber-400 font-semibold">Haflong Detour</span>
          </div>
        </div>
      </div>
    </div>
  );
};
