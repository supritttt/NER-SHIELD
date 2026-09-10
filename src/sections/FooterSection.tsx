import { Compass, Code2 } from 'lucide-react';

interface FooterSectionProps {
  onOpenPlatform: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export function FooterSection({ onOpenPlatform, onNavigateSection }: FooterSectionProps) {
  const scrollTo = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 sm:py-16 text-xs">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Brand & Synopsis */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-base text-white tracking-tight">
                NER-Logistics
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              AI-Based Smart Logistics and Accessibility Intelligence Platform for the North Eastern Region of India. Combining weather telemetry, satellite models, and risk-aware neural routing.
            </p>
            <div className="text-[11px] text-slate-500">
              Target States: AS • AR • ML • MN • MZ • NL • TR • SK
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="md:col-span-2 space-y-2">
            <div className="font-semibold text-white uppercase text-[11px] tracking-wider mb-2">
              Platform
            </div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={onOpenPlatform} className="hover:text-white transition-colors">
                  Operations Console
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('risk-map')} className="hover:text-white transition-colors">
                  Geospatial Risk Map
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('smart-routing')} className="hover:text-white transition-colors">
                  Dynamic Route Solver
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('ai-intelligence')} className="hover:text-white transition-colors">
                  Neural Prediction Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Science */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-semibold text-white uppercase text-[11px] tracking-wider mb-2">
              Regional Science
            </div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => scrollTo('about-ner')} className="hover:text-white transition-colors">
                  North East Terrain Context
                </button>
              </li>
              <li>
                <span className="text-slate-500">Brahmaputra Flood Dynamics</span>
              </li>
              <li>
                <span className="text-slate-500">IMD Doppler Precipitation Feeds</span>
              </li>
              <li>
                <span className="text-slate-500">Copernicus SAR Soil Moisture</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Organization & Contact */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-semibold text-white uppercase text-[11px] tracking-wider mb-2">
              Initiative
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Developed as an advanced engineering prototype for regional emergency logistics & civil transport resilience.
            </p>
            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 text-xs"
              >
                <Code2 className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 NER-Logistics. AI-Based Smart Logistics & Accessibility Intelligence Platform.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPlatform} className="hover:text-slate-300 transition-colors">
              Launch Platform
            </button>
            <span>•</span>
            <button onClick={() => scrollTo('hero')} className="hover:text-slate-300 transition-colors">
              Back to Top ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
