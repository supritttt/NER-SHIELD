import { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Zap
} from 'lucide-react';
import { ROUTE_COMPARISON_DATA } from '../data/landingData';

interface SmartRoutingSectionProps {
  onOpenPlatformRouting?: (origin: string, dest: string) => void;
}

export function SmartRoutingSection({ onOpenPlatformRouting }: SmartRoutingSectionProps) {
  const [selectedRouteKey, setSelectedRouteKey] = useState('guwahati-itanagar');
  const [activeTabRoute, setActiveTabRoute] = useState<'b' | 'a'>('b'); // default Route B (AI)

  const activeData = ROUTE_COMPARISON_DATA[selectedRouteKey];
  const routeA = activeData.routes[0];
  const routeB = activeData.routes[1];

  return (
    <section id="smart-routing" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/70">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
            Dynamic Route Solver
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Routes That Think Beyond Distance.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Compare standard shortest-path algorithms with our risk-aware neural routing engine across actual mountain corridors.
          </p>
        </div>

        {/* Route Origin/Destination Control Card */}
        <div className="ner-card p-4 sm:p-6 mb-8 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Origin:</span>
                <span className="font-semibold text-slate-900 px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">
                  {activeData.origin}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Destination:</span>
                <span className="font-semibold text-slate-900 px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">
                  {activeData.destination}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Select Corridor:</span>
              <select
                value={selectedRouteKey}
                onChange={(e) => setSelectedRouteKey(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="guwahati-itanagar">Guwahati → Itanagar</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Comparison Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ROUTE A: Conventional Highway */}
          <div 
            className={`ner-card p-6 sm:p-8 flex flex-col justify-between transition-all ${
              activeTabRoute === 'a' ? 'ring-2 ring-slate-400' : 'opacity-90 hover:opacity-100'
            }`}
            onClick={() => setActiveTabRoute('a')}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border border-slate-200">
                  {routeA.badge}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Risk ({routeA.riskScore}%)
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-slate-900 mb-1">
                {routeA.title}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Direct route prioritized strictly by minimum road kilometers
              </p>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-medium">Distance</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{routeA.distance}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-medium">Est. Travel Time</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{routeA.travelTime}</div>
                </div>
              </div>

              {/* Conditions & Vulnerabilities */}
              <div className="space-y-3 mb-6 text-xs">
                <div className="p-3 rounded-lg bg-red-50/60 border border-red-200/80 text-red-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Active Hazards Detected:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-red-800">
                    <li>Steep Banderdewa rockfall zone active (rainfall 42mm/hr)</li>
                    <li>Silt washouts on Jia Bhoreli low-level bridges</li>
                    <li>Estimated bottleneck clearance delay: +3h 45m</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Weather / Roadway</div>
                  <div className="text-xs font-medium text-slate-800 mt-0.5">{routeA.weatherAlert}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{routeA.roadCondition}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Standard GPS Recommendation</span>
              <span className="text-red-600 font-medium">Not Recommended in Monsoons</span>
            </div>
          </div>

          {/* ROUTE B: AI Recommended */}
          <div 
            className={`ner-card p-6 sm:p-8 flex flex-col justify-between bg-blue-50/30 border-2 border-blue-600 shadow-clean-elevated transition-all ${
              activeTabRoute === 'b' ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setActiveTabRoute('b')}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-3 h-3 fill-current" />
                  {routeB.badge}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Low Risk ({routeB.riskScore}%)
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-slate-900 mb-1">
                {routeB.title}
              </h3>
              <p className="text-xs text-blue-700 font-medium mb-6">
                Multi-objective optimization balancing elevation, bridge status, and rainfall radar
              </p>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-white border border-blue-200">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-medium">Distance</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{routeB.distance} (+26 km)</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-medium">Est. Travel Time</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{routeB.travelTime} (Safer)</div>
                </div>
              </div>

              {/* AI Justifications */}
              <div className="space-y-3 mb-6 text-xs">
                <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1.5">
                  <div className="font-semibold text-xs flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Why AI Recommends This Corridor:
                  </div>
                  <ul className="space-y-1 text-[11px] text-emerald-800">
                    {routeB.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-white border border-blue-200 text-slate-700">
                  <div className="text-[11px] font-semibold text-blue-800 uppercase">Weather / Roadway</div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">{routeB.weatherAlert}</div>
                  <div className="text-[11px] text-slate-600 mt-1">{routeB.roadCondition}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-200 flex items-center justify-between">
              <span className="text-xs text-blue-800 font-medium">Verified by BRO Road Clearance Bulletins</span>
              {onOpenPlatformRouting && (
                <button
                  onClick={() => onOpenPlatformRouting('Guwahati', 'Itanagar')}
                  className="ner-btn-primary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Dispatch via Route B</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
