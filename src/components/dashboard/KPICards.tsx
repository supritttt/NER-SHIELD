import { 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Activity
} from 'lucide-react';
import type { KPIData } from '../../types';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface KPICardsProps {
  kpis: KPIData;
  onCardClick?: (kpiKey: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, onCardClick }) => {
  const cards = [
    {
      key: 'disruptions',
      title: 'Disrupted Arteries',
      code: 'DISR-03',
      value: kpis.disruptedSegmentsCount,
      suffix: '',
      unit: 'Corridors',
      subtitle: `${kpis.disruptedKm} km severe blockage`,
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      trend: '+1 since 06:00',
      trendType: 'negative',
      valueColor: 'text-rose-400',
      barColor: 'bg-rose-500',
      barWidth: '75%'
    },
    {
      key: 'accessibility',
      title: 'Network Accessibility',
      code: 'ACCS-NET',
      value: kpis.networkAccessibilityPct,
      decimals: 1,
      suffix: '%',
      unit: 'Grid Uptime',
      subtitle: 'Passable transport grid',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      trend: '+2.4% vs baseline',
      trendType: 'positive',
      valueColor: 'text-emerald-400',
      barColor: 'bg-emerald-500',
      barWidth: `${kpis.networkAccessibilityPct}%`
    },
    {
      key: 'fleets',
      title: 'Active Fleet Logistics',
      code: 'FLT-GPS',
      value: kpis.activeFleetsCount,
      suffix: '',
      unit: 'Vehicles',
      subtitle: '18 rerouted safely',
      icon: <Truck className="w-4 h-4 text-cyan-400" />,
      trend: '100% telemetry synced',
      trendType: 'neutral',
      valueColor: 'text-cyan-400',
      barColor: 'bg-cyan-500',
      barWidth: '92%'
    },
    {
      key: 'critical',
      title: 'Hazard Hotspots',
      code: 'HAZ-RAD',
      value: kpis.criticalIncidentsCount,
      suffix: '',
      unit: 'Active Sites',
      subtitle: 'Sonapur & Sela pass active',
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      trend: 'Heavy rain radar',
      trendType: 'warning',
      valueColor: 'text-amber-400',
      barColor: 'bg-amber-500',
      barWidth: '60%'
    },
    {
      key: 'delay',
      title: 'Avg Mountain Delay',
      code: 'DLY-AVG',
      value: kpis.avgDelayMinutes,
      suffix: 'm',
      unit: 'Minutes',
      subtitle: '-12m via AI detour solver',
      icon: <Clock className="w-4 h-4 text-purple-400" />,
      trend: 'Haflong bypass active',
      trendType: 'positive',
      valueColor: 'text-purple-400',
      barColor: 'bg-purple-500',
      barWidth: '45%'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => (
        <div
          key={card.key}
          onClick={() => onCardClick && onCardClick(card.key)}
          className="neu-card p-4 flex flex-col justify-between cursor-pointer group hover:border-cyan-500/40 transition-all duration-200"
        >
          {/* Top Label & Code */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#182130]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-mono text-[10px] text-slate-500 font-bold shrink-0">{card.code}</span>
              <span className="text-slate-300 text-xs font-medium truncate">{card.title}</span>
            </div>
            <div className="p-1 rounded bg-[#131b28] border border-[#1e2a3f] shrink-0 ml-1">
              {card.icon}
            </div>
          </div>

          {/* Metric Value */}
          <div className="my-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-mono font-extrabold tracking-tight ${card.valueColor}`}>
                <AnimatedNumber
                  value={card.value}
                  decimals={card.decimals}
                  suffix={card.suffix}
                />
              </span>
              <span className="text-[11px] font-mono text-slate-400">{card.unit}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {card.subtitle}
            </p>
          </div>

          {/* Micro Progress Bar & Delta Footer */}
          <div className="pt-2 border-t border-[#182130]">
            <div className="w-full bg-[#0a0e16] rounded-full h-1 overflow-hidden mb-1.5 border border-[#161f2e]">
              <div
                className={`h-full rounded-full ${card.barColor} transition-all duration-700`}
                style={{ width: card.barWidth }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 truncate">
                {card.trendType === 'positive' && <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />}
                {card.trendType === 'negative' && <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />}
                <span className="truncate">{card.trend}</span>
              </span>
              <span className="text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-1">
                View →
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
