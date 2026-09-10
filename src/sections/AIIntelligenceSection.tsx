import { 
  CloudRain, 
  Satellite, 
  Car, 
  Clock, 
  Navigation, 
  Cpu, 
  CheckCircle, 
  ArrowDown, 
  Sparkles,
  Layers,
  Database
} from 'lucide-react';
import { PIPELINE_STEPS } from '../data/landingData';

const iconMap: Record<string, React.ElementType> = {
  CloudRain,
  Satellite,
  Car,
  Clock,
  Navigation,
  Cpu,
  CheckCircle,
};

export function AIIntelligenceSection() {
  return (
    <section id="ai-intelligence" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Narrative & Insights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Machine Learning Pipeline
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              AI That Sees Disruptions Before They Happen.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              The platform combines multiple regional data sources to identify patterns and estimate potential logistics disruptions across mountain passes, river islands, and fragile border highways.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-blue-600" />
                  Heterogeneous Data Fusion
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time Doppler precipitation feeds, radar moisture readings, optical satellite views, and civil telemetry are reconciled into a single unified spatial graph.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Topological Cost Optimization
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rather than solving purely for euclidean shortest distance, the pathfinding engine weights road segments dynamically by their continuous hazard risk coefficient.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 leading-relaxed">
              <strong>Regional Fact:</strong> During June–September, landslides account for over 68% of arterial highway closures in Arunachal Pradesh and Sikkim. Preemptive diversion reduces stranded vehicle wait times from 34 hours to under 45 minutes.
            </div>
          </div>

          {/* Right Column: Visual AI Intelligence Pipeline */}
          <div className="lg:col-span-7">
            <div className="ner-card p-6 sm:p-8 bg-slate-50/50">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Spatial Risk Inference Architecture
                  </h3>
                  <p className="text-xs text-slate-500">Live multi-source ingestion & neural routing flow</p>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Pipeline Active
                </span>
              </div>

              {/* Step Sequence */}
              <div className="space-y-3 relative">
                {PIPELINE_STEPS.map((step, index) => {
                  const Icon = iconMap[step.icon] || Cpu;
                  const isLast = index === PIPELINE_STEPS.length - 1;
                  const isAiEngine = step.name.includes('AI Risk Engine');

                  return (
                    <div key={step.id} className="relative">
                      <div
                        className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                          isLast
                            ? 'bg-blue-50/90 border-blue-300 shadow-sm'
                            : isAiEngine
                            ? 'bg-indigo-50/70 border-indigo-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isLast
                              ? 'bg-blue-600 text-white'
                              : isAiEngine
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-xs font-bold ${
                                isLast
                                  ? 'text-blue-900'
                                  : isAiEngine
                                  ? 'text-indigo-900'
                                  : 'text-slate-900'
                              }`}
                            >
                              {step.name}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400">
                              STEP 0{step.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                            {step.detail}
                          </p>
                        </div>
                      </div>

                      {/* Connector Arrow */}
                      {!isLast && (
                        <div className="flex justify-center py-1">
                          <div className="w-0.5 h-3 bg-slate-300 relative">
                            <ArrowDown className="w-3 h-3 text-slate-400 absolute -bottom-2.5 -left-[5px]" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
