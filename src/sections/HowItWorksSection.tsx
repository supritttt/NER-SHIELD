import { CheckCircle2, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/landingData';

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
            Operational Lifecycle
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            A seamless four-tier intelligence pipeline transforming raw geospatial signals into dependable supply chain movements.
          </p>
        </div>

        {/* 4-Step Horizontal Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div
              key={item.step}
              className="ner-card p-6 flex flex-col justify-between hover:border-blue-200 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-blue-600 group-hover:scale-105 transition-transform">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    PHASE
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4">
                  {item.lead}
                </p>

                <ul className="space-y-2 border-t border-slate-100 pt-3">
                  {item.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Autonomous Sync</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
