import { 
  Cpu, 
  Map, 
  Satellite, 
  CloudRain, 
  Navigation, 
  Network, 
  Activity 
} from 'lucide-react';
import { CAPABILITIES } from '../data/landingData';

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Map,
  Satellite,
  CloudRain,
  Navigation,
  Network,
  Activity,
};

export function CapabilitiesSection() {
  return (
    <section id="features" className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left sm:text-center sm:mx-auto mb-14 sm:mb-20">
          <div className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2.5">
            Integrated Data Architecture
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            One Intelligence Platform. Multiple Data Sources.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Transform fragmented regional data into actionable logistics intelligence.
          </p>
        </div>

        {/* 7 Clean Capabilities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CAPABILITIES.map((item, index) => {
            const Icon = iconMap[item.iconName] || Cpu;
            const isLastOnLarge = index === CAPABILITIES.length - 1;

            return (
              <div
                key={item.id}
                className={`ner-card p-6 group hover:border-blue-200 transition-all ${
                  isLastOnLarge ? 'md:col-span-2 lg:col-span-3 xl:col-span-1' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors mb-5">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
