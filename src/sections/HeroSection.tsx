import { ArrowRight, Layers } from 'lucide-react';
import { HeroMapPreview } from '../components/landing/HeroMapPreview';

interface HeroSectionProps {
  onOpenPlatform: () => void;
  onExploreMap: () => void;
}

export function HeroSection({ onOpenPlatform, onExploreMap }: HeroSectionProps) {
  return (
    <section id="hero" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-50/60 to-white">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Vision & Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-sm font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              AI-POWERED LOGISTICS INTELLIGENCE
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              Making North East India More Connected, Accessible and Resilient.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
              NER-Logistics combines AI, GIS, weather intelligence, satellite data and smart routing to predict disruptions and recommend safer, more accessible routes across the North Eastern Region of India.
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenPlatform}
                className="ner-btn-primary px-7 py-4 text-base font-semibold flex items-center justify-center gap-2.5 group shadow-md"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreMap}
                className="ner-btn-secondary px-7 py-4 text-base font-semibold text-slate-800 flex items-center justify-center gap-2.5 hover:border-slate-300"
              >
                <Layers className="w-5 h-5 text-slate-500" />
                <span>View Risk Map</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-extrabold font-display text-slate-900">8 States</div>
                <div className="text-sm text-slate-500 mt-1">Complete NE Regional Mesh</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold font-display text-blue-700">72%</div>
                <div className="text-sm text-slate-500 mt-1">Lower Landslide Exposure</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold font-display text-emerald-600">&lt; 15 min</div>
                <div className="text-sm text-slate-500 mt-1">Hazard Telemetry Sync</div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean GIS Preview Card */}
          <div className="lg:col-span-6">
            <HeroMapPreview />
          </div>

        </div>
      </div>
    </section>
  );
}
