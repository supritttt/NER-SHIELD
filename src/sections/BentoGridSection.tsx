import { AlertTriangle, Route, MapPin, ShieldAlert, CheckCircle, ArrowUpRight } from 'lucide-react';

interface BentoGridSectionProps {
  onOpenPlatform: () => void;
  onOpenRiskMap: () => void;
}

export function BentoGridSection({ onOpenPlatform, onOpenRiskMap }: BentoGridSectionProps) {
  return (
    <section id="platform-overview" className="py-16 sm:py-24 bg-slate-50/50 border-b border-slate-200/70">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
            Core Modules
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Intelligence for Every Route.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Purpose-built geospatial algorithms designed for the terrain, weather, and isolation constraints of North East India.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Card 1: Predictive Disruption Intelligence (Large - col-span-7) */}
          <div className="lg:col-span-7 ner-card p-6 sm:p-8 flex flex-col justify-between hover:border-slate-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Predictive Disruption Engine
                </div>
                <span className="text-xs font-mono text-slate-400">MODEL-V4.2</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Predict disruptions before they impact critical logistics operations.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Continuous ML inference on precipitation gradients, antecedent soil moisture, and historical rockfall telemetry yields 12–48 hour advance warnings.
              </p>

              {/* Minimal Chart Simulation */}
              <div className="ner-card-inset p-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-medium text-slate-700">Monsoon Landslide Risk Projection (Next 24h)</span>
                  <span className="text-amber-600 font-semibold">Elevated Alert</span>
                </div>

                <div className="grid grid-cols-6 gap-2 items-end h-24 pt-4 border-b border-slate-200 pb-1">
                  {[
                    { h: '30%', label: '04:00', val: 'Low', color: 'bg-emerald-400' },
                    { h: '45%', label: '08:00', val: 'Med', color: 'bg-emerald-500' },
                    { h: '65%', label: '12:00', val: 'Warn', color: 'bg-amber-400' },
                    { h: '88%', label: '16:00', val: 'High', color: 'bg-amber-500' },
                    { h: '94%', label: '20:00', val: 'Peak', color: 'bg-red-500' },
                    { h: '70%', label: '00:00', val: 'Warn', color: 'bg-amber-400' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        style={{ height: bar.h }}
                        className={`w-full max-w-[32px] rounded-t-sm ${bar.color} transition-all duration-300`}
                      />
                      <span className="text-[10px] text-slate-500 font-mono">{bar.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Peak rockfall trigger probability at Banderdewa
                  </span>
                  <span className="font-mono text-slate-700 font-semibold">+68% vs baseline</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Trained on 10+ years of BRO & IMD event catalogues</span>
              <button
                onClick={onOpenPlatform}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                View Disruption Models <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Risk-Aware Smart Routing (col-span-5) */}
          <div className="lg:col-span-5 ner-card p-6 sm:p-8 flex flex-col justify-between hover:border-slate-300">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium mb-4">
                <Route className="w-3.5 h-3.5 text-blue-600" />
                Multi-Factor Routing
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Routes that think beyond distance.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Traditional navigation sends heavy trucks into active landslide bottlenecks. NER-Logistics balances distance against dynamic hazard cost surfaces.
              </p>

              {/* Minimal Comparison Widget */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Standard Navigation</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                      High Risk (78%)
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 mt-1">328 km • 8h 30m</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Crosses 2 active landslide zones & vulnerable low bridge</p>
                </div>

                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-800 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> NER-Logistics AI Path
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Low Risk (21%)
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">354 km • 9h 10m (+40m safer)</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Reinforced highway corridor, bypasses flood plain</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Weather + Soil + Slope + Pavement</span>
              <a href="#smart-routing" className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                Interactive Solver <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Digital GIS Risk Map (col-span-6) */}
          <div className="lg:col-span-6 ner-card p-6 sm:p-8 flex flex-col justify-between hover:border-slate-300">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-4">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Spatial Telemetry Grid
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Digital GIS Risk Map.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                Multi-layer geospatial visualization covering all 8 North Eastern states with interactive layer toggles and road segment health.
              </p>

              {/* GIS mini legend preview */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Safe Corridors (78%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Vulnerable Passes (14%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Blocked Arteries (8%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">AI Recommended</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Vector overlays for all 120+ NER districts</span>
              <button
                onClick={onOpenRiskMap}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                Inspect Full GIS Map <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Emergency Dispatch Priority (col-span-6) */}
          <div className="lg:col-span-6 ner-card p-6 sm:p-8 flex flex-col justify-between hover:border-slate-300">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium mb-4">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Civil Defense & Disaster Ready
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Emergency Dispatch Priority.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                Automated triage routing for life-saving medical supplies, oxygen cylinders, NDRF relief trucks, and critical civil supplies during monsoon emergencies.
              </p>

              {/* Priority list simulation */}
              <div className="space-y-2">
                {[
                  { tag: 'PRIORITY 1', title: 'Medical Cryogenic Oxygen Delivery', dest: 'Silchar Civil Hospital', status: 'Clear Escort Corridor' },
                  { tag: 'PRIORITY 2', title: 'NDRF Inflatable Boats & Water Gear', dest: 'Dhemaji Flood Zone', status: 'Alternative Bypass Armed' },
                  { tag: 'PRIORITY 3', title: 'Essential Grain Ration Fleet', dest: 'Aizawl Distribution Hub', status: 'Monitoring 2 Landslide Zones' },
                ].map((item, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded">
                          {item.tag}
                        </span>
                        <span className="font-semibold text-slate-800">{item.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">To {item.dest}</div>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Direct integration with SDRF & district magistrates</span>
              <button
                onClick={onOpenPlatform}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                Open Dispatch Console <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
