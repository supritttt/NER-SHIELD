import { useState, Fragment } from 'react';
import { 
  X, 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Cpu
} from 'lucide-react';
import type { RouteOption } from '../../types';
import { ROUTE_RECOMMENDATIONS } from '../../services/api';
import { Badge } from '../common/Badge';

interface RouteOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrigin?: string;
  initialDestination?: string;
  onCompute?: (origin: string, destination: string) => void;
}

export const RouteOptimizerModal: React.FC<RouteOptimizerModalProps> = ({
  isOpen,
  onClose,
  initialOrigin = 'Guwahati',
  initialDestination = 'Silchar',
  onCompute
}) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>(ROUTE_RECOMMENDATIONS['guwahati-silchar'] || []);

  if (!isOpen) return null;

  const handleCalculateRoute = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      if (onCompute) {
        onCompute(origin, destination);
      } else {
        const key = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
        setRoutes(ROUTE_RECOMMENDATIONS[key] || ROUTE_RECOMMENDATIONS['guwahati-silchar']);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-count-up">
      <div 
        className="neu-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border border-cyan-500/20 shadow-neu-flat-lg relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 neu-btn p-2 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-cyan-400">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              AI Risk-Aware Route Solver
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                SIH26002 AI
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates landslide probabilities, road blockages, and terrain slope friction
            </p>
          </div>
        </div>

        {/* Origin / Destination Selector Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Dispatch Origin
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400" />
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs neu-input text-slate-200 cursor-pointer"
              >
                <option value="Guwahati">Guwahati (Kamrup Metro)</option>
                <option value="Shillong">Shillong (East Khasi)</option>
                <option value="Tezpur">Tezpur Logistics Base</option>
                <option value="Siliguri">Siliguri Freight Terminal</option>
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
                className="w-full pl-8 pr-3 py-2 text-xs neu-input text-slate-200 cursor-pointer"
              >
                <option value="Silchar">Silchar (Barak Lifeline)</option>
                <option value="Tawang">Tawang (Arunachal Border)</option>
                <option value="Imphal">Imphal Valley (Manipur)</option>
                <option value="Gangtok">Gangtok (Sikkim Corridor)</option>
                <option value="Aizawl">Aizawl (Mizoram)</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCalculateRoute}
              disabled={isCalculating}
              className="w-full neu-btn-primary py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Solving Graph...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Compute Safe Route</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Route Comparisons */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Route Recommendations & Hazard Impact Matrix
          </h3>

          {routes.map((rt: RouteOption) => {
            const isAIRecommended = rt.type === 'recommended_alternate';
            return (
              <div
                key={rt.id}
                className={`neu-card p-5 rounded-xl border transition-all ${
                  isAIRecommended
                    ? 'border-cyan-500/40 shadow-neu-glow-cyan bg-cyan-950/10'
                    : 'border-rose-500/30'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{rt.name}</span>
                    {isAIRecommended && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
                        ✓ RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Risk Score:</span>
                    <Badge 
                      value={`${rt.riskScore}% Risk`} 
                      variant={rt.riskScore > 60 ? 'red' : rt.riskScore > 30 ? 'amber' : 'green'} 
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 my-3 text-xs font-mono">
                  <div className="neu-inset p-2.5 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="text-base font-bold text-slate-100">{rt.distanceKm} km</span>
                  </div>
                  <div className="neu-inset p-2.5 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Estimated Transit</span>
                    <span className="text-base font-bold text-slate-100">{rt.durationHours} hrs</span>
                  </div>
                  <div className="neu-inset p-2.5 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Road Surface</span>
                    <span className="text-xs font-semibold text-cyan-300 mt-0.5 block">{rt.roadQuality}</span>
                  </div>
                </div>

                {/* Warning / AI Note */}
                {rt.warningNote && (
                  <div className={`neu-inset p-3 rounded-xl text-xs font-mono mb-3 ${
                    isAIRecommended ? 'text-cyan-200 border-cyan-500/20' : 'text-rose-300 border-rose-500/20'
                  }`}>
                    {rt.warningNote}
                  </div>
                )}

                {/* Checkpoint Status Flow */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                    Critical Route Waypoints
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    {rt.checkpoints.map((cp: { name: string; status: 'Clear' | 'Vulnerable' | 'Blocked' }, idx: number) => (
                      <Fragment key={idx}>
                        <div className={`px-2.5 py-1 rounded-lg neu-inset flex items-center gap-1.5 ${
                          cp.status === 'Blocked' ? 'text-rose-400 border border-rose-500/40' :
                          cp.status === 'Vulnerable' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {cp.status === 'Blocked' ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          <span>{cp.name}</span>
                        </div>
                        {idx < rt.checkpoints.length - 1 && (
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
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
