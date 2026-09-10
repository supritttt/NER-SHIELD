import { 
  Zap, 
  Cpu, 
  Gauge, 
  Radio
} from 'lucide-react';
import { AnimatedNumber } from '../common/AnimatedNumber';

export const PerformanceIndicators: React.FC = () => {
  const metrics = [
    {
      title: 'AI Disruption Model Precision',
      value: 94.8,
      decimals: 1,
      suffix: '%',
      subtitle: 'Scikit-learn RandomForest ROC-AUC',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      barColor: 'bg-cyan-400',
      barPercent: 94.8
    },
    {
      title: 'OSRM Route Solver Latency',
      value: 62,
      suffix: ' ms',
      subtitle: 'Real-time multi-waypoint graph',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      barColor: 'bg-emerald-400',
      barPercent: 90
    },
    {
      title: 'Regional Accessibility Index',
      value: 83.6,
      decimals: 1,
      suffix: '%',
      subtitle: 'Total NER road grid passable',
      icon: <Gauge className="w-4 h-4 text-amber-400" />,
      barColor: 'bg-amber-400',
      barPercent: 83.6
    },
    {
      title: 'Telemetry Sync Health',
      value: 99.9,
      decimals: 1,
      suffix: '%',
      subtitle: 'Low-latency GIS seed & API mesh',
      icon: <Radio className="w-4 h-4 text-purple-400" />,
      barColor: 'bg-purple-400',
      barPercent: 99.9
    }
  ];

  return (
    <div className="neu-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#182130]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#111724] border border-[#1d273a] flex items-center justify-center text-cyan-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight font-mono uppercase">
              AI Telemetry & System Benchmarks
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Model accuracy, OSRM route solver benchmark & telemetric sync
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-[#090d15] border border-[#172030] px-2.5 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Optimal Operational State
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-[#090d15] border border-[#172030] p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-mono font-medium">{m.title}</span>
              <div className="p-1 rounded bg-[#101622] border border-[#1d293d]">{m.icon}</div>
            </div>

            <div className="my-2">
              <div className="text-2xl font-bold font-mono text-white">
                <AnimatedNumber value={m.value} decimals={m.decimals} suffix={m.suffix} />
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{m.subtitle}</p>
            </div>

            <div className="w-full bg-[#080b12] rounded-full h-1 border border-[#161f2e] overflow-hidden mt-1">
              <div
                className={`h-full ${m.barColor} rounded-full transition-all duration-1000`}
                style={{ width: `${m.barPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
