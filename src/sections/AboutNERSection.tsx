import { Mountain, CloudRain, Link2, Truck, Compass } from 'lucide-react';

export function AboutNERSection() {
  return (
    <section id="about-ner" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Context & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Regional Terrain Challenges
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Why North East India Demands Specialized Logistics Intelligence.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Spanning over 262,000 square kilometers, the North Eastern Region is framed by high tectonic mountain ridges, the dynamic floodplains of the Brahmaputra and Barak basins, and the world’s heaviest monsoon rainfall belt.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Standard commercial navigation tools assume flat, uninterrupted, multi-lane highway grids. In the North East, a single 15-meter slope failure or cloudburst can isolate an entire state capital or border district for weeks.
            </p>

            {/* 4 Regional Reality Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                  <Mountain className="w-4 h-4 text-blue-600" />
                  Steep Alpine Slopes
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Over 70% of Arunachal, Mizoram, and Nagaland roads cut through young, tectonically active sedimentary strata.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                  <CloudRain className="w-4 h-4 text-blue-600" />
                  Heavy Monsoon Deluges
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Escarpments in Meghalaya receive over 11,000mm of precipitation annually, exceeding global saturation thresholds.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                  <Link2 className="w-4 h-4 text-blue-600" />
                  Single-Artery Chokepoints
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  States like Tripura and Mizoram rely on single lifeline highway corridors vulnerable to rockfall blockage.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Fragile Last-Mile Reach
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Over 3,400 mountain hamlets depend on single-lane kutcha roads for essential grains and vaccines.
                </p>
              </div>

            </div>

            {/* Closing Strong Statement */}
            <div className="pt-4 border-t border-slate-200">
              <p className="font-display text-lg sm:text-xl font-bold text-blue-900 leading-snug">
                “Technology can transform geographic challenges into intelligent logistics opportunities.”
              </p>
            </div>
          </div>

          {/* Right Column: Geographic Silhouette / Visual Card */}
          <div className="lg:col-span-5">
            <div className="ner-card p-6 sm:p-8 bg-slate-50/70 border border-slate-200 flex flex-col justify-between">
              
              <div className="text-center py-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-blue-100/70 flex items-center justify-center text-blue-700 mb-4 border border-blue-200">
                  <Mountain className="w-12 h-12" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  The Eight Sisters Network
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Assam • Arunachal • Meghalaya • Manipur • Mizoram • Nagaland • Tripura • Sikkim
                </p>
              </div>

              <div className="space-y-2.5 border-t border-slate-200 pt-5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Geographical Area</span>
                  <span className="font-bold text-slate-800">262,179 sq km</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">International Borders</span>
                  <span className="font-bold text-slate-800">5,182 km (98% of perimeter)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Monsoon Duration</span>
                  <span className="font-bold text-slate-800">May through October</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Siliguri Corridor ("Chicken's Neck")</span>
                  <span className="font-bold text-blue-700">22 km vital link</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
