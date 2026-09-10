import { TECH_STACK } from '../data/landingData';

export function TechStackSection() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 border-b border-slate-200/70">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
            Engineering & Infrastructure
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Production-Grade Technology Stack.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Engineered with modern spatial frameworks, neural routing models, and resilient microservices capable of disconnected offline fallback.
          </p>
        </div>

        {/* 5 Clean Category Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {TECH_STACK.map((group, idx) => (
            <div key={idx} className="ner-card p-5 bg-white flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                  {group.category}
                </h3>

                <div className="space-y-2.5">
                  {group.tools.map((tool, tIdx) => (
                    <div key={tIdx} className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800">{tool.name}</div>
                      <div className="text-[10px] text-slate-500">{tool.tag}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                TIER-0{idx + 1}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
