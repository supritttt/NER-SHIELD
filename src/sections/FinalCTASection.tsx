import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface FinalCTASectionProps {
  onOpenPlatform: () => void;
  onExploreRiskMap: () => void;
}

export function FinalCTASection({ onOpenPlatform, onExploreRiskMap }: FinalCTASectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-700 text-white flex items-center justify-center mb-6 shadow-md">
          <Compass className="w-6 h-6" />
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Build Smarter. Move Safer. Connect Further.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Explore how AI-powered logistics intelligence can transform accessibility and disaster resilience across the North Eastern Region of India.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenPlatform}
            className="w-full sm:w-auto ner-btn-primary px-8 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 group shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExploreRiskMap}
            className="w-full sm:w-auto ner-btn-secondary px-8 py-3.5 text-sm font-semibold text-slate-800 flex items-center justify-center gap-2"
          >
            <span>Explore Risk Map</span>
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-6">
          <span>Enterprise GIS Ready</span>
          <span>•</span>
          <span>Zero Server Setup Required</span>
          <span>•</span>
          <span>Designed for Smart India Hackathon</span>
        </div>

      </div>
    </section>
  );
}
