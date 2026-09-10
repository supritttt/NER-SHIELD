import type { RiskLevel, RoadStatus, FleetStatus } from '../../types';

interface BadgeProps {
  type?: 'risk' | 'status' | 'fleet' | 'custom';
  value: RiskLevel | RoadStatus | FleetStatus | string;
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'cyan';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ value, variant, size = 'sm' }) => {
  let colorStyles = 'bg-[#151c2a] text-slate-300 border-[#222e44]';

  if (variant) {
    switch (variant) {
      case 'green':
        colorStyles = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
        break;
      case 'amber':
        colorStyles = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
        break;
      case 'red':
        colorStyles = 'bg-rose-950/60 text-rose-300 border-rose-500/40';
        break;
      case 'cyan':
        colorStyles = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40';
        break;
      case 'blue':
        colorStyles = 'bg-blue-950/60 text-blue-300 border-blue-500/40';
        break;
      case 'purple':
        colorStyles = 'bg-purple-950/60 text-purple-300 border-purple-500/40';
        break;
    }
  } else {
    const v = String(value).toLowerCase();
    if (['low', 'open', 'on schedule', 'clear'].includes(v)) {
      colorStyles = 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40';
    } else if (['moderate', 'caution', 'delayed', 'vulnerable'].includes(v)) {
      colorStyles = 'bg-amber-950/50 text-amber-300 border-amber-500/40';
    } else if (['high', 'severe', 'blocked', 'halted', 'critical'].includes(v)) {
      colorStyles = 'bg-rose-950/50 text-rose-300 border-rose-500/40';
    } else if (['rerouted'].includes(v)) {
      colorStyles = 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40';
    }
  }

  const sizeStyles = size === 'sm' 
    ? 'px-2 py-0.5 text-[10px] font-semibold' 
    : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${sizeStyles} ${colorStyles} font-mono uppercase tracking-wider`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
};
