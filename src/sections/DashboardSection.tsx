import { 
  Activity, 
  AlertTriangle, 
  CloudRain, 
  Truck, 
  ArrowUpRight, 
  TrendingDown, 
  TrendingUp 
} from 'lucide-react';

interface DashboardSectionProps {
  onOpenPlatform: () => void;
}

export function DashboardSection({ onOpenPlatform }: DashboardSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 border-b border-slate-200/70">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
              Operations Center Preview
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Regional Analytics.
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Live operational telemetry tracked across eight state transportation departments.
            </p>
          </div>

          <button
            onClick={onOpenPlatform}
            className="ner-btn-primary px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <span>Launch Operations Dashboard</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* TOP METRICS: 4 Clean Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <div className="ner-card p-5 bg-white">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-medium">Active Routes</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-slate-900">248</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18 dispatched safely today</span>
            </div>
          </div>

          <div className="ner-card p-5 bg-white">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-medium">High Risk Areas</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-amber-600">12</div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 mt-2 font-medium">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Down from 19 post-drainage clearance</span>
            </div>
          </div>

          <div className="ner-card p-5 bg-white">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-medium">Weather Alerts</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <CloudRain className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-indigo-900">7</div>
            <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 mt-2 font-medium">
              <span>3 IMD Orange Alerts in Meghalaya</span>
            </div>
          </div>

          <div className="ner-card p-5 bg-white">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-medium">Emergency Dispatches</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-rose-600">4</div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 font-medium">
              <span>All 4 in-transit with active escorts</span>
            </div>
          </div>

        </div>

        {/* ANALYTICS AREA: Split Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Route Disruption Visualization & Regional Risk (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Route Disruption Trends */}
            <div className="ner-card p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Route Disruption Trends (Last 7 Days)
                  </h3>
                  <p className="text-xs text-slate-500">Incident frequency vs preemptive diversions</p>
                </div>
                <span className="text-xs font-mono text-slate-400">TELEMETRY AGGREGATE</span>
              </div>

              {/* Clean Chart Simulation */}
              <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-slate-200 pb-2">
                {[
                  { day: 'Mon', disruptions: 8, diverted: 7 },
                  { day: 'Tue', disruptions: 14, diverted: 13 },
                  { day: 'Wed', disruptions: 22, diverted: 21 },
                  { day: 'Thu', disruptions: 18, diverted: 17 },
                  { day: 'Fri', disruptions: 11, diverted: 11 },
                  { day: 'Sat', disruptions: 9, diverted: 9 },
                  { day: 'Sun', disruptions: 12, diverted: 12 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${item.disruptions * 4}%` }}
                        className="w-3 rounded-t-sm bg-amber-400"
                        title={`Hazard: ${item.disruptions}`}
                      />
                      <div
                        style={{ height: `${item.diverted * 4}%` }}
                        className="w-3 rounded-t-sm bg-blue-600"
                        title={`AI Diverted: ${item.diverted}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{item.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Disruptions Detected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> AI Safely Diverted
                  </span>
                </div>
                <span className="font-semibold text-blue-700">96.8% Successful Bypass Rate</span>
              </div>
            </div>

            {/* Regional Accessibility Score Comparison */}
            <div className="ner-card p-6 bg-white">
              <h3 className="font-display text-base font-bold text-slate-900 mb-1">
                Regional Accessibility Index
              </h3>
              <p className="text-xs text-slate-500 mb-4">Relative ease of emergency transport access (0-100%)</p>

              <div className="space-y-3">
                {[
                  { state: 'Assam (Plains)', score: 86, color: 'bg-emerald-500' },
                  { state: 'Meghalaya (Plateau)', score: 74, color: 'bg-emerald-400' },
                  { state: 'Tripura (Lowland)', score: 79, color: 'bg-emerald-500' },
                  { state: 'Arunachal Pradesh (High Alpine)', score: 58, color: 'bg-amber-500' },
                  { state: 'Mizoram (Steep Ridges)', score: 62, color: 'bg-amber-400' },
                  { state: 'Sikkim (Teesta Corridor)', score: 51, color: 'bg-amber-600' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{item.state}</span>
                      <span className="text-slate-900 font-bold">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.score}%` }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Recent Incident Feed / Timeline (col-span-5) */}
          <div className="lg:col-span-5">
            <div className="ner-card p-6 bg-white h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Live Incident Dispatch Log
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>

                <div className="space-y-3">
                  {[
                    {
                      time: '12m ago',
                      type: 'Debris Flow',
                      severity: 'High',
                      location: 'NH-15, Banderdewa Pass',
                      state: 'Arunachal Pradesh',
                      action: 'Traffic rerouted via Gohpur bypass',
                      color: 'border-red-200 bg-red-50/50 text-red-900',
                    },
                    {
                      time: '46m ago',
                      type: 'Flash Flood Watch',
                      severity: 'Moderate',
                      location: 'NH-51, Garo Hills sector',
                      state: 'Meghalaya',
                      action: 'Warning sent to 14 fleet dispatchers',
                      color: 'border-amber-200 bg-amber-50/50 text-amber-900',
                    },
                    {
                      time: '2h ago',
                      type: 'Pavement Clearance',
                      severity: 'Resolved',
                      location: 'NH-6, Sonapur Tunnel',
                      state: 'Meghalaya / Assam border',
                      action: 'BRO earthmovers completed mud clearance',
                      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
                    },
                    {
                      time: '3h ago',
                      type: 'Oxygen Tanker Escort',
                      severity: 'Priority 1',
                      location: 'Guwahati → Silchar Hospital',
                      state: 'Assam',
                      action: 'Delivered safely without delay',
                      color: 'border-blue-200 bg-blue-50/50 text-blue-900',
                    },
                  ].map((inc, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${inc.color} text-xs space-y-1`}>
                      <div className="flex items-center justify-between font-semibold">
                        <span>{inc.type} — {inc.location}</span>
                        <span className="text-[10px] font-mono opacity-70">{inc.time}</span>
                      </div>
                      <div className="text-[11px] opacity-80">{inc.state} • {inc.severity}</div>
                      <div className="text-[11px] font-medium pt-1 border-t border-slate-200/40">
                        {inc.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Auto-refreshed via BRO feeds</span>
                <button
                  onClick={onOpenPlatform}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                >
                  View All Incidents →
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
