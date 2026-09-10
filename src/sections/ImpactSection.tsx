import { ShieldAlert, Truck, Route, BarChart3 } from 'lucide-react';
import { IMPACT_METRICS } from '../data/landingData';

const iconMap: Record<string, React.ElementType> = {
  ShieldAlert,
  Truck,
  Route,
  BarChart3,
};

export function ImpactSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
            Measurable Regional Value
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for a More Connected North East.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Delivering mission-critical reliability to transport authorities, commercial logistics operators, and disaster management responders.
          </p>
        </div>

        {/* 4 Clean Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {IMPACT_METRICS.map((item, idx) => {
            const Icon = iconMap[item.iconName] || ShieldAlert;

            return (
              <div
                key={idx}
                className="ner-card p-6 flex flex-col justify-between hover:border-blue-200 transition-all group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mb-1">
                    {item.metric}
                  </div>
                  <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-3">
                    {item.subtext}
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>Impact validated on NER corridors</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
